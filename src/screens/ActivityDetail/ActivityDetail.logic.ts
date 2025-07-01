import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../../supabase-config';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useCallback } from 'react';
import { Alert, Share } from 'react-native';

export const useActivityDetail = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const route = useRoute();
  const { activityId } = route.params as { activityId: string };
  const [activityData, setActivityData] = useState<any | null>(null);
  const [ownerInfo, setOwnerInfo] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const { t, i18n } = useTranslation();
  const loc = i18n.resolvedLanguage;

  const fetchActivity = async () => {
    if (!activityId) return;
    setLoading(true);

    const [ownerId, filename] = activityId.split('/');
    if (!ownerId || !filename) {
      Alert.alert(t('errors.invalidActivity'));
      setLoading(false);
      return;
    }

    try {
      const { data: publicData } = supabase.storage
        .from('activities')
        .getPublicUrl(`${ownerId}/${filename}`);
      const res = await fetch(`${publicData.publicUrl}?t=${Date.now()}`);
      const json = await res.json();
      setActivityData(json);

      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name, avatar_url')
        .eq('id', ownerId)
        .single();
      setOwnerInfo(profile);

      const { data: savedRows } = await supabase
        .from('saved_activities')
        .select('id')
        .eq('user_id', user.id)
        .eq('activity_id', activityId);
      setIsSaved(!!(savedRows && savedRows.length));
    } catch (err) {
      console.error('Failed to fetch activity:', err);
      Alert.alert(t('errors.genericTitle'), t('errors.fetchActivity'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivity();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchActivity();
    }, [])
  );

  const toggleSave = async () => {
    if (!user?.id || !activityId) return;
    if (isSaved) {
      await supabase
        .from('saved_activities')
        .delete()
        .eq('user_id', user.id)
        .eq('activity_id', activityId);
      setIsSaved(false);
    } else {
      await supabase
        .from('saved_activities')
        .insert([{ user_id: user.id, activity_id: activityId }]);
      setIsSaved(true);
    }
  };

  const shareActivity = async () => {
    if (!activityData) return;
    try {
      const message = t('activityDetail.shareMessage', {
        location: activityData.location,
        km: (activityData.distance_meters / 1000).toFixed(1),
        minutes: Math.max(1, Math.round(activityData.duration_seconds / 60)),
      });
      await Share.share({ message });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      t('activityDetail.deleteTitle'),
      t('activityDetail.deleteConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: deleteActivity,
        },
      ]
    );
  };

  const deleteActivity = async () => {
    const [ownerId, filename] = activityId.split('/');
    if (!ownerId || !filename) return;

    try {
      const { error } = await supabase.storage
        .from('activities')
        .remove([`${ownerId}/${filename}`]);
      if (error) throw error;
      Alert.alert(t('common.deleted'), t('activityDetail.deletedMsg'));
      navigation.goBack();
    } catch (err: any) {
      Alert.alert(
        t('errors.genericTitle'),
        err.message || t('errors.deleteActivity')
      );
    }
  };

  const routePath = activityData?.path || [];
  const [ownerId] = activityId.split('/');
  const isOwner = ownerId === user.id;

  return {
    t,
    loc,
    navigation,
    loading,
    activityData,
    ownerInfo,
    routePath,
    isOwner,
    shareActivity,
    toggleSave,
    isSaved,
    confirmDelete,
  };
};
