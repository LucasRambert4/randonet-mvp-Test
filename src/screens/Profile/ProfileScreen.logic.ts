import { useState } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { supabase } from '../../../supabase-config';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

export const useProfileScreen = () => {
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
      Alert.alert(
        t('profile.logoutErrorTitle'),
        err.message || t('profile.logoutErrorMessage')
      );
    }
  };

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
    if (data?.user) setUserManually(data.user);
    setRefreshing(false);
  };

  return {
    user,
    navigation,
    t,
    modalVisible,
    modalType,
    modalValue,
    isUpdating,
    refreshing,
    openEditModal,
    handleModalConfirm,
    handleUploadAvatar,
    handleLogout,
    handleDeleteAccount,
    handleRefresh,
    setModalVisible,
    setModalValue,
  };
};
