import React from 'react';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useDrawerLogic } from './CustomDrawerContent.logic';
import DrawerHeader, { DrawerLinks } from './CustomDrawerContent.components';
import SOSModalTrigger from '../SOS';
import styles from './CustomDrawerContent.styles';

export default function CustomDrawerContent(props: any) {
  const { modalVisible, setModalVisible, user } = useDrawerLogic();

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ flex: 1, backgroundColor: '#013220' }}
    >
      <DrawerHeader user={user} navigation={props.navigation} />

      <DrawerLinks
        navigation={props.navigation}
        setModalVisible={setModalVisible}
      />

      <SOSModalTrigger
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onComplete={() => setModalVisible(false)}
      />
    </DrawerContentScrollView>
  );
}
