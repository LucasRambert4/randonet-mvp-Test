import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TextInput,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import { supabase } from '../../../supabase-config';
import { useTranslation } from 'react-i18next';
import styles from './LoginScreen.styles';

export default function LoginScreen() {
  const { t } = useTranslation();
  const [isSignup, setIsSignup] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Animation refs
  const logoAnim = useRef(new Animated.Value(-60)).current;
  const formOpacity = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const toggleOpacity = useRef(new Animated.Value(0)).current;

  // Typewriter effect
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

  const resetForm = () => {
    setDisplayName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(t('login.errorTitle'), t('login.errorCredentials'));
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      Alert.alert(t('login.loginErrorTitle'), error.message);
    } else {
      resetForm();
    }
  };

  const handleSignup = async () => {
    if (!email || !password || !displayName || !confirmPassword) {
      Alert.alert(t('login.errorTitle'), t('login.errorAllFields'));
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert(t('login.errorTitle'), t('login.errorPasswordMatch'));
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { displayName } },
    });
    if (error) {
      Alert.alert(t('login.signupErrorTitle'), error.message);
    } else {
      Alert.alert(t('login.signupSuccess'));
      resetForm();
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View
            style={{
              alignItems: 'center',
              transform: [{ translateY: logoAnim }],
            }}
          >
            <Image
              source={require('../../../assets/logo.png')}
              style={styles.logo}
            />
            <Text style={styles.title}>{animatedTitle}</Text>
          </Animated.View>

          <Animated.View style={{ width: '100%', opacity: formOpacity }}>
            {isSignup && (
              <TextInput
                placeholder={t('login.displayName')}
                value={displayName}
                onChangeText={setDisplayName}
                style={styles.input}
                placeholderTextColor="#fff"
              />
            )}
            <TextInput
              placeholder={t('login.email')}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
              placeholderTextColor="#fff"
            />
            <View style={styles.passwordContainer}>
              <TextInput
                placeholder={t('login.password')}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                style={styles.passwordInput}
                placeholderTextColor="#fff"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Feather
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color="#fff"
                />
              </TouchableOpacity>
            </View>
            {isSignup && (
              <View style={styles.passwordContainer}>
                <TextInput
                  placeholder={t('login.confirmPassword')}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showPassword}
                  style={styles.passwordInput}
                  placeholderTextColor="#fff"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Feather
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color="#fff"
                  />
                </TouchableOpacity>
              </View>
            )}
            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
              <TouchableOpacity
                style={styles.button}
                onPress={isSignup ? handleSignup : handleLogin}
              >
                <Text style={styles.buttonText}>
                  {isSignup ? t('login.signupButton') : t('login.loginButton')}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>

          <Animated.View style={{ opacity: toggleOpacity }}>
            <TouchableOpacity onPress={() => setIsSignup(!isSignup)}>
              <Text style={styles.toggleText}>
                {isSignup ? t('login.haveAccount') : t('login.noAccount')}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
