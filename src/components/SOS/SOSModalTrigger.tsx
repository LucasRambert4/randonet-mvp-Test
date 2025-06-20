import React, { useEffect, useState, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Vibration,
  Platform,
} from 'react-native';
import { Audio } from 'expo-av';
import styles from './SOSModalTrigger.styles';

const ALARM_SOUND = require('../../../assets/alarm.mp3');
const VIBRATION_PATTERN = [500, 500];

interface SOSModalTriggerProps {
  visible: boolean;
  onCancel: () => void;
  onComplete: () => void;
}

export default function SOSModalTrigger({
  visible,
  onCancel,
  onComplete,
}: SOSModalTriggerProps) {
  const [count, setCount] = useState(60);
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    if (visible) {
      setCount(60);
      startAlarm();
      Vibration.vibrate(VIBRATION_PATTERN, true);
    } else {
      stopAlarm();
      Vibration.cancel();
    }
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    if (count === 0) {
      onComplete();
      return;
    }
    const timer = setTimeout(() => setCount((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [count, visible]);

  async function startAlarm() {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        shouldDuckAndroid: false,
        playThroughEarpieceAndroid: false,
      });

      const { sound } = await Audio.Sound.createAsync(ALARM_SOUND, {
        shouldPlay: true,
        isLooping: true,
      });

      soundRef.current = sound;

      // Force speaker on Android
      if (Platform.OS === 'android') {
        await Audio.setAudioModeAsync({
          playThroughEarpieceAndroid: false,
        });
      }

      await sound.playAsync();
    } catch (error) {
      console.warn('Failed to play alarm sound', error);
    }
  }

  async function stopAlarm() {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
  }

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.modalOverlay}>
        <View style={styles.alertBox}>
          <Text style={styles.alertTitle}>EMERGENCY ALERT</Text>
          <Text style={styles.alertText}>Fall detected.</Text>
          <Text style={styles.alertText}>Contacting rescue in</Text>
          <Text style={styles.alertCountdown}>
            {count} <Text style={{ fontWeight: 'bold' }}>seconds.</Text>
          </Text>
          <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>CANCEL</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
