import { useState, useEffect, useCallback, useRef } from 'react';
import { Alert } from 'react-native';
import { supabase } from '../../../supabase-config';
import { useTranslation } from 'react-i18next';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Trail } from '../../services/trailsService';
import { LOCAL_TRAILS } from '../../services/localTrails';

export default function useMyRoutes(user: any, tab: 'Completed' | 'Saved') {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();

  const [completedActivities, setCompletedActivities] = useState<any[]>([]);

  const [savedActivities, setSavedActivities] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);

  const [refreshing, setRefreshing] = useState(false);

  const pollingInterval = useRef<NodeJS.Timeout | null>(null);

  const fetchActivities = async () => {
    if (!user) return;

    try {
      if (!refreshing) setLoading(true);

      if (tab === 'Saved') {
        const { data: saved, error } = await supabase
          .from('saved_activities')
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;

        const results = await Promise.all(
          (saved || []).map(async (row) => {
            if (row.source === 'activity') {
              const { data: urlData } = supabase.storage
                .from('activities')
                .getPublicUrl(row.activity_id);

              const res = await fetch(`${urlData.publicUrl}?t=${Date.now()}`);
              const json = await res.json();

              const duration = row.estimated_duration
                ? `${Math.round(row.estimated_duration)} min`
                : json.duration_seconds < 60
                ? `${json.duration_seconds} sec`
                : `${Math.round(json.duration_seconds / 60)} min`;

              return {
                id: row.activity_id,
                source: 'activity',
                title: row.name || json.title || 'Untitled',
                location: row.summary || json.location || '',
                date: new Date(json.start_time).toLocaleDateString(
                  i18n.resolvedLanguage
                ),
                distance:
                  row.distance != null
                    ? `${row.distance.toFixed(1)} km`
                    : `${(json.distance_meters / 1000).toFixed(1)} km`,
                duration,
                elevation: json.elevation,
                difficulty: row.difficulty || json.difficulty || 'unknown',
                rating: json.rating,
                type: json.type,
                start_time: json.start_time,
                nodes: row.nodes || json.geojson || [],
              };
            } else if (row.source === 'trail') {
              const local = LOCAL_TRAILS.find((t) => t.id === row.activity_id);
              if (!local) return null;

              const duration = row.estimated_duration
                ? `${Math.round(row.estimated_duration)} min`
                : `${local.estimatedDuration} min`;

              return {
                id: row.activity_id,
                source: 'trail',
                title: row.name || local.name || 'Untitled Trail',
                location: row.summary || local.summary || '',
                date: '',
                distance:
                  row.distance != null
                    ? `${row.distance.toFixed(1)} km`
                    : `${local.distance.toFixed(1)} km`,
                duration,
                elevation: null,
                difficulty: row.difficulty || local.difficulty || 'unknown',
                rating: null,
                type: 'Trail',
                start_time: '',
                nodes: row.nodes || local.nodes || [],
              };
            }

            return null;
          })
        );

        setSavedActivities(
          results
            .filter(Boolean)
            .sort(
              (a, b) =>
                new Date(b.start_time || 0).getTime() -
                new Date(a.start_time || 0).getTime()
            )
        );
      } else {
        const { data: files, error } = await supabase.storage
          .from('activities')
          .list(user.id, {
            sortBy: { column: 'name', order: 'desc' },
          });

        if (error) throw error;

        const parsed = await Promise.all(
          (files || [])
            .filter((f) => f.name.endsWith('.json'))
            .map(async (f) => {
              const { data: urlData } = supabase.storage
                .from('activities')
                .getPublicUrl(`${user.id}/${f.name}`);

              const res = await fetch(`${urlData.publicUrl}?t=${Date.now()}`);
              const json = await res.json();

              const duration =
                json.duration_seconds < 60
                  ? `${json.duration_seconds} sec`
                  : `${Math.round(json.duration_seconds / 60)} min`;

              return {
                ...json,
                id: `${user.id}/${f.name}`,
                source: 'activity',
                title: json.title,
                location: json.location,
                date: new Date(json.start_time).toLocaleDateString(
                  i18n.resolvedLanguage
                ),
                distance: `${(json.distance_meters / 1000).toFixed(1)} km`,
                duration,
                elevation: json.elevation,
                difficulty: json.difficulty,
                rating: json.rating,
                type: json.type,
                start_time: json.start_time,
                nodes: json.geojson || [],
              };
            })
        );

        setCompletedActivities(
          parsed
            .filter(Boolean)
            .sort(
              (a, b) =>
                new Date(b.start_time).getTime() -
                new Date(a.start_time).getTime()
            )
        );
      }
    } catch (err: any) {
      Alert.alert(t('myRoutes.errorLoadTitle'), err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleDelete = async (activity: any) => {
    try {
      if (tab === 'Saved') {
        await supabase
          .from('saved_activities')
          .delete()
          .eq('user_id', user.id)
          .eq('activity_id', activity.id);
      } else {
        await supabase.storage.from('activities').remove([activity.id]);
      }

      Alert.alert(t('myRoutes.deleteSuccess'));
      fetchActivities();
    } catch (err: any) {
      Alert.alert(t('myRoutes.errorLoadTitle'), err.message);
    }
  };

  const confirmDelete = (activity: any) => {
    Alert.alert(
      t('myRoutes.confirmDeleteTitle'),
      t('myRoutes.confirmDeleteMessage'),
      [
        { text: t('myRoutes.cancel'), style: 'cancel' },
        {
          text: t('myRoutes.delete'),
          style: 'destructive',
          onPress: () => handleDelete(activity),
        },
      ]
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchActivities();
  };

  const handleActivityPress = (activity, tab) => {
    if (tab === 'Saved') {
      if (activity.source === 'trail') {
        navigation.navigate('Explore', {
          screen: 'TrailDetails',
          params: { trail: activity },
        });
      } else {
        navigation.navigate('Home', {
          screen: 'ActivityDetail',
          params: { activityId: activity.id, source: 'activity' },
        });
      }
    } else {
      navigation.navigate('Home', {
        screen: 'ActivityDetail',
        params: { activityId: activity.id, source: 'activity' },
      });
    }
  };

  useEffect(() => {
    if (user) fetchActivities();
  }, [user, tab]);

  useFocusEffect(
    useCallback(() => {
      if (user) {
        fetchActivities();
        pollingInterval.current = setInterval(fetchActivities, 30000);
      }

      return () => {
        if (pollingInterval.current) {
          clearInterval(pollingInterval.current);
          pollingInterval.current = null;
        }
      };
    }, [user, tab])
  );

  return {
    completedActivities,
    savedActivities,
    loading,
    refreshing,
    confirmDelete,
    onRefresh,
    handleActivityPress,
  };
}
