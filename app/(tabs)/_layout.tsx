import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { useColorScheme, StyleSheet } from 'react-native';

import {  Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useCartContext } from '@/context/useCartContext';
import HeaderBack from '@/components/layout/HeaderBack';
import SearchHeader from '@/components/layout/SearchHeader';
import SimpleBackHeader from '@/components/layout/SimpleBackHeader';
import SimpleCloseHeader from '@/components/layout/SimpleCloseHeader';

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
  number?: number
}) {
  return <View style={{ position: "relative" }}>
    <FontAwesome size={25} style={{ marginBottom: -3 }} {...props} />
    {props.number && <Text style={styles.cartCountIcon}>{props.number}</Text>}
  </View>

}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const companyName = "AUTOCOQ";
  const {delivery} = useCartContext()
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          height: 70,
          paddingBottom: 10,
          paddingTop: 5,
        },
        tabBarIconStyle: {
          marginBottom: 2,
        },
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerStyle: {
        },
        tabBarInactiveTintColor: '#555555',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '',
          headerShown: true,
         header: () => <SearchHeader withBack={false} cleanSearch companyName={companyName}/>,
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          tabBarLabel: 'Accueil',
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: '',
          headerShown: true,
          header: () => <SearchHeader withBack={true}  cleanSearch companyName={companyName}/>,
          tabBarIcon: ({ color }) => <TabBarIcon name="shopping-bag" color={color} />,
          tabBarLabel: 'Boutique',
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: '',
          headerShown: true,
          header:()=><SimpleCloseHeader  title="Panier" subTitle={delivery.zone ? `Ma zone: ${delivery.zone}` : ""} />,
          tabBarIcon: ({ color }) => {
            const { cart } = useCartContext();
            return <TabBarIcon
              name="shopping-cart"
              color={color}
              number={cart && cart.lines.length > 0 ? cart.lines.map(line => line.quantity).reduce((prev, curr) => prev + curr, 0) : undefined}
            />;
          },
          tabBarLabel: 'Panier',
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: '',
          headerShown: false,
          header: () => <SearchHeader withBack={false} cleanSearch companyName={companyName}/>,
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
          tabBarLabel: 'Compte',
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  cartCountIcon: {
    position: 'absolute',
    right: -20
  },
});
