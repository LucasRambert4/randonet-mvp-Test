// index.tsx
import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './PrivacyScreen.styles';
import { usePrivacyScreen } from './PrivacyScreen.logic';
import { TopBar, LanguageSection, SwitchRow } from './PrivacyScreen.components';

export default function PrivacyScreen() {
  const {
    t,
    user,
    navigation,
    badgeLang,
    switchLanguage,
    locationEnabled,
    handleLocationToggle,
    notificationsEnabled,
    handleNotificationsToggle,
  } = usePrivacyScreen();

  return (
    // Exclut le padding de safe area en haut
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <TopBar navigation={navigation} user={user} title={t('privacy.title')} />
      <View style={styles.section}>
        <LanguageSection
          t={t}
          badgeLang={badgeLang}
          switchLanguage={switchLanguage}
        />
        <SwitchRow
          label={t('privacy.locationLabel')}
          value={locationEnabled}
          onValueChange={handleLocationToggle}
        />
        <SwitchRow
          label={t('privacy.notificationsLabel')}
          value={notificationsEnabled}
          onValueChange={handleNotificationsToggle}
        />
      </View>
    </SafeAreaView>
  );
}
