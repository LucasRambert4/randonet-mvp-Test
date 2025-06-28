import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing } from 'react-native';
import { useTranslation } from 'react-i18next';
import styles from './LoaderScreen.styles';

export default function LoaderScreen() {
  const { t } = useTranslation();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Looping scale animation (logo pulse)
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ])
    ).start();

    // Fade-in animation for texts
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1600,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim, scaleAnim]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../../../assets/logo.png')}
        style={[styles.logo, { transform: [{ scale: scaleAnim }] }]}
        resizeMode="contain"
      />
      <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>
        {t('loader.title')}
      </Animated.Text>
      <Animated.Text style={[styles.subtitle, { opacity: fadeAnim }]}>
        {t('loader.subtitle')}
      </Animated.Text>
    </View>
  );
}
