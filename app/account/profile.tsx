import { Divider } from '@/components/Themed';
import { useAuth } from '@/lib/authProvider';
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default function ProfileScreen() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const phoneNumber = user?.email.split("@")[0];

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>Username: </Text>
        <Text style={styles.value}>{user?.firstName}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Phone Number: </Text>
        <Text style={styles.value}>{phoneNumber}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50, // Align content to the top
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15, // Space between rows
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
  },
  value: {
    fontSize: 16,
    fontWeight: '400',
    color: '#000',
  },
});
