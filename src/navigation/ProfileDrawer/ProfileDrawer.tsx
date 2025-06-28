// src/navigation/ProfileDrawer.tsx
import React from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import { View, Text, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';

import ProfileScreen from '../../screens/Profile/ProfileScreen';
import MyRoutesScreen from '../../screens/MyRoutes/MyRoutesScreen';
import PrivacyScreen from '../../screens/Privacy/PrivacyScreen';

import styles from './ProfileDrawer.styles';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const { t } = useTranslation();
  const { user } = useAuth();

  const username =
    user?.user_metadata?.displayName ||
    user?.email ||
    t('profileDrawer.usernameDefault');

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ flex: 1, backgroundColor: '#013220' }}
    >
      <View style={styles.header}>
        <Image
          source={{
            uri:
              user?.user_metadata?.avatar_url ||
              'https://via.placeholder.com/80',
          }}
          style={styles.avatar}
        />
        <View>
          <Text style={styles.username}>{username}</Text>
          <Text
            style={styles.linkText}
            onPress={() => props.navigation.navigate('ProfileHome')}
          >
            {t('profileDrawer.viewProfile')}
          </Text>
        </View>
      </View>

      <DrawerItem
        onPress={() => props.navigation.navigate('MyRoutes')}
        icon={() => <Text style={styles.icon}>🧭</Text>}
        label={({ color }) => (
          <Text style={[styles.drawerLabel, { color }]}>
            {t('profileDrawer.tabRoutes')}
          </Text>
        )}
      />
      <DrawerItem
        onPress={() => props.navigation.navigate('Privacy')}
        icon={() => <Text style={styles.icon}>👤</Text>}
        label={({ color }) => (
          <Text style={[styles.drawerLabel, { color }]}>
            {t('profileDrawer.tabPrivacy')}
          </Text>
        )}
      />
    </DrawerContentScrollView>
  );
}

export default function ProfileDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Drawer.Screen name="ProfileHome" component={ProfileScreen} />
      <Drawer.Screen name="MyRoutes" component={MyRoutesScreen} />
      <Drawer.Screen name="Privacy" component={PrivacyScreen} />
    </Drawer.Navigator>
  );
}
