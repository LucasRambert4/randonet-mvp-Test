import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons, Entypo, Feather } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { supabase } from '../../../supabase-config';
import styles from './AccountScreen.styles';

export default function AccountScreen() {
  const { user, setUserManually } = useAuth();
  const navigation = useNavigation();

  const handleChangeDisplayName = () => {
    if (Platform.OS === 'ios') {
      Alert.prompt(
        "Nom d'utilisateur",
        'Entrez un nouveau nom :',
        [
          { text: 'Annuler', style: 'cancel' },
          {
            text: 'Confirmer',
            onPress: async (newName) => {
              if (!newName.trim()) return;
              try {
                const { error, data } = await supabase.auth.updateUser({
                  data: { displayName: newName.trim() },
                });
                if (error) throw error;
                Alert.alert('Succès', 'Nom mis à jour.');
              } catch (error: any) {
                Alert.alert('Erreur', error.message);
              }
            },
          },
        ],
        'plain-text',
        user?.user_metadata?.displayName || ''
      );
    } else {
      Alert.alert(
        'Fonction non supportée sur Android sans modale personnalisée.'
      );
    }
  };

  const handleChangeEmail = () => {
    if (Platform.OS === 'ios') {
      Alert.prompt(
        'Nouvel email',
        'Entrez votre nouvelle adresse e-mail :',
        [
          { text: 'Annuler', style: 'cancel' },
          {
            text: 'Confirmer',
            onPress: async (newEmail) => {
              if (!newEmail.trim()) return;
              try {
                const { error } = await supabase.auth.updateUser({
                  email: newEmail.trim(),
                });
                if (error) throw error;
                Alert.alert(
                  'Succès',
                  'Adresse email mise à jour. Veuillez vérifier votre nouveau mail.'
                );
              } catch (error: any) {
                Alert.alert('Erreur', error.message);
              }
            },
          },
        ],
        'plain-text',
        user?.email || ''
      );
    } else {
      Alert.alert(
        'Fonction non supportée sur Android sans modale personnalisée.'
      );
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        <View style={styles.userInfo}>
          <Text style={styles.emailText}>{user?.email}</Text>
          {user?.user_metadata?.displayName ? (
            <Text style={styles.nameText}>
              {user.user_metadata.displayName}
            </Text>
          ) : null}
        </View>

        <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        >
          <Image
            source={{
              uri:
                user?.user_metadata?.avatar_url ||
                'https://via.placeholder.com/40',
            }}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>

      {/* Body */}
      <ScrollView contentContainerStyle={styles.body}>
        <TouchableOpacity style={styles.item} onPress={handleChangeEmail}>
          <MaterialIcons name="email" size={24} color="white" />
          <Text style={styles.itemText}>Changer d'adresse e-mail</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={handleChangeDisplayName}>
          <Ionicons name="person-circle-outline" size={24} color="white" />
          <Text style={styles.itemText}>Modifier le nom d'utilisateur</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item}>
          <Feather name="phone" size={24} color="white" />
          <Text style={styles.itemText}>Changer de numéro</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item}>
          <Entypo name="lock" size={24} color="white" />
          <Text style={styles.itemText}>Modifier le mot de passe</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item}>
          <MaterialIcons name="delete" size={24} color="white" />
          <Text style={styles.itemText}>Supprimer le compte</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
