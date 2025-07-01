import {
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
} from 'react-native';

export function useSearchBarLogic(onSearch?: () => void) {
  const handleSubmit = (
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>
  ) => {
    onSearch?.();
  };

  return { handleSubmit };
}
