import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { ApolloClient, ApolloError, InMemoryCache } from "@apollo/client";
import {
  CurrentUserDocument,
  useCreateTokenMutation,
  UserDetailsFragment,
  useRefreshTokenMutation,
  useVerifyTokenMutation,
} from "@/saleor/api.generated";
import { getConfig } from "@/config";
import { useAsyncStorage } from "../hooks/useLocalStorage";

const apiUrl = getConfig().saleorApi;

const TOKEN = "@SaleorApp:authToken";
const REFRESH_TOKEN = "@SaleorApp:refreshToken";

export interface UserConsumerProps {
  token: string;
  setToken: (token: string) => void;
  setRefreshToken: (token: string) => void;
  logout: () => void;
  user: UserDetailsFragment | undefined | null;
  error: string | null;
  loading: boolean;
  authenticated: boolean;
  checkAndRefreshToken: () => Promise<boolean>;
  login: ({ email, password }: {
    email: string;
    password: string;
}) => Promise<void>;

}

const AuthContext = createContext<UserConsumerProps | undefined>(undefined);

// Hook to use the context
export function useAuth(): UserConsumerProps {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);  
  const [user, setUser] = useState<UserDetailsFragment | null | undefined>(null);
  const [token, setToken] = useAsyncStorage(TOKEN, "", { sync: true });
  const [refreshToken, setRefreshToken] = useAsyncStorage(REFRESH_TOKEN, "", { sync: true });
  const [useVerifyToken] = useVerifyTokenMutation()
  const [useRefreshToken] = useRefreshTokenMutation()
  const [useLogin] = useCreateTokenMutation();


  const login = async ({email,password}:{email:string,password:string}) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await useLogin({
          variables: {
              email,
              password
          },
      });
      const errors = data?.tokenCreate?.errors || [];
      if (errors.length > 0) {
        setError(data?.tokenCreate?.errors[0]?.message || 'Une erreur inconnue est survenue.');
      } else {
          if (data?.tokenCreate?.token) {
              setToken(data?.tokenCreate?.token);
              setRefreshToken(data?.tokenCreate?.refreshToken||"");
          } else {
              setError('Échec de l’authentification. Veuillez réessayer.');
          }
      }
  } catch (err) {
      console.error('Login error:', err);
      setError('Impossible de se connecter. Veuillez réessayer.');
  } finally {
      setLoading(false);
  }
  }

  const apolloClient = new ApolloClient({
    uri: apiUrl,
    cache: new InMemoryCache(),
  });

  const verifyToken = async () => {
    if (!token) return false;

    try {
      const {data} = await useVerifyToken({
        variables: { token },
      });
      return data?.tokenVerify?.isValid || false;
    } catch (error) {
      console.error("Error verifying token:", error);
      return false;
    }
  };

  const refreshAccessToken = async () => {
    if (!refreshToken) return false;
  
    try {
      const { data } = await useRefreshToken({
        variables: { refreshToken },
      });
  
      if (data?.tokenRefresh?.token) {
        setToken(data.tokenRefresh.token);
        return data.tokenRefresh.token; 
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
    }
    return false;
  };

  const checkAndRefreshToken = async (): Promise<boolean> => {

    if (!token) return false;
    
    const isValid = await verifyToken();
    if (isValid) return true;

    const refreshed = await refreshAccessToken();
    if (refreshed) return true;

    logout();
    return false;
  };

  const fetchUser = async () => {
    if (!token) {
      setLoading(false);
      setUser(null);
      return;
    }
    setLoading(true)
    try {
      const result = await apolloClient.query({query:CurrentUserDocument,
        context: {
          headers: {
              authorization: token ? `Bearer ${token}` : "",
          },
      }});
      setUser(result.data.me);
      setError(error);
    } catch (error) {
      console.error("❌ Failed to fetch user:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken("");
    setRefreshToken("");
  };

  const authenticated = !!user?.id;

  useEffect(() => {
    fetchUser();
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, setToken, setRefreshToken, logout, user, error, loading, authenticated, checkAndRefreshToken,login }}>
      {children}
    </AuthContext.Provider>
  );
}
