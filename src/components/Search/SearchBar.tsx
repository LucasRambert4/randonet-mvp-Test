import React from 'react';
import { TextInput } from 'react-native';
import styles from './SearchBar.styles';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChangeText, placeholder = 'Recherche' }: Props) {
  return (
    <TextInput
      placeholder={placeholder}
      placeholderTextColor="#ccc"
      value={value}
      onChangeText={onChangeText}
      style={styles.searchBar}
    />
  );
}
