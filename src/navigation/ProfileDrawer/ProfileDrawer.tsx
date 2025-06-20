import React from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import { View, Text, Image } from 'react-native';

import ProfileScreen from '../../screens/Profile/ProfileScreen';
import MyRoutesScreen from '../../screens/MyRoutes/MyRoutesScreen';
import AccountScreen from '../../screens/Account/AccountScreen';
import PrivacyScreen from '../../screens/Privacy/PrivacyScreen';

import styles from './ProfileDrawer.styles';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ flex: 1, backgroundColor: '#013220' }}
    >
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://via.placeholder.com/80' }}
          style={styles.avatar}
        />
        <View>
          <Text style={styles.username}>Username</Text>
          <Text
            style={styles.linkText}
            onPress={() => props.navigation.navigate('ProfileHome')}
          >
            Voir le profil
          </Text>
        </View>
      </View>

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

export default function ProfileDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Drawer.Screen name="ProfileHome" component={ProfileScreen} />
      <Drawer.Screen name="MyRoutes" component={MyRoutesScreen} />
      <Drawer.Screen name="Account" component={AccountScreen} />
      <Drawer.Screen name="Privacy" component={PrivacyScreen} />
    </Drawer.Navigator>
  );
}
