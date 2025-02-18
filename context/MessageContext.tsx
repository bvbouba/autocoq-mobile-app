import { colors } from '@/components/Themed';
import React, { createContext, useContext, useState, ReactNode,useEffect } from 'react';
import { Text, TouchableOpacity, Animated, StyleSheet } from "react-native";


const MessageBox = ({ message, duration = 5000 }:{message:string, duration:number}) => {
  const [visible, setVisible] = useState(true);
  const fadeAnim = new Animated.Value(0); 
  
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      handleDismiss();
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setVisible(false));
  };

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <TouchableOpacity onPress={handleDismiss} activeOpacity={0.8}>
        <Text style={styles.text}>{message}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 80,
    left: 20,
    right: 20,
    backgroundColor: colors.textSecondary,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
});

interface MessageContextType {
  showMessage: (message: string, duration?: number) => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(5000);

  const showMessage = (message: string, duration: number = 5000) => {
    setMessage(message);
    setDuration(duration);
  };

  return (
    <MessageContext.Provider value={{ showMessage }}>
      {children}
      {message && <MessageBox message={message} duration={duration} />}
    </MessageContext.Provider>
  );
};

export const useMessage = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error("useMessage must be used within a MessageProvider");
  }
  return context;
};
