import React from 'react';
import {
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  View,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useLoginScreen } from './LoginScreen.logic';
import { useAnimations } from './LoginScreen.animations';
import { PasswordInput, LogoTitle } from './LoginScreen.components';
import styles from './LoginScreen.styles';

export default function LoginScreen() {
  const {
    t,
    isSignup,
    displayName,
    email,
    password,
    confirmPassword,
    showPassword,
    setDisplayName,
    setEmail,
    setPassword,
    setConfirmPassword,
    toggleSignup,
    handleLogin,
    handleSignup,
    toggleShowPassword,
  } = useLoginScreen();

  const { logoAnim, formOpacity, buttonScale, toggleOpacity, animatedTitle } =
    useAnimations(isSignup);

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
          <LogoTitle animatedTitle={animatedTitle} logoAnim={logoAnim} />

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
            <PasswordInput
              placeholder={t('login.password')}
              value={password}
              onChangeText={setPassword}
              showPassword={showPassword}
              toggleShowPassword={toggleShowPassword}
            />
            {isSignup && (
              <PasswordInput
                placeholder={t('login.confirmPassword')}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                showPassword={showPassword}
                toggleShowPassword={toggleShowPassword}
              />
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
            <TouchableOpacity onPress={toggleSignup}>
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
