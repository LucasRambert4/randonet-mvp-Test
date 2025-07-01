import React from 'react';
import { SafeAreaView, ScrollView, RefreshControl } from 'react-native';
import styles from './ProfileScreen.styles';
import { useProfileScreen } from './ProfileScreen.logic';
import {
  TopBar,
  ProfileSection,
  OptionsList,
  EditModal,
} from './ProfileScreen.components';

export default function ProfileScreen() {
  const logic = useProfileScreen();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <TopBar navigation={logic.navigation} user={logic.user} t={logic.t} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={logic.refreshing}
            onRefresh={logic.handleRefresh}
          />
        }
      >
        <ProfileSection user={logic.user} />

        <OptionsList logic={logic} />
      </ScrollView>

      <EditModal logic={logic} />
    </SafeAreaView>
  );
}
