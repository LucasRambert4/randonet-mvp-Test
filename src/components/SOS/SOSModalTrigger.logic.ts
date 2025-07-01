import { useState } from 'react';
import * as Location from 'expo-location';
import * as Linking from 'expo-linking';
import { Audio } from 'expo-av';
import { supabase } from '../../../supabase-config';

const ALARM_SOUND = require('../../../assets/alarm.mp3');
const EMERGENCY_PHONE = '+33686971080';

export function useSOSLogic(onComplete: () => void) {
  const [count, setCount] = useState(60);

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

  async function startAlarm(
    soundRef: React.MutableRefObject<Audio.Sound | null>
  ) {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        shouldDuckAndroid: false,
      });

      const { sound } = await Audio.Sound.createAsync(ALARM_SOUND, {
        shouldPlay: true,
        isLooping: true,
      });

      soundRef.current = sound;
      await sound.playAsync();
    } catch (error) {
      console.warn('Failed to play alarm sound', error);
    }
  }

  async function stopAlarm(
    soundRef: React.MutableRefObject<Audio.Sound | null>
  ) {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
  }

  return {
    count,
    setCount,
    sendSOS,
    callEmergencyNumber,
    startAlarm,
    stopAlarm,
  };
}
