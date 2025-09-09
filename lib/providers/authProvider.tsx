import React, { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client/main.cjs";
import {
  CurrentUserDocument,
  useCreateTokenMutation,
  useRefreshTokenMutation,
  UserDetailsFragment,
} from "@/saleor/api.generated";
import { getConfig } from "@/config";
import { useAsyncStorage } from "../hooks/useLocalStorage";
import { jwtDecode } from "jwt-decode";

const apiUrl = getConfig().saleorApi;

const TOKEN = "@SaleorApp:authToken";
const REFRESH_TOKEN = "@SaleorApp:refreshToken";

interface JwtPayload {
  exp: number;
}

export interface UserConsumerProps {
  token: string | null;
  setToken: (token: string) => void;
  logout: () => void;
  user: UserDetailsFragment | undefined | null;
  error: string | null;
  loading: boolean;
  authenticated: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
}

const AuthContext = createContext<UserConsumerProps | undefined>(undefined);

export function useAuth(): UserConsumerProps {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}

const isTokenExpired = (token: string) => {
  try {
    const decoded: JwtPayload = jwtDecode(token);
    if (!decoded.exp) return true;
    return Date.now() >= decoded.exp * 1000;
  } catch {
    return true;
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useAsyncStorage(TOKEN, "", { sync: true });
  const [refreshToken, setRefreshToken] = useAsyncStorage(REFRESH_TOKEN, "", { sync: true });
  const [user, setUser] = useState<UserDetailsFragment | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [useLogin] = useCreateTokenMutation();
  const [useRefreshToken] = useRefreshTokenMutation();

  const apolloClient = new ApolloClient({
    link: new HttpLink({ uri: apiUrl }),
    cache: new InMemoryCache(),
  });

  // Login
  const login = async ({ email, password }: { email: string; password: string }) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await useLogin({ variables: { email, password } });
      if (data?.tokenCreate?.token) {
        setToken(data.tokenCreate.token);
        setRefreshToken(data.tokenCreate.refreshToken || "");
      } else {
        setError("Login failed");
      }
    } catch (err) {
      console.error(err);
      setError("Login failed");
    } finally {
      setLoading(false);
    }
  };

  // Refresh access token
  const refreshAccessToken = async (): Promise<string | null> => {
    if (!refreshToken) return null;
    try {
      const { data } = await useRefreshToken({ variables: { refreshToken } });
      if (data?.tokenRefresh?.token) {
        setToken(data.tokenRefresh.token);
        setError(null); // clear old error if refresh works
        return data.tokenRefresh.token;
      }
    } catch (err) {
      console.error("Token refresh failed:", err);
    }
    return null;
  };

  // Fetch current user
  const fetchUser = async (currentToken: string) => {
    if (!currentToken) {
      setUser(null);
      return;
    }
    setLoading(true);
    try {
      const { data } = await apolloClient.query({
        query: CurrentUserDocument,
        context: {
          headers: { authorization: `Bearer ${currentToken}` },
        },
      });
      setUser(data.me);
    } catch (err) {
      console.error("Failed to fetch user:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    setToken("");
    setRefreshToken("");
    setUser(null);
  };

  // Auto-refresh on app start
  useEffect(() => {
    const initAuth = async () => {
      if (!token && !refreshToken) {
        setLoading(false);
        return;
      }

      let currentToken: string | null = token;

      if (!currentToken || isTokenExpired(currentToken)) {
        currentToken = await refreshAccessToken();
      }

      if (!currentToken) {
        setUser(null);
        setLoading(false);
        return;
      }

      await fetchUser(currentToken);
      setLoading(false);
    };

    initAuth();
  }, [token, refreshToken]);

  const authenticated = !!user?.id;

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        logout,
        user,
        error,
        loading,
        authenticated,
        login,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
