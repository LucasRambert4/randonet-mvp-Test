import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './SOSModalTrigger.styles';

interface SOSContentProps {
  count: number;
  onCancel: () => void;
}

export default function SOSContent({ count, onCancel }: SOSContentProps) {
  return (
    <View style={styles.modalOverlay}>
      <View style={styles.alertBox}>
        <Text style={styles.alertTitle}>EMERGENCY ALERT</Text>
        <Text style={styles.alertText}>Fall detected.</Text>
        <Text style={styles.alertText}>Calling in</Text>
        <Text style={styles.alertCountdown}>
          {count} <Text style={{ fontWeight: 'bold' }}>seconds.</Text>
        </Text>
        <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
          <Text style={styles.cancelButtonText}>CANCEL</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
