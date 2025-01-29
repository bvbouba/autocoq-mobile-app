import LoginForm from '@/components/auth/loginForm';
import SignUpForm from '@/components/auth/signupForm';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const AuthScreen = () => {
    const [isLogin, setIsLogin] = useState(true);

    const toggleForm = () => setIsLogin(!isLogin);

    return (
        <View style={{ paddingTop: 20 }}>
            <View style={styles.titleContainer}>
                <TouchableOpacity
                    onPress={toggleForm}
                    style={[styles.titleButton, isLogin && styles.activeButton]}
                >
                    <Text style={[styles.title, isLogin && styles.activeText]}>
                        Login
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={toggleForm}
                    style={[styles.titleButton, !isLogin && styles.activeButton]}
                >
                    <Text style={[styles.title, !isLogin && styles.activeText]}>
                        Sign Up
                    </Text>
                </TouchableOpacity>
            </View>
            <View>
            {isLogin ? (
                <LoginForm  />
            ) : (
                <SignUpForm  />
            )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
  titleContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 10,
      width: '100%', 
  },
  titleButton: {
      flex: 1,
      paddingVertical: 10, 
      justifyContent: 'center', 
      alignItems: 'center',
  },
  title: {
      fontSize: 24,
  },
  activeButton: {
      backgroundColor: 'white',
  },
  activeText: {
      textDecorationLine: 'underline',
  },
});

export default AuthScreen;
