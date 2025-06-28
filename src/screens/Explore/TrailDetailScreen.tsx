import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from '@react-navigation/native';
import MapView, { Polyline } from 'react-native-maps';
import { supabase } from '../../../supabase-config';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import styles from './TrailDetailsScreen.styles';
import { Trail } from '../../services/trailsService';

type RouteParams = {
  trail: Trail;
};

export default function TrailDetailsScreen() {
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

    const { data, error } = await supabase
      .from('saved_activities')
      .select('id')
      .eq('user_id', user.id)
      .eq('activity_id', trail.id);

    if (error) console.error('checkSaved error', error);

    setIsSaved(!!(data && data.length > 0));
  };

  const toggleSave = async () => {
    if (!user?.id || !trail?.id) return;

    if (isSaved) {
      const { error } = await supabase
        .from('saved_activities')
        .delete()
        .eq('user_id', user.id)
        .eq('activity_id', trail.id);
      if (error) console.error(error);
      setIsSaved(false);
    } else {
      const { error } = await supabase
        .from('saved_activities')
        .insert([{ user_id: user.id, activity_id: trail.id }]);
      if (error) console.error(error);
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

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator
          size="large"
          color="#02c95c"
          style={{ marginTop: 40 }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>{trail.name}</Text>
        <TouchableOpacity onPress={shareTrail}>
          <Feather name="share-2" size={22} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <MapView
          style={styles.map}
          showsUserLocation={false}
          initialRegion={{
            latitude: firstNode.lat,
            longitude: firstNode.lon,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          {Array.isArray(trail.nodes) && trail.nodes.length > 1 && (
            <Polyline
              coordinates={trail.nodes.map((n) => ({
                latitude: n.lat,
                longitude: n.lon,
              }))}
              strokeColor="#02c95c"
              strokeWidth={4}
            />
          )}
        </MapView>

        <View style={styles.contentBox}>
          <Text style={styles.summary}>{trail.summary || '-'}</Text>

          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.label}>{t('trailDetail.distance')}</Text>
              <Text style={styles.value}>{trail.distance || '-'} km</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.label}>{t('trailDetail.duration')}</Text>
              <Text style={styles.value}>
                {trail.estimatedDuration || '-'} min
              </Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.label}>{t('trailDetail.difficulty')}</Text>
              <Text style={styles.value}>{trail.difficulty || '-'}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={toggleSave}>
            <Ionicons
              name={isSaved ? 'bookmark' : 'bookmark-outline'}
              size={22}
              color={isSaved ? '#00ffcc' : '#02c95c'}
            />
            <Text style={styles.saveText}>
              {isSaved ? t('trailDetail.unsave') : t('trailDetail.save')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
