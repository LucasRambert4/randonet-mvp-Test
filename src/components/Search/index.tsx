import React from 'react';
import {
  TextInputSubmitEditingEventData,
  NativeSyntheticEvent,
} from 'react-native';
import { SearchBarContainer } from './SearchBar.components';
import { useSearchBarLogic } from './SearchBar.logic';

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
  const { handleSubmit } = useSearchBarLogic(onSearch);

  return (
    <SearchBarContainer
      value={value}
      onChangeText={onChangeText}
      onSubmitEditing={handleSubmit}
      placeholder={placeholder}
    />
  );
}
