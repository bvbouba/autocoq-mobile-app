import { StyleSheet, View } from 'react-native';
import { Divider, fonts, PaddedView, Text } from '@/components/Themed';
import OrdersList from '@/components/orders/OrdersList';
import { ScrollView } from 'react-native';

export default function Orders() {
  return (
    <View style={styles.scrollContainer}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <PaddedView>
          <Text style={styles.subTitle}>Afficher et gérer vos commandes</Text>
        </PaddedView>
        <Divider />
        <OrdersList />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: "white", 
  },
  scroll: {
    flexGrow: 1,   
    width: "100%",
    padding: 16,   
  },
  title: {
    textAlign: "left",
    fontSize: fonts.h2,
    fontWeight: 'bold',
  },
  subTitle: {
    marginBottom: 16,
  },
});
