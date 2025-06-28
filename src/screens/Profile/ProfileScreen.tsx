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
import { useTranslation } from 'react-i18next';
import styles from './ProfileScreen.styles';
import mime from 'mime';

export default function ProfileScreen() {
  const { user, setUserManually } = useAuth();
  const navigation = useNavigation();
  const { t } = useTranslation();

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
      Alert.alert(
        t('profile.logoutErrorTitle'),
        t('profile.logoutErrorMessage')
      );
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
        Alert.alert(
          t('profile.updateNameSuccessTitle'),
          t('profile.updateNameSuccessMessage')
        );
      } else if (modalType === 'email') {
        const { error } = await supabase.auth.updateUser({ email: trimmed });
        if (error) throw error;
        Alert.alert(
          t('profile.updateEmailTitle'),
          t('profile.updateEmailMessage', { email: trimmed })
        );
      } else if (modalType === 'password') {
        const { error } = await supabase.auth.updateUser({ password: trimmed });
        if (error) throw error;

        Alert.alert(
          t('profile.updatePasswordSuccessTitle'),
          t('profile.updatePasswordSuccessMessage')
        );

        await supabase.auth.signOut();
        setUserManually(null);
        return;
      }
    } catch (err: any) {
      Alert.alert(
        t('profile.deleteAccountErrorTitle'),
        err.message || t('profile.deleteAccountErrorMessage')
      );
    } finally {
      setModalVisible(false);
      setIsUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      t('profile.deleteAccountTitle'),
      t('profile.deleteAccountMessage'),
      [
        { text: t('profile.deleteAccountCancel'), style: 'cancel' },
        {
          text: t('profile.deleteAccountConfirm'),
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

              if (!res.ok)
                throw new Error(t('profile.deleteAccountErrorMessage'));

              await supabase.auth.signOut();
              setUserManually(null);
              Alert.alert(t('profile.deleteAccountSuccess'));
            } catch (err: any) {
              Alert.alert(
                t('profile.deleteAccountErrorTitle'),
                err.message || t('profile.deleteAccountErrorMessage')
              );
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

      if (result.canceled || !result.assets?.[0]) return;
      const uri = result.assets[0].uri;
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
        .upload(filePath, fileBytes, { contentType, upsert: true });
      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      const publicUrl = publicUrlData.publicUrl;

      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl },
      });
      if (updateError) throw updateError;

      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) setUserManually(userData.user);

      Alert.alert(
        t('profile.updateNameSuccessTitle'),
        t('profile.updateNameSuccessMessage')
      );
    } catch (err: any) {
      console.error('Avatar upload failed:', err);
      Alert.alert(
        t('profile.logoutErrorTitle'),
        err.message || t('profile.logoutErrorMessage')
      );
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>{t('profile.title')}</Text>
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
            <Text style={styles.itemText}>{t('profile.uploadAvatar')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.item}
            onPress={() => openEditModal('name')}
            disabled={isUpdating}
          >
            <Feather name="user" size={22} color="white" />
            <Text style={styles.itemText}>{t('profile.editName')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.item}
            onPress={() => openEditModal('email')}
            disabled={isUpdating}
          >
            <Ionicons name="mail" size={22} color="white" />
            <Text style={styles.itemText}>{t('profile.changeEmail')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.item}
            onPress={() => openEditModal('password')}
            disabled={isUpdating}
          >
            <Entypo name="lock" size={22} color="white" />
            <Text style={styles.itemText}>{t('profile.editPassword')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.item}
            onPress={handleLogout}
            disabled={isUpdating}
          >
            <Feather name="log-out" size={22} color="#ff4d4d" />
            <Text style={[styles.itemText, { color: '#ff4d4d' }]}>
              {t('profile.logout')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.item}
            onPress={handleDeleteAccount}
            disabled={isUpdating}
          >
            <MaterialIcons name="delete" size={22} color="#ff4d4d" />
            <Text style={[styles.itemText, { color: '#ff4d4d' }]}>
              {t('profile.deleteAccount')}
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
              {modalType === 'name'
                ? t('profile.modalTitleName')
                : modalType === 'email'
                ? t('profile.modalTitleEmail')
                : t('profile.modalTitlePassword')}
            </Text>

            <TextInput
              style={styles.modalInput}
              value={modalValue}
              onChangeText={setModalValue}
              placeholder={
                modalType === 'name'
                  ? t('profile.modalPlaceholderName')
                  : modalType === 'email'
                  ? t('profile.modalPlaceholderEmail')
                  : t('profile.modalPlaceholderPassword')
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
                <Text style={styles.modalCancel}>
                  {t('profile.modalCancel')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleModalConfirm}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.modalConfirm}>
                    {t('profile.modalConfirm')}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
