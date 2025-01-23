import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import React from "react";
import { StatusBar, View } from "react-native";

const client = new ApolloClient({
	uri: "https://demo.saleor.io/graphql/",
	cache: new InMemoryCache(),
});

export default function App() {
	return (
		<ApolloProvider client={client}>
			<View style={""}>
				<Text>Open up App.tsx to start working on your app!</Text>
				<StatusBar style="auto" />
			</View>
		</ApolloProvider>
	);
}