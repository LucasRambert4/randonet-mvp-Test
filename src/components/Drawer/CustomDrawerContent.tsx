import React, { useState } from 'react';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { View, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SOSModalTrigger from '../SOS';
import { useAuth } from '../../context/AuthContext';
import styles from './CustomDrawerContent.styles';
import { useTranslation } from 'react-i18next';

export default function CustomDrawerContent(props: any) {
  const [modalVisible, setModalVisible] = useState(false);
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const loc = i18n.resolvedLanguage;

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
          <Text style={styles.username}>
            {user?.user_metadata?.displayName ||
              t('profileDrawer.usernameDefault')}
          </Text>
          <Text
            style={styles.linkText}
            onPress={() =>
              props.navigation.navigate('HomeTabs', {
                screen: 'Home',
                params: { screen: 'Profile' },
              })
            }
          >
            {t('profileDrawer.viewProfile')}
          </Text>
        </View>
      </View>

      <DrawerItem
        label={t('profileDrawer.tabRoutes')}
        onPress={() =>
          props.navigation.navigate('HomeTabs', {
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
        label={t('profileDrawer.tabPrivacy')}
        onPress={() =>
          props.navigation.navigate('HomeTabs', {
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

      <SOSModalTrigger
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onComplete={() => setModalVisible(false)}
      />
    </DrawerContentScrollView>
  );
}
