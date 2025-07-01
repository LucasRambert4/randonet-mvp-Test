import React from 'react';
import { ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { SaveActivityRouteParams } from './SaveActivityScreen.types';
import useSaveActivityLogic from './SaveActivityScreen.logic';
import SaveActivityForm from './SaveActivityScreen.components';
import styles from './SaveActivityScreen.styles';

export default function SaveActivityScreen() {
  const navigation = useNavigation();
  const routeParams = useRoute().params as SaveActivityRouteParams;
  const { user } = useAuth();

  const {
    t,
    title,
    setTitle,
    description,
    setDescription,
    rating,
    setRating,
    type,
    setType,
    difficulty,
    setDifficulty,
    save,
  } = useSaveActivityLogic(user, routeParams, navigation);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <SaveActivityForm
        t={t}
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        rating={rating}
        setRating={setRating}
        type={type}
        setType={setType}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        save={save}
      />
    </ScrollView>
  );
}
