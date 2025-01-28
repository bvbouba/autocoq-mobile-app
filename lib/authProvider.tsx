import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { ApolloClient, ApolloError, createHttpLink, InMemoryCache } from "@apollo/client";
import { useRouter } from "expo-router";
import { CurrentUserDocument, useCurrentUserQuery, UserDetailsFragment } from "@/saleor/api.generated";
import { useAsyncStorage } from "./hooks/useLocalStorage";
import { customStorage } from "@/utils/auth/customStorage";
import { setContext } from "@apollo/client/link/context";
import { getConfig } from "@/config";

const apiUrl = getConfig().saleorApi;


export interface UserConsumerProps {
  token: string;
  setToken: (token: string) => void;
  resetToken: () => void;
  user: UserDetailsFragment | undefined | null;
  error: ApolloError | undefined;
loading: boolean;
authenticated:boolean;
}

const AuthContext = createContext<UserConsumerProps | undefined>(undefined);

// Hook to use the context
export function useAuth(): UserConsumerProps {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
}

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<ApolloError>();
  const [user, setUser] = useState<UserDetailsFragment|null>();
  const [token, setToken] = useAsyncStorage("authToken", "", { sync: true });
  
  const authLink = setContext(async (_, { headers }) => {
      return {
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : "",
        },
      };
    }
   );
  
  const httpLink = createHttpLink({
    uri: apiUrl,  
  });
  
  const apolloClient = new ApolloClient({
    link: authLink.concat(httpLink),  
    cache: new InMemoryCache(),
  });

  const fetchUser = async () => {
    const token = await customStorage.getItem("authToken");
    if (!token) {
      setLoading(false);
      setUser(null);
      return;
    }

    try {
      const response = await apolloClient.query({
        query: CurrentUserDocument
      });
      setUser(response.data.me);
      setError(response.error)
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const resetToken = () => setToken("");
  const authenticated = !!user?.id;

  useEffect(() => {
    fetchUser();
  }, [token]);

  const providerValues: UserConsumerProps = {
    token,
    setToken,
    resetToken: resetToken,
    user,
    error,
    loading,
    authenticated
  };

  return <AuthContext.Provider value={providerValues}>{children}</AuthContext.Provider>;
}
