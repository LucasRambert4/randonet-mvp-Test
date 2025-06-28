import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

export default function PrivacyScreen() {
  const { user } = useAuth();
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();

  // local toggles
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // we'll derive a two-letter badge ("EN" or "FR") from resolvedLanguage,
  // and re-run whenever the user actually changes language.
  const [badgeLang, setBadgeLang] = useState<'EN' | 'FR'>(
    i18n.resolvedLanguage.startsWith('fr') ? 'FR' : 'EN'
  );

  useEffect(() => {
    const onLanguageChanged = (lng: string) => {
      setBadgeLang(lng.startsWith('fr') ? 'FR' : 'EN');
    };
    i18n.on('languageChanged', onLanguageChanged);
    return () => {
      i18n.off('languageChanged', onLanguageChanged);
    };
  }, [i18n]);

  const switchLanguage = (lng: 'en' | 'fr') => {
    i18n.changeLanguage(lng);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>{t('privacy.title')}</Text>
        <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        >
          <Image
            source={{
              uri: user?.photoURL || 'https://via.placeholder.com/40',
            }}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>

      {/* Body */}
      <View style={styles.section}>
        {/* Language */}
        <View style={styles.row}>
          <Text style={styles.label}>{t('privacy.languageLabel')}</Text>
          <View style={styles.languageToggle}>
            <TouchableOpacity
              style={[
                styles.langButton,
                badgeLang === 'EN' && styles.langSelected,
              ]}
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
              style={[
                styles.langButton,
                badgeLang === 'FR' && styles.langSelected,
              ]}
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

        {/* Location */}
        <View style={styles.row}>
          <Text style={styles.label}>{t('privacy.locationLabel')}</Text>
          <Switch
            value={locationEnabled}
            onValueChange={setLocationEnabled}
            thumbColor="#fff"
            trackColor={{ false: '#555', true: '#28a745' }}
          />
        </View>

        {/* Notifications */}
        <View style={styles.row}>
          <Text style={styles.label}>{t('privacy.notificationsLabel')}</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            thumbColor="#fff"
            trackColor={{ false: '#555', true: '#28a745' }}
          />
        </View>

        {/* Invite */}
        <TouchableOpacity style={styles.inviteButton}>
          <Text style={styles.inviteText}>{t('privacy.inviteButton')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

import styles from './PrivacyScreen.styles';
