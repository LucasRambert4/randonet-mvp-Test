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

import MainTabs from './MainTabs'; // ✅ Import your unified tab navigator

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
            onPress={() =>
              props.navigation.navigate('Home', { screen: 'Profile' })
            }
          >
            {t('profileDrawer.viewProfile')}
          </Text>
        </View>
      </View>

      <DrawerItem
        onPress={() =>
          props.navigation.navigate('Home', { screen: 'MyRoutes' })
        }
        icon={() => <Text style={styles.icon}>🧭</Text>}
        label={({ color }) => (
          <Text style={[styles.drawerLabel, { color }]}>
            {t('profileDrawer.tabRoutes')}
          </Text>
        )}
      />

      <DrawerItem
        onPress={() => props.navigation.navigate('Home', { screen: 'Privacy' })}
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
      screenOptions={{ headerShown: false }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      {/* ✅ Use only the unified MainTabs */}
      <Drawer.Screen name="HomeTabs" component={MainTabs} />
    </Drawer.Navigator>
  );
}
