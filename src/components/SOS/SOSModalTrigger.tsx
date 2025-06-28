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
import * as Location from 'expo-location';
import * as Linking from 'expo-linking';
import styles from './SOSModalTrigger.styles';
import { supabase } from '../../../supabase-config';

const ALARM_SOUND = require('../../../assets/alarm.mp3');
const VIBRATION_PATTERN = [500, 500];

const EMERGENCY_PHONE = '+33686971080';

interface SOSModalTriggerProps {
  visible: boolean;
  onCancel: () => void;
  onComplete: () => void;
}

const sendSOS = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    alert('Permission to access location was denied');
    return;
  }

  const location = await Location.getCurrentPositionAsync({});
  const { latitude, longitude } = location.coords;

  const { error } = await supabase.from('sos_alerts').insert([
    {
      user_id: 'demo-user',
      latitude,
      longitude,
      timestamp: new Date().toISOString(),
    },
  ]);

  if (error) {
    alert('Failed to send SOS.');
  } else {
    alert('SOS sent successfully.');
  }
};

const callEmergencyNumber = () => {
  Linking.openURL(`tel:${EMERGENCY_PHONE}`);
};

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
      sendSOS();
      callEmergencyNumber();
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
          <Text style={styles.alertText}>Calling in</Text>
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
