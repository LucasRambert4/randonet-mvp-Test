import React from 'react';
import { View, Animated } from 'react-native';
import useLoaderScreenLogic from './LoaderScreen.logic';
import styles from './LoaderScreen.styles';

export default function LoaderScreen() {
  const { t, scaleAnim, fadeAnim } = useLoaderScreenLogic();

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
