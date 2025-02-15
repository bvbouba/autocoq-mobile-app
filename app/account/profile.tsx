import { Divider, fonts, PaddedView } from '@/components/Themed';
import { useAuth } from '@/lib/providers/authProvider';
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default function ProfileScreen() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.container}>
        <PaddedView>
          <Text>Chargement...</Text>
        </PaddedView>
      </View>
    );
  }

  const phoneNumber = user?.email.split("@")[0];

  return (
    <View style={styles.container}>
      <View style={styles.row}> 
        <Text style={styles.title}>À propos de moi</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Nom d'utilisateur : </Text>
        <Text style={styles.value}>{user?.firstName}</Text>
      </View>
      <Divider/>
      <View style={styles.row}>
        <Text style={styles.label}>Numéro de téléphone : </Text>
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
    fontSize:fonts.caption,
    fontWeight: '600',
    color: '#555',
  },
  value: {
    fontSize:fonts.h2,
    fontWeight: '400',
    color: '#000',
    textTransform: "uppercase"
  },
  title:{
    fontSize:fonts.h2,
    fontWeight:"bold",
    marginBottom:10
  }
});
