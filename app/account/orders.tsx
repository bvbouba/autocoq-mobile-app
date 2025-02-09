import { StyleSheet, View } from 'react-native';
import { Divider, fonts, PaddedView, Text } from '../../components/Themed';
import OrdersList from '../../components/orders/OrdersList';
import { ScrollView } from 'react-native-gesture-handler';

export default function Orders() {
  return (
    <View style={styles.scrollContainer}>
      <ScrollView style={styles.scroll}>
        <PaddedView>
          {/* <Text style={styles.title}>Vos commandes</Text> */}
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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "white"
  },
  scroll: {
    width: "100%",
  },
  title: {
    textAlign: "left",
    fontSize:fonts.h2,
    fontWeight: 'bold',
  },
  subTitle: {
    marginBottom: 16
  }
});
