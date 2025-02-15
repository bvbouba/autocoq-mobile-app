import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

import { fonts, Text, View } from '@/components/Themed';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oups !' }} />
      <View style={styles.container}>
        <Text style={styles.title}>Cet écran n'existe pas.</Text>

        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Aller à l'écran d'accueil !</Text>
        </Link>
      </View>
    </>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: fonts.h2,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: fonts.body,
    color: '#2e78b7',
  },
});
