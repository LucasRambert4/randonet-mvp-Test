import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export function useDrawerLogic() {
  const [modalVisible, setModalVisible] = useState(false);
  const { user } = useAuth();

  return { modalVisible, setModalVisible, user };
}
