import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { Share } from 'react-native';
import { supabase } from '../../../supabase-config';

export default function useUserProfileLogic() {
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  const route = useRoute();
  const { friendId } = route.params as { friendId: string };

  const [profile, setProfile] = useState<{
    name: string;
    avatar: string;
  } | null>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileAndActivities = async () => {
      try {
        // ✅ Get friend's profile
        const { data: prof, error: profileError } = await supabase
          .from('profiles')
          .select('display_name, avatar_url')
          .eq('id', friendId)
          .single();

        if (profileError) throw profileError;

        setProfile({
          name: prof?.display_name || 'Unknown',
          avatar: prof?.avatar_url || '',
        });

        // ✅ Get friend's activities
        const { data: files } = await supabase.storage
          .from('activities')
          .list(friendId);

        const sortedFiles = (files || [])
          .filter((f) => f.name.endsWith('.json'))
          .sort(
            (a, b) =>
              new Date(b.created_at || '').getTime() -
              new Date(a.created_at || '').getTime()
          );

        const results: any[] = [];

        for (const file of sortedFiles) {
          const { data: urlData } = supabase.storage
            .from('activities')
            .getPublicUrl(`${friendId}/${file.name}`);

          const res = await fetch(`${urlData.publicUrl}?t=${Date.now()}`);
          const json = await res.json();

          results.push({
            ...json,
            id: `${friendId}/${file.name}`,
            date: new Date(json.start_time).toLocaleDateString(
              i18n.resolvedLanguage
            ),
            distance: `${(json.distance_meters / 1000).toFixed(1)} km`,
            duration: `${Math.round(json.duration_seconds / 60)} min`,
          });
        }

        setActivities(results);
      } catch (err) {
        console.error('Error fetching profile or activities:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndActivities();
  }, [friendId]);

  const handleActivityPress = (activity: any) => {
    navigation.navigate('ActivityDetail', {
      activityId: activity.id,
      activityData: activity,
    });
  };

  const shareActivity = async (item: any) => {
    try {
      await Share.share({
        message: t('shared.shareMessage', {
          username: profile?.name,
          location: item.location,
          distance: item.distance,
          duration: item.duration,
        }),
      });
    } catch (err) {
      console.error('Share error', err);
    }
  };

  return {
    navigation,
    t,
    profile,
    activities,
    loading,
    handleActivityPress,
    shareActivity,
  };
}
