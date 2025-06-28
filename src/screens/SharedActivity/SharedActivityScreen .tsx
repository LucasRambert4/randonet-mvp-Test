import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  Share,
  Alert,
} from 'react-native';
import {
  DrawerActions,
  useNavigation,
  useFocusEffect,
} from '@react-navigation/native';
import MapView, { Polyline } from 'react-native-maps';
import { Ionicons, Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import SearchBar from '../../components/Search/SearchBar';
import { supabase } from '../../../supabase-config';
import { useTranslation } from 'react-i18next';
import styles from './SharedActivityScreen.styles';

export default function SharedActivityScreen() {
  const { user } = useAuth();
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();

  const [activities, setActivities] = useState<any[]>([]);
  const [saved, setSaved] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<'All' | 'User' | 'Friends'>('All');
  const pollingInterval = useRef<NodeJS.Timeout | null>(null);

  const fetchSaved = async () => {
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
        const { data: files } = await supabase.storage
          .from('activities')
          .list(uid);

        const { data: profile } = await supabase
          .from('profiles')
          .select('display_name, avatar_url')
          .eq('id', uid)
          .maybeSingle();

        const username = profile?.display_name || t('shared.usernameDefault');
        const avatar_url = profile?.avatar_url || null;

        const sortedFiles = (files || [])
          .filter((f) => f.name.endsWith('.json'))
          .sort(
            (a, b) =>
              new Date(b.created_at || '').getTime() -
              new Date(a.created_at || '').getTime()
          );

        for (const file of sortedFiles) {
          const { data: urlData } = supabase.storage
            .from('activities')
            .getPublicUrl(`${uid}/${file.name}`);

          try {
            const res = await fetch(`${urlData.publicUrl}?t=${Date.now()}`);
            const json = await res.json();

            results.push({
              ...json,
              id: `${uid}/${file.name}`,
              filename: file.name,
              user_id: uid,
              avatar_url,
              username,
              date: new Date(json.start_time).toLocaleDateString(
                i18n.resolvedLanguage
              ),
              distance: `${(json.distance_meters / 1000).toFixed(1)} km`,
              duration: `${Math.round(json.duration_seconds / 60)} min`,
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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.topBar}>
        <Text style={styles.title}>{t('shared.title')}</Text>
        <View style={styles.rightIcons}>
          <TouchableOpacity
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          >
            <Image
              source={{
                uri:
                  user?.user_metadata?.avatar_url ||
                  'https://via.placeholder.com/40',
              }}
              style={styles.avatar}
            />
          </TouchableOpacity>
        </View>
      </View>

      <SearchBar
        value={search}
        onChangeText={setSearch}
        placeholder={t('shared.searchPlaceholder')}
      />

      <View style={styles.tabs}>
        {['All', 'User', 'Friends'].map((label) => (
          <TouchableOpacity
            key={label}
            onPress={() => setTab(label as any)}
            style={[styles.tabButton, tab === label && styles.activeTabButton]}
          >
            <Text style={[styles.tabText, tab === label && styles.activeTab]}>
              {t(`shared.tab${label}`)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#fff"
          style={{ marginTop: 20 }}
        />
      ) : (
        <FlatList
          data={filteredActivities}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleActivityPress(item)}>
              <View style={styles.card}>
                <View style={styles.header}>
                  <Image
                    source={{
                      uri:
                        item.user_id === user.id
                          ? user?.user_metadata?.avatar_url ||
                            'https://via.placeholder.com/40'
                          : item.avatar_url || 'https://via.placeholder.com/30',
                    }}
                    style={styles.avatar}
                  />
                  <View>
                    <Text style={styles.username}>{item.username}</Text>
                    <Text style={styles.meta}>
                      {item.date}, {item.location || t('shared.unknown')}
                    </Text>
                    <Text style={styles.meta}>
                      {t('shared.labelActivity')}: {item.type} •{' '}
                      {t('shared.labelDifficulty')}: {item.difficulty}
                    </Text>
                    <Text style={styles.meta}>
                      {item.distance} • {item.duration}
                    </Text>
                  </View>
                </View>

                {item.path?.length > 1 ? (
                  <MapView
                    style={styles.map}
                    scrollEnabled={false}
                    zoomEnabled={false}
                    pitchEnabled={false}
                    rotateEnabled={false}
                    initialRegion={{
                      latitude: item.path[0].latitude,
                      longitude: item.path[0].longitude,
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.01,
                    }}
                  >
                    <Polyline
                      coordinates={item.path}
                      strokeColor="#00f"
                      strokeWidth={3}
                    />
                  </MapView>
                ) : (
                  <Image
                    source={require('../../../assets/map-placeholder.png')}
                    style={styles.map}
                    resizeMode="cover"
                  />
                )}

                <View style={styles.actions}>
                  <TouchableOpacity onPress={() => toggleSave(item.id)}>
                    <Ionicons
                      name={
                        saved.includes(item.id)
                          ? 'bookmark'
                          : 'bookmark-outline'
                      }
                      size={24}
                      color="white"
                    />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => shareActivity(item)}>
                    <Feather name="share-2" size={22} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#fff"
            />
          }
        />
      )}
    </SafeAreaView>
  );
}
