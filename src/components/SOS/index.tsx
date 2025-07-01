import React, { useEffect, useState, useRef } from 'react';
import { Modal, Vibration } from 'react-native';
import { Audio } from 'expo-av';
import SOSContent from './SOSModalTrigger.components';
import { useSOSLogic } from './SOSModalTrigger.logic';
import styles from './SOSModalTrigger.styles';

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
  const {
    count,
    setCount,
    startAlarm,
    stopAlarm,
    sendSOS,
    callEmergencyNumber,
  } = useSOSLogic(onComplete);

  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    if (visible) {
      setCount(60);
      startAlarm(soundRef);
      Vibration.vibrate([500, 500], true);
    } else {
      stopAlarm(soundRef);
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

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <SOSContent count={count} onCancel={onCancel} />
    </Modal>
  );
}
