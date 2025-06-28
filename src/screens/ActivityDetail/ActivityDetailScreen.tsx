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
import { useTranslation } from 'react-i18next';
import styles from './ActivityDetailScreen.styles';

export default function ActivityDetailScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const route = useRoute();
  const { activityId } = route.params as { activityId: string };
  const [activityData, setActivityData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [ownerInfo, setOwnerInfo] = useState<any | null>(null);
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

  if (loading || !activityData || !ownerInfo) {
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
  const [ownerId] = activityId.split('/');
  const isOwner = ownerId === user.id;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>{t('activityDetail.title')}</Text>
        <Image
          source={{
            uri: ownerInfo.avatar_url || 'https://via.placeholder.com/40',
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
          <View style={styles.headerRow}>
            <View style={styles.userInfo}>
              <Image
                source={{
                  uri: ownerInfo.avatar_url || 'https://via.placeholder.com/40',
                }}
                style={styles.avatarSmall}
              />
              <View>
                <Text style={styles.username}>
                  {ownerInfo.display_name || t('common.user')}
                </Text>
                <Text style={styles.meta}>
                  {new Date(activityData.start_time).toLocaleDateString(loc)} •{' '}
                  {activityData.location || t('common.unknown')}
                </Text>
              </View>
            </View>

            <View style={styles.iconRow}>
              <TouchableOpacity onPress={shareActivity}>
                <Feather name="share-2" size={22} color="white" />
              </TouchableOpacity>
              <TouchableOpacity onPress={toggleSave}>
                <Ionicons
                  name={isSaved ? 'bookmark' : 'bookmark-outline'}
                  size={22}
                  color={isSaved ? '#00ffcc' : 'white'}
                />
              </TouchableOpacity>
              {isOwner && (
                <>
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
                </>
              )}
            </View>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.label}>{t('activityDetail.distance')}</Text>
              <Text style={styles.value}>
                {(activityData.distance_meters / 1000).toFixed(1)} km
              </Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.label}>{t('activityDetail.duration')}</Text>
              <Text style={styles.value}>
                {Math.round(activityData.duration_seconds / 60)}{' '}
                {t('common.minutes')}
              </Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.label}>{t('activityDetail.elevation')}</Text>
              <Text style={styles.value}>{activityData.elevation || 0} m</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.label}>{t('activityDetail.difficulty')}</Text>
              <Text style={styles.value}>{activityData.difficulty}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.label}>{t('activityDetail.type')}</Text>
              <Text style={styles.value}>{activityData.type}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.label}>{t('activityDetail.rating')}</Text>
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

          {activityData.description ? (
            <View style={{ marginTop: 20 }}>
              <Text style={styles.label}>
                {t('activityDetail.description')}
              </Text>
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
