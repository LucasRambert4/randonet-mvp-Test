import React from 'react';
import { SafeAreaView, View } from 'react-native';
import styles from './PrivacyScreen.styles';
import { usePrivacyScreen } from './PrivacyScreen.logic';
import {
  TopBar,
  LanguageSection,
  SwitchRow,
  InviteButton,
} from './PrivacyScreen.components';

export default function PrivacyScreen() {
  const {
    t,
    user,
    navigation,
    badgeLang,
    switchLanguage,
    locationEnabled,
    setLocationEnabled,
    notificationsEnabled,
    setNotificationsEnabled,
  } = usePrivacyScreen();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
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
          onValueChange={setLocationEnabled}
        />

        <SwitchRow
          label={t('privacy.notificationsLabel')}
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
        />

        <InviteButton text={t('privacy.inviteButton')} />
      </View>
    </SafeAreaView>
  );
}
