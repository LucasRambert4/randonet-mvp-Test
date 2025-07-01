import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { supabase } from '../../../supabase-config';
import * as FileSystem from 'expo-file-system';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

export default function useSaveActivityLogic() {
  const navigation = useNavigation();
  const routeParams = useRoute().params as {
    route: any[];
    distance: number;
    startTime: Date | null;
    endTime: Date;
    elevation: number;
    location: string;
    trailId?: string | null;
    activityId?: string;
    existingData?: any;
  };

  const { user } = useAuth();
  const { t } = useTranslation();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState(0);
  const [type, setType] = useState<'hiking' | 'running' | 'biking'>('running');
  const [difficulty, setDifficulty] = useState<'easy' | 'normal' | 'hard'>(
    'normal'
  );

  useEffect(() => {
    if (routeParams.existingData) {
      const d = routeParams.existingData;
      setTitle(d.title || '');
      setDescription(d.description || '');
      setRating(d.rating || 0);
      setType(d.type || 'running');
      setDifficulty(d.difficulty || 'normal');
    }
  }, []);

  const save = async () => {
    if (!user) {
      Alert.alert(
        t('saveActivity.errorTitle'),
        t('saveActivity.errorNotLoggedIn')
      );
      return;
    }

    try {
      const filename = routeParams.activityId || `${Date.now()}.json`;
      const path = `${user.id}/${filename}`;
      const duration =
        routeParams.startTime && routeParams.endTime
          ? Math.round(
              (+new Date(routeParams.endTime) -
                +new Date(routeParams.startTime)) /
                1000
            )
          : 0;

      const data = {
        user_id: user.id,
        start_time: routeParams.startTime?.toISOString(),
        end_time: routeParams.endTime.toISOString(),
        duration_seconds: duration,
        distance_meters: Math.round(routeParams.distance),
        path: routeParams.route,
        title,
        description,
        rating,
        type,
        difficulty,
        location: routeParams.location,
        elevation: Math.round(routeParams.elevation || 0),
        trail_id: routeParams.trailId || null,
      };

      const fileUri = FileSystem.cacheDirectory + filename;
      await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(data), {
        encoding: FileSystem.EncodingType.UTF8,
      });

      const { error: uploadError } = await supabase.storage
        .from('activities')
        .upload(
          path,
          { uri: fileUri, type: 'application/json', name: filename } as any,
          { upsert: true, contentType: 'application/json' }
        );

      if (uploadError) throw uploadError;

      Alert.alert(
        t('saveActivity.successTitle'),
        t('saveActivity.successMessage')
      );
      navigation.goBack();
    } catch (err: any) {
      Alert.alert(
        t('saveActivity.errorTitle'),
        err.message || t('saveActivity.errorSaveFailed')
      );
    }
  };

  return {
    t,
    title,
    description,
    rating,
    type,
    difficulty,
    setTitle,
    setDescription,
    setRating,
    setType,
    setDifficulty,
    location: routeParams.location,
    elevation: routeParams.elevation,
    save,
  };
}
