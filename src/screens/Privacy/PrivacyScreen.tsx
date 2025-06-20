import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

export default function PrivacyScreen() {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [language, setLanguage] = useState<'EN' | 'FR'>('FR');
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Préférences et confidentialité</Text>
        <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        >
          <Image
            source={{
              uri: user?.photoURL || 'https://via.placeholder.com/40',
            }}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>

      {/* Body */}
      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.label}>Langue de l'application</Text>
          <View style={styles.languageToggle}>
            <TouchableOpacity
              style={[
                styles.langButton,
                language === 'EN' && styles.langSelected,
              ]}
              onPress={() => setLanguage('EN')}
            >
              <Text
                style={[
                  styles.langText,
                  language === 'EN' && styles.langSelectedText,
                ]}
              >
                EN
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.langButton,
                language === 'FR' && styles.langSelected,
              ]}
              onPress={() => setLanguage('FR')}
            >
              <Text
                style={[
                  styles.langText,
                  language === 'FR' && styles.langSelectedText,
                ]}
              >
                FR
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Localisation</Text>
          <Switch
            value={locationEnabled}
            onValueChange={setLocationEnabled}
            thumbColor="#fff"
            trackColor={{ false: '#555', true: '#28a745' }}
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            thumbColor="#fff"
            trackColor={{ false: '#555', true: '#28a745' }}
          />
        </View>

        <TouchableOpacity style={styles.inviteButton}>
          <Text style={styles.inviteText}>Inviter un contact</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

import styles from './PrivacyScreen.styles';
