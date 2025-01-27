import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { getConfig } from "@/config";
import { setContext } from "@apollo/client/link/context";
import { customStorage } from "@/utils/auth/customStorage";

const apiUrl = getConfig().saleorApi;


const authLink = setContext(async (_, { headers }) => {
  const token = await customStorage.getItem("authToken"); 
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const httpLink = createHttpLink({
  uri: apiUrl,  
});

const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),  
  cache: new InMemoryCache(),
});


export default apolloClient;
