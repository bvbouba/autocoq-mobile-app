import { StyleSheet, View, Text } from 'react-native';

export default function TermsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Terms and Conditions Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
