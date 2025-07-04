import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../context/AuthContext';

export function usePrivacyScreen() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const navigation = useNavigation();

  const [badgeLang, setBadgeLang] = useState(
    i18n.resolvedLanguage.toUpperCase()
  );
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const switchLanguage = useCallback(
    async (lang: 'en' | 'fr') => {
      await i18n.changeLanguage(lang);
      setBadgeLang(lang.toUpperCase());
    },
    [i18n]
  );

  const handleLocationToggle = useCallback(
    async (value: boolean) => {
      if (value) {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            t('privacy.errorTitle'),
            t('privacy.locationPermissionDenied')
          );
          return;
        }
      }
      setLocationEnabled(value);
      await AsyncStorage.setItem('locationEnabled', String(value));
    },
    [t]
  );

  const handleNotificationsToggle = useCallback(
    async (value: boolean) => {
      if (value) {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            t('privacy.errorTitle'),
            t('privacy.notificationPermissionDenied')
          );
          return;
        }
      }
      setNotificationsEnabled(value);
      await AsyncStorage.setItem('notificationsEnabled', String(value));
    },
    [t]
  );

  const loadSettings = useCallback(async () => {
    const storedLocation = await AsyncStorage.getItem('locationEnabled');
    const storedNotifications = await AsyncStorage.getItem(
      'notificationsEnabled'
    );
    setLocationEnabled(storedLocation === 'true');
    setNotificationsEnabled(storedNotifications === 'true');
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  return {
    t,
    user,
    navigation,
    badgeLang,
    switchLanguage,
    locationEnabled,
    handleLocationToggle,
    notificationsEnabled,
    handleNotificationsToggle,
  };
}
