import { useEffect, useState, useCallback } from 'react';
import { Share } from 'react-native';
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from '@react-navigation/native';
import { supabase } from '../../../supabase-config';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Trail } from '../../services/trailsService';

type RouteParams = { trail: Trail };

export default function useTrailDetailsLogic() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { t } = useTranslation();

  const route = useRoute();
  const { trail } = route.params as RouteParams;

  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  const fallbackCoord = { lat: 48.8566, lon: 2.3522 };

  const checkSaved = async () => {
    if (!user?.id || !trail?.id) return;

    const { data } = await supabase
      .from('saved_activities')
      .select('id')
      .eq('user_id', user.id)
      .eq('activity_id', trail.id);

    setIsSaved(!!(data && data.length > 0));
  };

  const toggleSave = async () => {
    if (!user?.id || !trail?.id) return;

    if (isSaved) {
      await supabase
        .from('saved_activities')
        .delete()
        .eq('user_id', user.id)
        .eq('activity_id', trail.id);
      setIsSaved(false);
    } else {
      const insertObj = {
        user_id: user.id,
        activity_id: trail.id,
        name: trail.name || 'Unnamed Trail',
        summary: trail.summary || '',
        distance: trail.distance || 0,
        estimated_duration: trail.estimatedDuration || 0,
        difficulty: trail.difficulty || 'unknown',
        nodes: trail.nodes || [],
      };
      await supabase.from('saved_activities').insert([insertObj]);
      setIsSaved(true);
    }
  };

  const shareTrail = async () => {
    try {
      const message = `${trail.name} - ${trail.summary || ''} (${
        trail.distance
      } km)`;
      await Share.share({ message });
    } catch (err) {
      console.error('Error sharing trail:', err);
    }
  };

  const startActivity = () => {
    navigation.navigate('Record', {
      screen: 'RecordMain',
      params: { trail },
    });
  };

  useEffect(() => {
    checkSaved().finally(() => setLoading(false));
  }, []);

  useFocusEffect(
    useCallback(() => {
      checkSaved();
    }, [])
  );

  const firstNode =
    Array.isArray(trail.nodes) && trail.nodes.length > 0
      ? trail.nodes[0]
      : fallbackCoord;

  return {
    t,
    navigation,
    trail,
    loading,
    shareTrail,
    toggleSave,
    isSaved,
    startActivity,
    firstNode,
  };
}
