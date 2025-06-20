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
import styles from './MyRoutesScreen.styles';

export default function MyRoutesScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [tab, setTab] = useState<'Completed' | 'Saved'>('Completed');
  const [search, setSearch] = useState('');
  const pollingInterval = useRef<NodeJS.Timeout | null>(null);

  const fetchActivities = async () => {
    if (!user) return;
    try {
      if (!refreshing) setLoading(true);

      const { data, error } = await supabase.storage
        .from('activities')
        .list(user.id, { sortBy: { column: 'name', order: 'desc' } });

      if (error) throw error;

      const parsed = await Promise.all(
        (data || [])
          .filter((f) => f.name.endsWith('.json'))
          .map(async (file) => {
            try {
              const { data: urlData } = supabase.storage
                .from('activities')
                .getPublicUrl(`${user.id}/${file.name}`);

              const res = await fetch(`${urlData.publicUrl}?t=${Date.now()}`);
              const json = await res.json();

              return {
                ...json,
                id: file.name,
                filename: file.name,
                date: new Date(json.start_time).toISOString().split('T')[0],
                distance: `${(json.distance_meters / 1000).toFixed(1)} km`,
                duration: `${Math.round(json.duration_seconds / 60)} min`,
              };
            } catch (err) {
              console.warn('Failed to parse activity:', err);
              return null;
            }
          })
      );

      setActivities(parsed.filter(Boolean));
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to load activities');
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
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      if (user) {
        fetchActivities();
        pollingInterval.current = setInterval(fetchActivities, 30000); // every 30s
      }

      return () => {
        if (pollingInterval.current) {
          clearInterval(pollingInterval.current);
          pollingInterval.current = null;
        }
      };
    }, [user])
  );

  const filteredRoutes = activities.filter((route) =>
    (route.title || 'Activity').toLowerCase().includes(search.toLowerCase())
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
    navigation.navigate('ActivityDetail', {
      activityId: activity.id,
      activityData: activity,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.title}>Mes Itinéraires</Text>
        <View style={styles.rightIcons}>
          <TouchableOpacity>
            <Ionicons name="search" size={22} color="white" />
          </TouchableOpacity>
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

      <SearchBar value={search} onChangeText={setSearch} />

      <View style={styles.tabs}>
        <TouchableOpacity onPress={() => setTab('Completed')}>
          <Text
            style={[styles.tabText, tab === 'Completed' && styles.activeTab]}
          >
            Completed
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setTab('Saved')}>
          <Text style={[styles.tabText, tab === 'Saved' && styles.activeTab]}>
            Saved
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
          data={filteredRoutes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => handleActivityPress(item)}
            >
              <View style={styles.cardContent}>
                <View style={styles.left}>
                  <Text style={styles.metaText}>
                    {item.title || 'Activity'} • {item.location || 'Unknown'}
                  </Text>
                  <Text style={styles.metaText}>
                    {item.date} • {item.distance} • {item.duration}
                  </Text>
                  <Text style={styles.metaText}>
                    Elevation: {item.elevation ?? 0} m
                  </Text>
                  <Text style={styles.metaText}>
                    Difficulty: {item.difficulty ?? 'normal'}
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
