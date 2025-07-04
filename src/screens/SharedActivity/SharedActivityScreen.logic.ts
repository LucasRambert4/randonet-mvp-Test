import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../../supabase-config';
import { useAuth } from '../../context/AuthContext';
import { Alert, Share } from 'react-native';

export default function useSharedActivityLogic() {
  const { user } = useAuth();
  const navigation = useNavigation();
  const { t } = useTranslation();

  const [activities, setActivities] = useState<any[]>([]);
  const [saved, setSaved] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<'All' | 'User' | 'Friends'>('All');
  const pollingInterval = useRef<NodeJS.Timeout | null>(null);

  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const fetchSaved = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('saved_activities')
      .select('activity_id')
      .eq('user_id', user.id);
    setSaved(data?.map((row) => row.activity_id) || []);
  };

  const fetchActivities = async () => {
    if (!user) return;
    try {
      if (!refreshing) setLoading(true);

      const { data: friendships } = await supabase
        .from('friendships')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .eq('status', 'accepted');

      const friendIds = (friendships || []).map((f) =>
        f.sender_id === user.id ? f.receiver_id : f.sender_id
      );

      let targetUserIds: string[] = [];
      if (tab === 'All') targetUserIds = [user.id, ...friendIds];
      else if (tab === 'User') targetUserIds = [user.id];
      else if (tab === 'Friends') targetUserIds = friendIds;

      const results: any[] = [];

      for (const uid of targetUserIds) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('display_name, avatar_url')
          .eq('id', uid)
          .maybeSingle();

        const username = profile?.display_name || t('shared.usernameDefault');
        const avatar_url = profile?.avatar_url || null;

        const { data: files, error } = await supabase.storage
          .from('activities')
          .list(uid, {
            sortBy: { column: 'name', order: 'desc' },
          });

        if (error) throw error;

        for (const file of (files || []).filter((f) =>
          f.name.endsWith('.json')
        )) {
          const { data: urlData } = supabase.storage
            .from('activities')
            .getPublicUrl(`${uid}/${file.name}`);

          try {
            const res = await fetch(`${urlData.publicUrl}?t=${Date.now()}`);
            const json = await res.json();

            const distance_km = json.distance_meters
              ? json.distance_meters / 1000
              : 0;
            const distance = `${distance_km.toFixed(1)} km`;

            let duration = '0 min';
            if (json.duration_seconds != null) {
              duration =
                json.duration_seconds < 60
                  ? `${json.duration_seconds} sec`
                  : `${Math.round(json.duration_seconds / 60)} min`;
            }

            const date = json.start_time
              ? formatDate(new Date(json.start_time))
              : formatDate(new Date());

            results.push({
              ...json,
              id: `${uid}/${file.name}`,
              filename: file.name,
              user_id: uid,
              avatar_url,
              username,
              date,
              distance,
              duration,
            });
          } catch {
            console.warn(`Parse failed for ${file.name}`);
          }
        }
      }

      setActivities(results);
    } catch (err: any) {
      Alert.alert(t('shared.errorTitle'), t('shared.errorLoad'));
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchActivities();
    fetchSaved();
  };

  useFocusEffect(
    useCallback(() => {
      fetchActivities();
      fetchSaved();
      pollingInterval.current = setInterval(fetchActivities, 30000);
      return () => {
        if (pollingInterval.current) {
          clearInterval(pollingInterval.current);
          pollingInterval.current = null;
        }
      };
    }, [user, tab])
  );

  const filteredActivities = activities.filter(
    (a) =>
      a.username.toLowerCase().includes(search.toLowerCase()) ||
      a.location?.toLowerCase().includes(search.toLowerCase()) ||
      a.type?.toLowerCase().includes(search.toLowerCase())
  );

  const shareActivity = async (item: any) => {
    try {
      await Share.share({
        message: t('shared.shareMessage', {
          username: item.username,
          location: item.location,
          distance: item.distance,
          duration: item.duration,
        }),
      });
    } catch (e) {
      console.error('Share error', e);
    }
  };

  const toggleSave = async (id: string) => {
    if (!user) return;
    if (saved.includes(id)) {
      await supabase
        .from('saved_activities')
        .delete()
        .eq('user_id', user.id)
        .eq('activity_id', id);
    } else {
      await supabase.from('saved_activities').insert({
        user_id: user.id,
        activity_id: id,
      });
    }
    fetchSaved();
  };

  const handleActivityPress = (activity: any) => {
    navigation.navigate('ActivityDetail', {
      activityId: activity.id,
      activityData: activity,
    });
  };

  return {
    t,
    user,
    navigation,
    search,
    setSearch,
    tab,
    setTab,
    loading,
    refreshing,
    filteredActivities,
    onRefresh,
    handleActivityPress,
    toggleSave,
    saved,
    shareActivity,
  };
}
