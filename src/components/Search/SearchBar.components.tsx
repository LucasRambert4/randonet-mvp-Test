import React from 'react';
import {
  View,
  TextInput,
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from './SearchBar.styles';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  onSubmitEditing: (
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>
  ) => void;
  placeholder: string;
}

export function SearchBarContainer({
  value,
  onChangeText,
  onSubmitEditing,
  placeholder,
}: Props) {
  return (
    <View style={styles.container}>
      <Icon name="search" size={18} color="#ccc" style={styles.icon} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        returnKeyType="search"
        placeholder={placeholder}
        placeholderTextColor="#ccc"
      />
    </View>
  );
}
