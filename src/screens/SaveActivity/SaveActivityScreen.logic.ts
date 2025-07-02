import { useState } from 'react';
import { supabase } from '../../../supabase-config';
import { useTranslation } from 'react-i18next';

export default function useSaveActivityLogic(user, routeParams, navigation) {
  const {
    activityId,
    startTime,
    endTime,
    route,
    distance,
    elevation,
    location,
    trailId,
    ...otherParams
  } = routeParams;

  const isEditing = !!activityId;

  const parsedStartTime = startTime ? new Date(startTime) : null;
  const parsedEndTime = endTime ? new Date(endTime) : null;

  const [title, setTitle] = useState(otherParams.title || '');
  const [description, setDescription] = useState(otherParams.description || '');
  const [rating, setRating] = useState(otherParams.rating || 1);
  const [type, setType] = useState(otherParams.type || 'running');
  const [difficulty, setDifficulty] = useState(
    otherParams.difficulty || 'normal'
  );

  const { t } = useTranslation();

  const save = async () => {
    if (!user) {
      alert(
        `${t('saveActivity.errorTitle')}: ${t('saveActivity.errorNotLoggedIn')}`
      );
      return;
    }

    const jsonData = {
      title,
      description,
      rating,
      type,
      difficulty,
      startTime: parsedStartTime?.toISOString() || null,
      endTime: parsedEndTime?.toISOString() || null,
      route: route || [],
      distance: distance || 0,
      elevation: elevation || 0,
      location: location || '',
      trailId: trailId || null,
      owner_id: user.id,
      updatedAt: new Date().toISOString(),
    };

    const filename = isEditing
      ? `activity-${activityId}.json`
      : `activity-${Date.now()}.json`;

    const path = `${user.id}/${filename}`; // ✅ User folder!

    if (isEditing) {
      const { error: removeError } = await supabase.storage
        .from('activities')
        .remove([path]);

      if (removeError) {
        console.warn('Could not remove old file:', removeError);
      }
    }

    const { error } = await supabase.storage
      .from('activities')
      .upload(path, JSON.stringify(jsonData), {
        contentType: 'application/json',
        upsert: true,
      });

    if (error) {
      console.error('Upload error:', error);
      alert(
        `${t('saveActivity.errorTitle')}: ${t(
          'saveActivity.errorSaveFailed'
        )}\n${error.message}`
      );
      return;
    }

    alert(
      `${t('saveActivity.successTitle')}: ${t('saveActivity.successMessage')}`
    );

    navigation.reset({
      index: 0,
      routes: [{ name: 'RecordMain' }],
    });
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
