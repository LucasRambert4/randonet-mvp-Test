import { useState, useEffect } from 'react';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

export const usePrivacyScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();

  const [locationEnabled, setLocationEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

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

  return {
    t,
    user,
    navigation,
    badgeLang,
    switchLanguage,
    locationEnabled,
    setLocationEnabled,
    notificationsEnabled,
    setNotificationsEnabled,
  };
};
