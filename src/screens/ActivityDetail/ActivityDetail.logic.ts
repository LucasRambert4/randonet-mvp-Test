import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute } from '@react-navigation/native';
import { supabase } from '../../../supabase-config';
import { useAuth } from '../../context/AuthContext';
import { Alert, Share } from 'react-native';

export function useActivityDetail() {
  const { t, i18n } = useTranslation();
  const loc = i18n.language;
  const navigation = useNavigation();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [activityData, setActivityData] = useState<any>(null);
  const [ownerInfo, setOwnerInfo] = useState<any>(null);
  const [routePath, setRoutePath] = useState<any[]>([]);
  const [isSaved, setIsSaved] = useState(false);

  const avatarUrl =
    user?.user_metadata?.avatar_url || 'https://via.placeholder.com/40';

  const route = useRoute();
  const { activityId } = route.params as { activityId: string };

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        setLoading(true);

        const [userId, fileName] = activityId.split('/');

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id, display_name, avatar_url')
          .eq('id', userId)
          .maybeSingle();

        console.log('Fetched profile:', profile);

        if (profileError) throw profileError;

        setOwnerInfo(profile);

        const { data: urlData, error: urlError } = supabase.storage
          .from('activities')
          .getPublicUrl(`${userId}/${fileName}`);

        if (urlError) throw urlError;

        const res = await fetch(`${urlData.publicUrl}?t=${Date.now()}`);
        const json = await res.json();
        setActivityData(json);

        if (json.geojson?.features) {
          const coords = json.geojson.features.flatMap((f: any) =>
            f.geometry.coordinates.map((c: any) => ({
              latitude: c[1],
              longitude: c[0],
            }))
          );
          setRoutePath(coords);
        }

        if (user) {
          const { data: savedData } = await supabase
            .from('saved_activities')
            .select('*')
            .eq('user_id', user.id)
            .eq('activity_id', activityId)
            .maybeSingle();

          setIsSaved(!!savedData);
        }
      } catch (err) {
        console.error(err);
        Alert.alert(t('shared.errorTitle'), t('shared.errorLoad'));
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [activityId, user]);

  const shareActivity = async () => {
    try {
      await Share.share({
        message: t('shared.shareMessage', {
          username: ownerInfo?.display_name || 'User',
          location: activityData?.location || '',
          distance: activityData?.distance_meters
            ? `${(activityData.distance_meters / 1000).toFixed(1)} km`
            : '',
          duration: activityData?.duration_seconds
            ? activityData.duration_seconds < 60
              ? `${activityData.duration_seconds} sec`
              : `${Math.round(activityData.duration_seconds / 60)} min`
            : '',
        }),
      });
    } catch (err) {
      console.error('Share error:', err);
    }
  };

  const toggleSave = async () => {
    if (!user) return;

    if (isSaved) {
      await supabase
        .from('saved_activities')
        .delete()
        .eq('user_id', user.id)
        .eq('activity_id', activityId);
      setIsSaved(false);
    } else {
      const safeName = activityData?.name || 'Untitled Activity';
      const safeSummary = activityData?.summary || '';
      const safeDistance =
        typeof activityData?.distance_meters === 'number'
          ? activityData.distance_meters
          : 0;
      const safeDuration =
        typeof activityData?.duration_seconds === 'number'
          ? activityData.duration_seconds
          : 0;
      const safeDifficulty = activityData?.difficulty || 'unknown';
      const safeNodes = activityData?.geojson || {};

      const { error } = await supabase.from('saved_activities').insert({
        user_id: user.id,
        activity_id: activityId,
        source: 'activity',
        name: safeName,
        summary: safeSummary,
        distance: safeDistance,
        estimated_duration: safeDuration,
        difficulty: safeDifficulty,
        nodes: safeNodes,
      });

      if (error) {
        console.error('Error saving activity:', error);
        Alert.alert(t('shared.errorTitle'), t('shared.errorSave'));
        return;
      }

      setIsSaved(true);
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      t('activityDetail.confirmDeleteTitle'),
      t('activityDetail.confirmDeleteMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              const [userId, fileName] = activityId.split('/');
              await supabase.storage
                .from('activities')
                .remove([`${userId}/${fileName}`]);
              navigation.goBack();
            } catch (err) {
              console.error(err);
              Alert.alert(t('shared.errorTitle'), t('shared.errorDelete'));
            }
          },
        },
      ]
    );
  };

  const ownerAvatarUrl =
    ownerInfo?.id === user?.id
      ? avatarUrl
      : ownerInfo?.avatar_url || 'https://via.placeholder.com/40';

  console.log('Resolved ownerAvatarUrl:', ownerAvatarUrl);

  return {
    t,
    loc,
    navigation,
    loading,
    activityData,
    ownerInfo,
    routePath,
    isOwner: ownerInfo?.id === user?.id,
    shareActivity,
    toggleSave,
    isSaved,
    confirmDelete,
    avatarUrl,
    ownerAvatarUrl,
  };
}
