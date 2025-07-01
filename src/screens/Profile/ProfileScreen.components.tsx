import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { DrawerActions } from '@react-navigation/native';
import { Ionicons, MaterialIcons, Feather, Entypo } from '@expo/vector-icons';
import styles from './ProfileScreen.styles';

export const TopBar = ({ navigation, user, t }: any) => (
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
            user?.user_metadata?.avatar_url || 'https://via.placeholder.com/40',
        }}
        style={styles.avatar}
      />
    </TouchableOpacity>
  </View>
);

export const ProfileSection = ({ user }: any) => (
  <View style={styles.profileSection}>
    <Image
      source={{
        uri:
          user?.user_metadata?.avatar_url || 'https://via.placeholder.com/100',
      }}
      style={styles.profileImage}
    />
    <Text style={styles.emailText}>{user?.email}</Text>
    {user?.user_metadata?.displayName && (
      <Text style={styles.nameText}>{user.user_metadata.displayName}</Text>
    )}
  </View>
);

export const OptionsList = ({ logic }: any) => (
  <View style={styles.options}>
    <TouchableOpacity
      style={styles.item}
      onPress={logic.handleUploadAvatar}
      disabled={logic.isUpdating}
    >
      <Feather name="image" size={22} color="white" />
      <Text style={styles.itemText}>{logic.t('profile.uploadAvatar')}</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.item}
      onPress={() => logic.openEditModal('name')}
      disabled={logic.isUpdating}
    >
      <Feather name="user" size={22} color="white" />
      <Text style={styles.itemText}>{logic.t('profile.editName')}</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.item}
      onPress={() => logic.openEditModal('email')}
      disabled={logic.isUpdating}
    >
      <Ionicons name="mail" size={22} color="white" />
      <Text style={styles.itemText}>{logic.t('profile.changeEmail')}</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.item}
      onPress={() => logic.openEditModal('password')}
      disabled={logic.isUpdating}
    >
      <Entypo name="lock" size={22} color="white" />
      <Text style={styles.itemText}>{logic.t('profile.editPassword')}</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.item}
      onPress={logic.handleLogout}
      disabled={logic.isUpdating}
    >
      <Feather name="log-out" size={22} color="#ff4d4d" />
      <Text style={[styles.itemText, { color: '#ff4d4d' }]}>
        {logic.t('profile.logout')}
      </Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.item}
      onPress={logic.handleDeleteAccount}
      disabled={logic.isUpdating}
    >
      <MaterialIcons name="delete" size={22} color="#ff4d4d" />
      <Text style={[styles.itemText, { color: '#ff4d4d' }]}>
        {logic.t('profile.deleteAccount')}
      </Text>
    </TouchableOpacity>
  </View>
);

export const EditModal = ({ logic }: any) => (
  <Modal
    visible={logic.modalVisible}
    transparent
    animationType="fade"
    onRequestClose={() => !logic.isUpdating && logic.setModalVisible(false)}
  >
    <View style={styles.modalOverlay}>
      <KeyboardAvoidingView
        style={styles.modalContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Text style={styles.modalTitle}>
          {logic.modalType === 'name'
            ? logic.t('profile.modalTitleName')
            : logic.modalType === 'email'
            ? logic.t('profile.modalTitleEmail')
            : logic.t('profile.modalTitlePassword')}
        </Text>

        <TextInput
          style={styles.modalInput}
          value={logic.modalValue}
          onChangeText={logic.setModalValue}
          placeholder={
            logic.modalType === 'name'
              ? logic.t('profile.modalPlaceholderName')
              : logic.modalType === 'email'
              ? logic.t('profile.modalPlaceholderEmail')
              : logic.t('profile.modalPlaceholderPassword')
          }
          keyboardType={
            logic.modalType === 'email' ? 'email-address' : 'default'
          }
          autoCapitalize="none"
          placeholderTextColor="#aaa"
          secureTextEntry={logic.modalType === 'password'}
          editable={!logic.isUpdating}
        />

        <View style={styles.modalButtons}>
          <TouchableOpacity
            onPress={() => !logic.isUpdating && logic.setModalVisible(false)}
            disabled={logic.isUpdating}
          >
            <Text style={styles.modalCancel}>
              {logic.t('profile.modalCancel')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={logic.handleModalConfirm}
            disabled={logic.isUpdating}
          >
            {logic.isUpdating ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.modalConfirm}>
                {logic.t('profile.modalConfirm')}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  </Modal>
);
