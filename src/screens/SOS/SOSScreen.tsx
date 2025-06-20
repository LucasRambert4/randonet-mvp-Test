import React from 'react';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './SOSScreen.styles';

export default function SOSScreen() {
  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <Text style={styles.text}>SOS</Text>
    </SafeAreaView>
  );
}
