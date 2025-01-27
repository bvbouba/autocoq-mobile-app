import { StyleSheet, View } from 'react-native';

import { Divider, PaddedView, Text } from '../../components/Themed';
import OrdersList from '../../components/orders/OrdersList';
import { ScrollView } from 'react-native-gesture-handler';

export default function Orders() {
  return (
    <View style={styles.scrollContainer}>
      <ScrollView style={styles.scroll}>
        <PaddedView>
          <Text style={styles.title}>Your Orders</Text>
          <Text style={styles.subTitle}>View and manage your orders</Text>
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
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:50
  },
  scroll: {
    width: "100%",
  },
  title: {
    textAlign: "left",
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8
  },
  subTitle: {
    marginBottom: 16
  }
});
