import { Divider } from '@/components/Themed';
import { useAuth } from '@/lib/providers/authProvider';
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
        <Text style={styles.title}>About Me</Text></View>
      <View style={styles.row}>
        <Text style={styles.label}>Username: </Text>
        <Text style={styles.value}>{user?.firstName}</Text>
      </View>
      <Divider/>
      <View style={styles.row}>
        <Text style={styles.label}>Phone Number: </Text>
        <Text style={styles.value}>{phoneNumber}</Text>
      </View>
      <Divider/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"white",
    padding:10
  },
  row: {

    flexDirection: 'column',

  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#555',
  },
  value: {
    fontSize: 16,
    fontWeight: '400',
    color: '#000',
    textTransform: "uppercase"
  },
  title:{
    fontSize:16,
    fontWeight:"bold",
    marginBottom:10
  }
});
