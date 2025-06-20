import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons, Feather, Entypo } from '@expo/vector-icons';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { supabase } from '../../../supabase-config';
import { useAuth } from '../../context/AuthContext';
import styles from './ProfileScreen.styles';
import mime from 'mime';

export default function ProfileScreen() {
  const { user, setUserManually } = useAuth();
  const navigation = useNavigation();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<
    'name' | 'email' | 'password' | ''
  >('');
  const [modalValue, setModalValue] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('Erreur', 'Échec de la déconnexion.');
    } else {
      setUserManually(null);
    }
  };

  const openEditModal = (type: 'name' | 'email' | 'password') => {
    setModalType(type);
    setModalValue(
      type === 'password'
        ? ''
        : user?.user_metadata?.displayName || user?.email || ''
    );
    setModalVisible(true);
  };

  const handleModalConfirm = async () => {
    const trimmed = modalValue.trim();
    if (!trimmed || !user) return;

    setIsUpdating(true);
    try {
      if (modalType === 'name') {
        const { error } = await supabase.auth.updateUser({
          data: { displayName: trimmed },
        });
        if (error) throw error;
        Alert.alert('Succès', 'Nom mis à jour.');
      } else if (modalType === 'email') {
        const { error } = await supabase.auth.updateUser({ email: trimmed });
        if (error) throw error;
        Alert.alert(
          'Vérification requise',
          `Un email a été envoyé à ${trimmed}. Veuillez confirmer pour finaliser.`
        );
      } else if (modalType === 'password') {
        const { error } = await supabase.auth.updateUser({ password: trimmed });
        if (error) throw error;

        Alert.alert(
          'Succès',
          'Mot de passe mis à jour. Vous allez être déconnecté pour sécurité.'
        );

        await supabase.auth.signOut();
        setUserManually(null);
        return;
      }
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Une erreur est survenue.');
    } finally {
      setModalVisible(false);
      setIsUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Supprimer le compte',
      'Cette action est irréversible. Voulez-vous vraiment continuer ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            setIsUpdating(true);
            try {
              const { data: session } = await supabase.auth.getSession();
              const accessToken = session?.session?.access_token;

              const res = await fetch(
                'https://hsjhreljjxfsutdwpjeh.functions.supabase.co/delete-user',
                {
                  method: 'POST',
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                  },
                }
              );

              if (!res.ok) throw new Error('Erreur de suppression');

              await supabase.auth.signOut();
              setUserManually(null);
              Alert.alert('Compte supprimé');
            } catch (err: any) {
              Alert.alert('Erreur', err.message || 'Échec de la suppression');
            } finally {
              setIsUpdating(false);
            }
          },
        },
      ]
    );
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    const { data } = await supabase.auth.getUser();
    if (data?.user) {
      setUserManually(data.user);
    }
    setRefreshing(false);
  };

  const handleUploadAvatar = async () => {
    if (!user) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (result.canceled || !result.assets || !result.assets[0]) return;

      const asset = result.assets[0];
      const uri = asset.uri;
      const fileExt = uri.split('.').pop() || 'jpg';
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;
      const contentType = mime.getType(uri) || 'image/jpeg';

      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const fileBytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, fileBytes, {
          contentType,
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData.publicUrl;

      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          avatar_url: publicUrl,
        },
      });

      if (updateError) throw updateError;

      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUserManually(data.user);
      }

      Alert.alert('Succès', 'Photo de profil mise à jour.');
    } catch (err: any) {
      console.error('Avatar upload failed:', err);
      Alert.alert('Erreur', err.message || 'Échec du téléchargement');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Mon Profil</Text>
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

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.profileSection}>
          <Image
            source={{
              uri:
                user?.user_metadata?.avatar_url ||
                'https://via.placeholder.com/100',
            }}
            style={styles.profileImage}
          />
          <Text style={styles.emailText}>{user?.email}</Text>
          {user?.user_metadata?.displayName && (
            <Text style={styles.nameText}>
              {user.user_metadata.displayName}
            </Text>
          )}
        </View>

        <View style={styles.options}>
          <TouchableOpacity
            style={styles.item}
            onPress={handleUploadAvatar}
            disabled={isUpdating}
          >
            <Feather name="image" size={22} color="white" />
            <Text style={styles.itemText}>Changer la photo de profil</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.item}
            onPress={() => openEditModal('name')}
            disabled={isUpdating}
          >
            <Feather name="user" size={22} color="white" />
            <Text style={styles.itemText}>Modifier le nom</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.item}
            onPress={() => openEditModal('email')}
            disabled={isUpdating}
          >
            <Ionicons name="mail" size={22} color="white" />
            <Text style={styles.itemText}>Changer l'adresse e-mail</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.item}
            onPress={() => openEditModal('password')}
            disabled={isUpdating}
          >
            <Entypo name="lock" size={22} color="white" />
            <Text style={styles.itemText}>Modifier le mot de passe</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.item}
            onPress={handleLogout}
            disabled={isUpdating}
          >
            <Feather name="log-out" size={22} color="#ff4d4d" />
            <Text style={[styles.itemText, { color: '#ff4d4d' }]}>
              Se déconnecter
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.item}
            onPress={handleDeleteAccount}
            disabled={isUpdating}
          >
            <MaterialIcons name="delete" size={22} color="#ff4d4d" />
            <Text style={[styles.itemText, { color: '#ff4d4d' }]}>
              Supprimer le compte
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => !isUpdating && setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            style={styles.modalContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <Text style={styles.modalTitle}>
              {
                {
                  name: 'Modifier le nom',
                  email: 'Modifier l’e-mail',
                  password: 'Modifier le mot de passe',
                }[modalType]
              }
            </Text>

            <TextInput
              style={styles.modalInput}
              value={modalValue}
              onChangeText={setModalValue}
              placeholder={
                {
                  name: 'Nouveau nom',
                  email: 'Nouvelle adresse e-mail',
                  password: 'Nouveau mot de passe',
                }[modalType]
              }
              keyboardType={modalType === 'email' ? 'email-address' : 'default'}
              autoCapitalize="none"
              placeholderTextColor="#aaa"
              secureTextEntry={modalType === 'password'}
              editable={!isUpdating}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => !isUpdating && setModalVisible(false)}
                disabled={isUpdating}
              >
                <Text style={styles.modalCancel}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleModalConfirm}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.modalConfirm}>Confirmer</Text>
                )}
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
