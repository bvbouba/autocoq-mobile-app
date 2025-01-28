import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Text, Divider, PaddedView } from '../../components/Themed';
import { useRouter } from 'expo-router';
import ListItem from '@/components/ListItem';
import { useState } from 'react';
import { useAuth } from '@/lib/authProvider';

export default function AccountScreen() {
  const router = useRouter();
  const { user, loading,  resetToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false); 
  
  
  const handleSignIn = () => {
    router.push('/account/auth');
  };

  const handleSignOut = async () => {
    setIsLoading(true); // Start loading
    try {
      resetToken()
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
            {user?.id ? 'Welcome back!' : 'Welcome!'}
          </Text>
        </View>

        <View style={styles.accountButtonContainer}>
          {user?.id ? (
            <TouchableOpacity style={styles.myAccount} onPress={()=>router.push('/account/profile')}>
              <FontAwesome name="user" size={20} color="white" />
              <Text style={styles.myAccountText}>My Account</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.signUpButton} onPress={handleSignIn}>
              <Text style={styles.signUpButtonText}>Sign In</Text>
            </TouchableOpacity>
          )}
        </View>

        <PaddedView>
          <ListItem name="My Orders" url="account/orders" />
          {user?.id && <ListItem name="My Addresses" url="account/addresses" />}
          <ListItem name="FAQ" url="account/faq" />
          <ListItem name="Terms and Conditions" url="account/terms" />

          {user?.id && (
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
    marginLeft:30
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
