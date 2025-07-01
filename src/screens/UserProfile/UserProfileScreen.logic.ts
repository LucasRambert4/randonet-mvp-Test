import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { supabase } from '../../../supabase-config';

export default function useUserProfileLogic() {
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  const route = useRoute();
  const { friendId } = route.params as { friendId: string };

  const [user, setUser] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileAndActivities = async () => {
      try {
        // 1️⃣ Get the profile info
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id, display_name, avatar_url')
          .eq('id', friendId)
          .single();

        if (profileError) throw profileError;

        setUser({
          id: profile.id,
          name: profile.display_name,
          avatar: profile.avatar_url,
        });

        // 2️⃣ Get activities (example if using storage)
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

  return { user, navigation, t, activities, loading, handleActivityPress };
}
