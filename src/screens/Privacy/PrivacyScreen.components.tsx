import React from 'react';
import { View, Text, TouchableOpacity, Image, Switch } from 'react-native';
import { DrawerActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import styles from './PrivacyScreen.styles';

export const TopBar = ({ navigation, user, title }: any) => (
  <View style={styles.topBar}>
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <Ionicons name="arrow-back" size={24} color="white" />
    </TouchableOpacity>
    <Text style={styles.title}>{title}</Text>
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

export const LanguageSection = ({ t, badgeLang, switchLanguage }: any) => (
  <View style={styles.row}>
    <Text style={styles.label}>{t('privacy.languageLabel')}</Text>
    <View style={styles.languageToggle}>
      <TouchableOpacity
        style={[styles.langButton, badgeLang === 'EN' && styles.langSelected]}
        onPress={() => switchLanguage('en')}
      >
        <Text
          style={[
            styles.langText,
            badgeLang === 'EN' && styles.langSelectedText,
          ]}
        >
          EN
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.langButton, badgeLang === 'FR' && styles.langSelected]}
        onPress={() => switchLanguage('fr')}
      >
        <Text
          style={[
            styles.langText,
            badgeLang === 'FR' && styles.langSelectedText,
          ]}
        >
          FR
        </Text>
      </TouchableOpacity>
    </View>
  </View>
);

export const SwitchRow = ({ label, value, onValueChange }: any) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Switch
      value={value}
      onValueChange={onValueChange}
      thumbColor="#fff"
      trackColor={{ false: '#555', true: '#28a745' }}
    />
  </View>
);
