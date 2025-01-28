import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

const AuthPrompt = () => {
  const router = useRouter();

  const handleSignIn = () => {
    router.push('/account/auth');
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.promptText}>
        Login to receive more offers and rewards!
      </Text>
      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleSignIn}
      >
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 5,
    margin: 8,
    flexDirection: "row",
    // borderWidth: 1,
    // borderColor: 'red',
    justifyContent: "center",
    alignItems: "center",
    padding: 10,  
  },

  promptText: {
    fontSize: 14,
    color: "#333",
    width:"50%",
    paddingLeft: 20,
    marginBottom: 10,  
  },

  loginButton: {
    backgroundColor: '#007AFF',
    borderRadius: 25,
    paddingVertical: 10, 
    paddingHorizontal: 30,
    margin: 10,
    alignItems: 'center',  
    justifyContent: 'center', 
  },

  loginButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AuthPrompt;
