import React from 'react';
import { View, Text, Image } from 'react-native';
import { DrawerItem } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import styles from './CustomDrawerContent.styles';

export default function DrawerHeader({ user, navigation }: any) {
  return (
    <View style={styles.header}>
      <Image
        source={{
          uri:
            user?.user_metadata?.avatar_url || 'https://via.placeholder.com/80',
        }}
        style={styles.avatar}
      />
      <View>
        <Text style={styles.username}>
          {user?.user_metadata?.displayName || 'Username'}
        </Text>
        <Text
          style={styles.linkText}
          onPress={() =>
            navigation.navigate('HomeTabs', {
              screen: 'Home',
              params: { screen: 'Profile' },
            })
          }
        >
          Voir le profil
        </Text>
      </View>
    </View>
  );
}

export function DrawerLinks({ navigation, setModalVisible }: any) {
  return (
    <>
      <DrawerItem
        label="Mes Itinéraires"
        onPress={() =>
          navigation.navigate('HomeTabs', {
            screen: 'Home',
            params: { screen: 'MyRoutes' },
          })
        }
        labelStyle={styles.drawerLabel}
        icon={({ size }) => (
          <Ionicons
            name="map-outline"
            size={size}
            color="white"
            style={{ marginRight: 10 }}
          />
        )}
      />

      <DrawerItem
        label="Préférences et confidentialité"
        onPress={() =>
          navigation.navigate('HomeTabs', {
            screen: 'Home',
            params: { screen: 'Privacy' },
          })
        }
        labelStyle={styles.drawerLabel}
        icon={({ size }) => (
          <Ionicons
            name="person-outline"
            size={size}
            color="white"
            style={{ marginRight: 10 }}
          />
        )}
      />

      <DrawerItem
        label="SOS"
        labelStyle={{ ...styles.drawerLabel, color: 'red' }}
        onPress={() => setModalVisible(true)}
        icon={({ size }) => (
          <Ionicons
            name="alert-circle-outline"
            size={size}
            color="red"
            style={{ marginRight: 10 }}
          />
        )}
      />
    </>
  );
}
