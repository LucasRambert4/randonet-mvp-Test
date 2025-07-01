import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Image,
  Animated,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import styles from './LoginScreen.styles';

export const PasswordInput = ({
  placeholder,
  value,
  onChangeText,
  showPassword,
  toggleShowPassword,
}: any) => (
  <View style={styles.passwordContainer}>
    <TextInput
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={!showPassword}
      style={styles.passwordInput}
      placeholderTextColor="#fff"
    />
    <TouchableOpacity onPress={toggleShowPassword}>
      <Feather name={showPassword ? 'eye-off' : 'eye'} size={20} color="#fff" />
    </TouchableOpacity>
  </View>
);

export const LogoTitle = ({ animatedTitle, logoAnim }: any) => (
  <Animated.View
    style={{ alignItems: 'center', transform: [{ translateY: logoAnim }] }}
  >
    <Image source={require('../../../assets/logo.png')} style={styles.logo} />
    <Text style={styles.title}>{animatedTitle}</Text>
  </Animated.View>
);
