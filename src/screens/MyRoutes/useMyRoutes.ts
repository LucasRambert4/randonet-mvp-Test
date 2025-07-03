import { useState, useEffect, useCallback, useRef } from 'react';
import { Alert } from 'react-native';
import { supabase } from '../../../supabase-config';
import { useTranslation } from 'react-i18next';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Trail } from '../../services/trailsService';
import { LOCAL_TRAILS } from '../../services/localTrails';

/**
 * ✅ Custom hook for fetching either:
 *  - Completed activities owned by the current user
 *  - Saved activities bookmarked by the current user
 *
 * @param user - The current authenticated user object
 * @param tab - Either "Completed" or "Saved" determines query logic
 */
export default function useMyRoutes(user: any, tab: 'Completed' | 'Saved') {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();

  // Stores activities from storage owned by the user
  const [completedActivities, setCompletedActivities] = useState<any[]>([]);
  // Stores activities that the user has saved/bookmarked
  const [savedActivities, setSavedActivities] = useState<any[]>([]);
  // Loading flag for spinner
  const [loading, setLoading] = useState(false);
  // Refreshing flag for pull-to-refresh
  const [refreshing, setRefreshing] = useState(false);

  // Interval for auto-polling every 30s when screen is focused
  const pollingInterval = useRef<NodeJS.Timeout | null>(null);

  /**
   * ✅ Core function: Fetch either "Saved" or "Completed" activities
   */
  const fetchActivities = async () => {
    if (!user) return;

    try {
      if (!refreshing) setLoading(true);

      if (tab === 'Saved') {
        // ✅ Get all saved activities
        const { data: saved, error } = await supabase
          .from('saved_activities')
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;

        const results = await Promise.all(
          (saved || []).map(async (row) => {
            if (row.source === 'activity') {
              // ✅ Real uploaded activity → fetch JSON from Storage
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
              // ✅ Saved local trail → find in LOCAL_TRAILS
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
                date: '', // optional: local trails may not have date
                distance:
                  row.distance != null
                    ? `${row.distance.toFixed(1)} km`
                    : `${local.distance.toFixed(1)} km`,
                duration,
                elevation: null, // optional: add if local trail has it
                difficulty: row.difficulty || local.difficulty || 'unknown',
                rating: null, // optional: no rating for local
                type: 'Trail',
                start_time: '', // optional: local trail may not have start time
                nodes: row.nodes || local.nodes || [],
              };
            }

            return null; // fallback
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
        // ✅ If viewing Completed (always uploaded)
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

  /**
   * ✅ Handles actual deletion:
   * - If tab is Saved: removes from `saved_activities` table
   * - If tab is Completed: removes JSON file from storage bucket
   */
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

  /**
   * ✅ Shows confirmation alert before actual deletion.
   */
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

  /**
   * ✅ Pull-to-refresh logic.
   */
  const onRefresh = () => {
    setRefreshing(true);
    fetchActivities();
  };

  /**
   * ✅ Navigates when a user taps a route.
   * - Saved => opens TrailDetails in Explore stack
   * - Completed => opens ActivityDetail in Home stack
   */
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

  /**
   * ✅ Runs initially when mounted or when user/tab changes.
   */
  useEffect(() => {
    if (user) fetchActivities();
  }, [user, tab]);

  /**
   * ✅ Re-fetch when screen is focused + sets up auto polling.
   */
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

  /**
   * ✅ Hook returns:
   */
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
