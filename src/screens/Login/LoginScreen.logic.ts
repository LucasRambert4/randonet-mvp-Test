import { useState } from 'react';
import { Alert } from 'react-native';
import { supabase } from '../../../supabase-config';
import { useTranslation } from 'react-i18next';

export const useLoginScreen = () => {
  const { t } = useTranslation();
  const [isSignup, setIsSignup] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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

  const toggleSignup = () => setIsSignup(!isSignup);
  const toggleShowPassword = () => setShowPassword(!showPassword);

  return {
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
  };
};
