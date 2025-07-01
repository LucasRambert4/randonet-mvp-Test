import { useState } from 'react';
import { supabase } from '../../../supabase-config';
import { useTranslation } from 'react-i18next';

export default function useSaveActivityLogic(user, routeParams, navigation) {
  const { activityId, ...otherParams } = routeParams;
  const isEditing = !!activityId;

  const [title, setTitle] = useState(otherParams.title || '');
  const [description, setDescription] = useState(otherParams.description || '');
  const [rating, setRating] = useState(otherParams.rating || 1);
  const [type, setType] = useState(otherParams.type || 'running');
  const [difficulty, setDifficulty] = useState(
    otherParams.difficulty || 'normal'
  );

  const { t, i18n } = useTranslation();
  const loc = i18n.resolvedLanguage;

  const save = async () => {
    if (!user) {
      alert(
        `${t('saveActivity.errorTitle')}: ${t('saveActivity.errorNotLoggedIn')}`
      );
      return;
    }

    const json = {
      title,
      description,
      rating,
      type,
      difficulty,
      ...otherParams,
      owner_id: user.id,
    };

    const fileName = activityId
      ? `activity-${activityId}.json`
      : `activity-${Date.now()}.json`;

    if (isEditing) {
      await supabase.storage.from('activities-bucket').remove([fileName]);
    }

    const { error } = await supabase.storage
      .from('activities-bucket')
      .upload(fileName, JSON.stringify(json), {
        contentType: 'application/json',
        upsert: true,
      });

    if (error) {
      alert(
        `${t('saveActivity.errorTitle')}: ${t('saveActivity.errorSaveFailed')}`
      );
    } else {
      alert(
        `${t('saveActivity.successTitle')}: ${t('saveActivity.successMessage')}`
      );
    }

    navigation.goBack();
  };

  return {
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
  };
}
