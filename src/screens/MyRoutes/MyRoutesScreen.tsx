import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  DrawerActions,
  useNavigation,
  useFocusEffect,
} from '@react-navigation/native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import SearchBar from '../../components/Search/SearchBar';
import { supabase } from '../../../supabase-config';
import { useTranslation } from 'react-i18next';
import styles from './MyRoutesScreen.styles';

export default function MyRoutesScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const [completedActivities, setCompletedActivities] = useState<any[]>([]);
  const [savedActivities, setSavedActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [tab, setTab] = useState<'Completed' | 'Saved'>('Completed');
  const [search, setSearch] = useState('');
  const pollingInterval = useRef<NodeJS.Timeout | null>(null);

  const fetchActivities = async () => {
    if (!user) return;
    try {
      if (!refreshing) setLoading(true);

      if (tab === 'Saved') {
        const { data: saved, error: savedError } = await supabase
          .from('saved_activities')
          .select('activity_id')
          .eq('user_id', user.id);

        if (savedError) throw savedError;

        const results = await Promise.all(
          (saved || []).map(async ({ activity_id }) => {
            try {
              const { data: urlData } = supabase.storage
                .from('activities')
                .getPublicUrl(activity_id);

              const res = await fetch(`${urlData.publicUrl}?t=${Date.now()}`);
              const json = await res.json();

              return {
                ...json,
                id: activity_id, // full storage path as ID
                title: json.title,
                location: json.location,
                date: new Date(json.start_time).toLocaleDateString(
                  i18n.resolvedLanguage
                ),
                distance: `${(json.distance_meters / 1000).toFixed(1)} km`,
                duration: `${Math.round(json.duration_seconds / 60)} min`,
                elevation: json.elevation,
                difficulty: json.difficulty,
                rating: json.rating,
                type: json.type,
              };
            } catch (err) {
              console.warn('Could not fetch saved activity:', err);
              return null;
            }
          })
        );

        setSavedActivities(results.filter(Boolean));
      } else {
        const { data: files, error: filesError } = await supabase.storage
          .from('activities')
          .list(user.id, {
            sortBy: { column: 'name', order: 'desc' },
          });

        if (filesError) throw filesError;

        const parsed = await Promise.all(
          (files || [])
            .filter((file) => file.name.endsWith('.json'))
            .map(async (file) => {
              try {
                const { data: urlData } = supabase.storage
                  .from('activities')
                  .getPublicUrl(`${user.id}/${file.name}`);

                const res = await fetch(`${urlData.publicUrl}?t=${Date.now()}`);
                const json = await res.json();

                return {
                  ...json,
                  id: `${user.id}/${file.name}`,
                  title: json.title,
                  location: json.location,
                  date: new Date(json.start_time).toLocaleDateString(
                    i18n.resolvedLanguage
                  ),
                  distance: `${(json.distance_meters / 1000).toFixed(1)} km`,
                  duration: `${Math.round(json.duration_seconds / 60)} min`,
                  elevation: json.elevation,
                  difficulty: json.difficulty,
                  rating: json.rating,
                  type: json.type,
                };
              } catch (err) {
                console.warn('Could not parse completed activity:', err);
                return null;
              }
            })
        );

        setCompletedActivities(parsed.filter(Boolean));
      }
    } catch (err: any) {
      Alert.alert(
        t('myRoutes.errorLoadTitle'),
        err.message || t('myRoutes.errorLoadMessage')
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchActivities();
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

  const dataSource = (
    tab === 'Saved' ? savedActivities : completedActivities
  ).filter((route) =>
    (route.title || t('myRoutes.activityDefault'))
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const renderActivityIcon = (type: string) => {
    switch (type) {
      case 'hiking':
        return <FontAwesome5 name="hiking" size={20} color="white" />;
      case 'running':
        return <FontAwesome5 name="running" size={20} color="white" />;
      case 'biking':
        return <FontAwesome5 name="bicycle" size={20} color="white" />;
      default:
        return null;
    }
  };

  const handleActivityPress = (activity: any) => {
    if (tab === 'Saved') {
      navigation.navigate('TrailDetails', {
        trail: {
          id: activity.id,
          name: activity.title,
          summary: activity.location,
          distance: parseFloat(activity.distance),
          estimatedDuration: parseFloat(activity.duration),
          difficulty: activity.difficulty,
          nodes: [], // << THIS is the `nodes: []` placeholder
        },
      });
    } else {
      navigation.navigate('ActivityDetail', {
        activityId: activity.id,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.title}>{t('myRoutes.title')}</Text>
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
        placeholder={t('myRoutes.searchPlaceholder')}
      />

      <View style={styles.tabs}>
        <TouchableOpacity onPress={() => setTab('Completed')}>
          <Text
            style={[styles.tabText, tab === 'Completed' && styles.activeTab]}
          >
            {t('myRoutes.tabCompleted')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setTab('Saved')}>
          <Text style={[styles.tabText, tab === 'Saved' && styles.activeTab]}>
            {t('myRoutes.tabSaved')}
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#fff"
          style={{ marginTop: 20 }}
        />
      ) : (
        <FlatList
          data={dataSource}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => handleActivityPress(item)}
            >
              <View style={styles.cardContent}>
                <View style={styles.left}>
                  <Text style={styles.metaText}>
                    {item.title || t('myRoutes.activityDefault')} •{' '}
                    {item.location || t('myRoutes.unknown')}
                  </Text>
                  <Text style={styles.metaText}>
                    {item.date} • {item.distance} • {item.duration}
                  </Text>
                  <Text style={styles.metaText}>
                    {t('myRoutes.elevationLabel')}: {item.elevation ?? 0} m
                  </Text>
                  <Text style={styles.metaText}>
                    {t('myRoutes.difficultyLabel')}: {item.difficulty ?? ''}
                  </Text>
                  <View style={styles.rating}>
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Ionicons
                        key={i}
                        name={i < (item.rating || 0) ? 'star' : 'star-outline'}
                        size={18}
                        color="white"
                      />
                    ))}
                  </View>
                </View>
                <View style={styles.right}>
                  {renderActivityIcon(item.type)}
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
