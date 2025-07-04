import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { useTranslation } from 'react-i18next';

export default function useLoaderScreenLogic() {
  const { t } = useTranslation();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
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

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1600,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim, fadeAnim]);

  return { t, scaleAnim, fadeAnim };
}
