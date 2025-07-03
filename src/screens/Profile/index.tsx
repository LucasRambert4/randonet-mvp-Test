import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  RefreshControl,
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import { DrawerActions } from '@react-navigation/native';
import styles from './ProfileScreen.styles';
import { useProfileScreen } from './ProfileScreen.logic';
import {
  ProfileSection,
  OptionsList,
  EditModal,
} from './ProfileScreen.components';

export default function ProfileScreen() {
  const logic = useProfileScreen();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* ✅ New top bar */}
      <View style={styles.topBar}>
        <Text style={styles.title}>Profile</Text>

        <TouchableOpacity
          onPress={() => logic.navigation.dispatch(DrawerActions.openDrawer())}
        >
          <Image
            source={{
              uri:
                logic.user?.user_metadata?.avatar_url ||
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
