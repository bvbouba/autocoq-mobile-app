import { StyleSheet, View, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Text, Divider, PaddedView } from '../../components/Themed';
import { useRouter } from 'expo-router';
import ListItem from '@/components/ListItem';
import { useCurrentUserQuery } from '@/saleor/api.generated';
import { useSaleorAuthContext } from '@saleor/auth-sdk/react';
import { customStorage } from '@/utils/auth/customStorage';
import { useState } from 'react';

export default function AccountScreen() {
  const router = useRouter();
  const { signOut } = useSaleorAuthContext();
  const { data: currentUser, loading } = useCurrentUserQuery();
  const [isLoading, setIsLoading] = useState(false); 

  const handleSignIn = () => {
    router.push('/account/auth');
  };

  const handleSignOut = async () => {
    setIsLoading(true); // Start loading
    try {
      signOut();
      await customStorage.removeItem('authToken');
      router.push('/');
    } catch (error) {
      console.error('Error during sign-out:', error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  if (loading) {
    return (
      <View style={styles.scrollContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.scrollContainer}>
      <ScrollView style={styles.scroll}>
        <View style={styles.header}>
          <FontAwesome name="user-circle" size={28} color="#007AFF" />
          <Text style={styles.title}>
            {currentUser?.me ? 'Welcome back!' : 'Welcome!'}
          </Text>
        </View>

        <View style={styles.accountButtonContainer}>
          {currentUser?.me ? (
            <View style={styles.myAccount}>
              <FontAwesome name="user" size={20} color="white" />
              <Text style={styles.myAccountText}>My Account</Text>
            </View>
          ) : (
            <TouchableOpacity style={styles.signUpButton} onPress={handleSignIn}>
              <Text style={styles.signUpButtonText}>Sign In</Text>
            </TouchableOpacity>
          )}
        </View>

        <PaddedView>
          {currentUser?.me && <ListItem name="My Profile" url="account/profile" />}
          <ListItem name="My Orders" url="account/orders" />
          <ListItem name="FAQ" url="account/faq" />
          <ListItem name="Terms and Conditions" url="account/terms" />

          {currentUser?.me && (
            <>
              <Divider />
              <TouchableOpacity
                style={[styles.menuItem, isLoading && styles.disabledButton]}
                onPress={handleSignOut}
                disabled={isLoading} // Disable button while loading
              >
                <Text style={[styles.menuText, styles.signOutText]}>
                  {isLoading ? 'Signing out...' : 'Sign Out'}
                </Text>
           
              </TouchableOpacity>
            </>
          )}
        </PaddedView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 70,
  },
  scroll: {
    width: '100%',
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subTitle: {
    marginBottom: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  accountButtonContainer: {
    alignItems: 'center',
    marginVertical: 15,
  },
  signUpButton: {
    backgroundColor: '#007AFF',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 40,
  },
  signUpButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  myAccount: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 40,
  },
  myAccountText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 10,
  },
  menuItem: {
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
  signOutText: {
    color: '#FF3B30',
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.6, // Dim the button to indicate it is disabled
  },
  loadingIndicator: {
    marginLeft: 10,
  },
});
