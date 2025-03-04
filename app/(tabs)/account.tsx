import { StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator,Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import {Text, View , Divider,colors, fonts, PaddedView } from "@/components/Themed"
import { useRouter } from 'expo-router';
import ListItem from '@/components/ListItem';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/providers/authProvider';
import BannerAds from '@/components/layout/BannerAds';
import Loading from '@/components/Loading';
import { useModal } from '@/context/useModal';
import Auth from '@/components/account/auth';
import { useLoading } from '@/context/LoadingContext';
import { useMessage } from '@/context/MessageContext';

export default function AccountScreen() {
  const router = useRouter();
  const { user, loading, logout,authenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const {openModal} = useModal()
  const {setLoading} = useLoading()
  const { showMessage } = useMessage();

  useEffect(()=>{
    setLoading(loading)
  },[loading])

  const handleSignOut = async () => {
    setIsLoading(true); 
    try {
      logout();
      router.push('/account');
    } catch (error) {
      showMessage("Erreur lors de la déconnexion")
    } finally {
      setIsLoading(false); // Arrête le chargement
    }
  };


  return (
    <View style={[styles.scrollContainer, {
    }]}>
      <ScrollView style={styles.scroll}>
        <PaddedView style={styles.header}>
        <TouchableOpacity
              style={{flexDirection:"row"}}
              onPress={() => router.push('/account/profile')}
              disabled={!authenticated}
            >
          <FontAwesome name="user-circle" size={20} color={colors.primary} />
          <View style={{flexDirection:"column"}}>
          <View style={styles.titleWrapper}>
          <Text style={styles.title}>Bienvenue</Text>
          <Text style={styles.title}>{authenticated ? `,${user?.firstName}` : ""}</Text>
          </View>
          {authenticated && <View style={{}}>
           <Text> Voir le Profil</Text>
          </View>
          }
          </View>
          </TouchableOpacity>
        </PaddedView>
        {/* {!user?.id && <View>
          <BannerAds slug="banner-pub-account" />
        </View>} */}

        <View style={styles.accountButtonContainer}>
          {!user?.id && (
            <TouchableOpacity style={styles.signUpButton} onPress={()=>{
              openModal({
                id:"Auth",
                content:<Auth />})
            }}>
              <Text style={styles.signUpButtonText}>
                SE CONNECTER OU CRÉER UN COMPTE
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.list}>
          <ListItem name="Mes commandes" onPress={()=>router.push("/account/orders")} />
          <Divider />
          {user?.id && <><ListItem name="Mes adresses" onPress={()=>router.push("/account/addresses")} />
                        <Divider />
                        </>
          }
          <ListItem name="FAQ" onPress={()=>router.push("/account/faq")} />
          <Divider />
          <ListItem name="Conditions générales" onPress={()=>router.push("/account/terms")} />

          {user?.id && (
            <View style={{marginTop:50}}>
              <TouchableOpacity
                style={[styles.signUpButton, isLoading && styles.disabledButton]}
                onPress={handleSignOut}
                disabled={isLoading} // Désactiver le bouton pendant le chargement
              >
                {loading ? <ActivityIndicator color="white" /> : <Text style={styles.signUpButtonText}>{'SE DÉCONNECTER'}</Text>}
              </TouchableOpacity>


            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    paddingTop:50,
    paddingHorizontal:15,
  },
  scroll: {
    width: "100%",
  },
  titleWrapper: {
    marginLeft: 8,
    flexDirection:"row",
    textAlign: "center",
  },
  title: {
    fontSize:fonts.h2,
    fontWeight: "500",
    textTransform: "capitalize"
  },
  subTitle: {
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
  },
  accountButtonContainer: {
    marginVertical: 15,
    width: "100%",
  },
  signUpButton: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 15,
    alignItems: "center",
  },
  signUpButtonText: {
    color: "#fff",
    fontWeight: "400",
  },
  myAccount: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 40,
  },
  myAccountText: {
    color: "white",
    fontWeight: "bold",
    fontSize:fonts.h2,
    marginLeft: 10,
  },
  menuItem: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginLeft: 30,
  },
  menuText: {
    fontSize:fonts.h2,
    color: "#333",
  },
  signOutText: {
    color: "#FF3B30",
    fontWeight: "bold",
  },
  disabledButton: {
    opacity: 0.6, // Atténuer le bouton pour indiquer qu'il est désactivé
  },
  list: {
    marginTop: 20,
  },
});
