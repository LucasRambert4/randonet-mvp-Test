import React from 'react';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function CustomDrawerContent(props: any) {
  const { user } = useAuth();

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ flex: 1, backgroundColor: '#013220' }}
    >
      {/* Header with user profile */}
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
          <Text style={styles.username}>
            {user?.user_metadata?.displayName || 'Username'}
          </Text>
          <Text
            style={styles.linkText}
            onPress={() => props.navigation.navigate('Profile')}
          >
            Voir le profil
          </Text>
        </View>
      </View>

      {/* Menu Items */}
      <DrawerItem
        label="Mes Itinéraires"
        onPress={() => props.navigation.navigate('MyRoutes')}
        labelStyle={styles.drawerLabel}
        icon={() => <Text style={styles.icon}>🧭</Text>}
      />
      <DrawerItem
        label="Compte"
        onPress={() => props.navigation.navigate('Account')}
        labelStyle={styles.drawerLabel}
        icon={() => <Text style={styles.icon}>⚙️</Text>}
      />
      <DrawerItem
        label="Préférences et confidentialité"
        onPress={() => props.navigation.navigate('Privacy')}
        labelStyle={styles.drawerLabel}
        icon={() => <Text style={styles.icon}>👤</Text>}
      />
    </DrawerContentScrollView>
  );
}

import styles from './CustomDrawerContent.styles';
