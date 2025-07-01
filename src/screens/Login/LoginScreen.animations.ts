import { useEffect, useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';
import { useTranslation } from 'react-i18next';

export const useAnimations = (isSignup: boolean) => {
  const { t } = useTranslation();
  const logoAnim = useRef(new Animated.Value(-60)).current;
  const formOpacity = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const toggleOpacity = useRef(new Animated.Value(0)).current;

  const fullTitle = isSignup ? t('login.signupTitle') : t('login.loginTitle');
  const [animatedTitle, setAnimatedTitle] = useState('');
  const titleIndex = useRef(0);
  const titleInterval = useRef<NodeJS.Timeout | null>(null);
  const hasAnimated = useRef(false);

  const startTypewriter = (text: string) => {
    setAnimatedTitle('');
    titleIndex.current = 0;
    if (titleInterval.current) clearInterval(titleInterval.current);

    titleInterval.current = setInterval(() => {
      titleIndex.current += 1;
      setAnimatedTitle(text.slice(0, titleIndex.current));
      if (titleIndex.current >= text.length) {
        clearInterval(titleInterval.current!);
        if (!hasAnimated.current) {
          hasAnimated.current = true;
          Animated.parallel([
            Animated.timing(formOpacity, {
              toValue: 1,
              duration: 800,
              useNativeDriver: true,
            }),
            Animated.timing(toggleOpacity, {
              toValue: 1,
              duration: 600,
              delay: 100,
              useNativeDriver: true,
            }),
          ]).start();
        }
      }
    }, 80);
  };

  useEffect(() => {
    Animated.timing(logoAnim, {
      toValue: 0,
      duration: 700,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();

    startTypewriter(fullTitle);

    Animated.loop(
      Animated.sequence([
        Animated.timing(buttonScale, {
          toValue: 1.03,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(buttonScale, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    return () => {
      if (titleInterval.current) clearInterval(titleInterval.current);
    };
  }, []);

  useEffect(() => {
    if (hasAnimated.current) {
      setAnimatedTitle('');
      titleIndex.current = 0;
      setTimeout(() => startTypewriter(fullTitle), 100);
    }
  }, [isSignup]);

  return { logoAnim, formOpacity, buttonScale, toggleOpacity, animatedTitle };
};
