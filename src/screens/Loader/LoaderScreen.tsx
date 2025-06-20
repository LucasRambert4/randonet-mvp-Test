import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export default function LoaderScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/logo.png')} // ✅ Adjust path if needed
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Hike</Text>
      <Text style={styles.subtitle}>Smarter, Safer, Together</Text>
    </View>
  );
}

import styles from './LoaderScreen.styles';
