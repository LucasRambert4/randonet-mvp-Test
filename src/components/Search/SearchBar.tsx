import React from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  onSearch?: () => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChangeText,
  onSearch,
  placeholder = 'Recherche',
}: Props) {
  const handleSubmit = (
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>
  ) => {
    onSearch?.();
  };

  return (
    <View style={styles.container}>
      <Icon name="search" size={18} color="#ccc" style={styles.icon} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={handleSubmit}
        returnKeyType="search"
        placeholder={placeholder}
        placeholderTextColor="#ccc"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 10,
    margin: 10,
    backgroundColor: '#0d3a27',
  },
  icon: {
    marginRight: 6,
  },
  label: {
    fontSize: 16,
    color: '#fff',
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
  },
});
