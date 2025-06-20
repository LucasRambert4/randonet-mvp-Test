import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Share,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather, Entypo } from '@expo/vector-icons';
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from '@react-navigation/native';
import MapView, { Polyline } from 'react-native-maps';
import { supabase } from '../../../supabase-config';
import { useAuth } from '../../context/AuthContext';
import styles from './ActivityDetailScreen.styles';

export default function ActivityDetailScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const route = useRoute();
  const { activityId } = route.params as { activityId: string };
  const [activityData, setActivityData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchActivity = async () => {
    if (!user || !activityId) return;
    setLoading(true);

    try {
      const { data } = supabase.storage
        .from('activities')
        .getPublicUrl(`${user.id}/${activityId}`);

      // 🔥 Cache-busting query string to force fresh fetch
      const res = await fetch(`${data.publicUrl}?t=${Date.now()}`);
      const json = await res.json();
      setActivityData(json);
    } catch (err) {
      console.error('Failed to fetch activity:', err);
      Alert.alert('Error', 'Could not load activity details.');
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

  const shareActivity = async () => {
    if (!activityData) return;
    try {
      await Share.share({
        message: `Check out my activity in ${activityData.location} – ${(
          activityData.distance_meters / 1000
        ).toFixed(1)} km over ${
          Math.round(activityData.duration_seconds / 60) || 1
        } min!`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const confirmDelete = () => {
    Alert.alert('Delete Activity', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: deleteActivity,
      },
    ]);
  };

  const deleteActivity = async () => {
    try {
      const { error } = await supabase.storage
        .from('activities')
        .remove([`${user.id}/${activityId}`]);

      if (error) throw error;

      Alert.alert('Deleted', 'Activity removed');
      navigation.goBack();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Could not delete');
    }
  };

  if (loading || !activityData) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator
          size="large"
          color="#fff"
          style={{ marginTop: 40 }}
        />
      </SafeAreaView>
    );
  }

  const routePath = activityData.path || [];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Activity Detail</Text>
        <Image
          source={{
            uri:
              user?.user_metadata?.avatar_url ||
              'https://via.placeholder.com/40',
          }}
          style={styles.avatar}
        />
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <MapView
          style={styles.map}
          showsUserLocation={false}
          initialRegion={
            routePath.length
              ? {
                  latitude: routePath[0].latitude,
                  longitude: routePath[0].longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }
              : undefined
          }
        >
          {routePath.length > 1 && (
            <Polyline
              coordinates={routePath}
              strokeColor="#00f"
              strokeWidth={3}
            />
          )}
        </MapView>

        <View style={styles.contentBox}>
          {/* Header info */}
          <View style={styles.headerRow}>
            <View style={styles.userInfo}>
              <Image
                source={{
                  uri:
                    user?.user_metadata?.avatar_url ||
                    'https://via.placeholder.com/40',
                }}
                style={styles.avatarSmall}
              />
              <View>
                <Text style={styles.username}>
                  {activityData.title || 'Activity'}
                </Text>
                <Text style={styles.meta}>
                  {new Date(activityData.start_time).toLocaleDateString()} •{' '}
                  {activityData.location || 'Unknown'}
                </Text>
              </View>
            </View>

            <View style={styles.iconRow}>
              <TouchableOpacity onPress={shareActivity}>
                <Feather name="share-2" size={22} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('SaveActivity', {
                    route: routePath,
                    distance: activityData.distance_meters,
                    startTime: new Date(activityData.start_time),
                    endTime: new Date(activityData.end_time),
                    elevation: activityData.elevation,
                    location: activityData.location,
                    activityId,
                    existingData: activityData,
                  })
                }
              >
                <Feather name="edit" size={22} color="white" />
              </TouchableOpacity>
              <TouchableOpacity onPress={confirmDelete}>
                <Entypo name="trash" size={22} color="red" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Stats grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.label}>Distance</Text>
              <Text style={styles.value}>
                {(activityData.distance_meters / 1000).toFixed(1)} km
              </Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.label}>Duration</Text>
              <Text style={styles.value}>
                {Math.round(activityData.duration_seconds / 60)} min
              </Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.label}>Elevation</Text>
              <Text style={styles.value}>{activityData.elevation || 0} m</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.label}>Difficulty</Text>
              <Text style={styles.value}>{activityData.difficulty}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.label}>Type</Text>
              <Text style={styles.value}>{activityData.type}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.label}>Rating</Text>
              <View style={{ flexDirection: 'row' }}>
                {Array.from({ length: 3 }).map((_, i) => (
                  <Ionicons
                    key={i}
                    name={i < activityData.rating ? 'star' : 'star-outline'}
                    size={18}
                    color="gold"
                  />
                ))}
              </View>
            </View>
          </View>

          {/* Description */}
          {activityData.description ? (
            <View style={{ marginTop: 20 }}>
              <Text style={styles.label}>Description</Text>
              <Text style={[styles.value, { marginTop: 4 }]}>
                {activityData.description}
              </Text>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
