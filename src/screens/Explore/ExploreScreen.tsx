// File: src/screens/Explore/ExploreScreen.tsx

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
  ActivityIndicator,
  Image,
  Animated,
} from 'react-native';
import MapView, { Polyline } from 'react-native-maps';
import { fetchTrailsIledeFrance, Trail } from '../../services/trailsService';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

const formatDifficulty = (raw?: string, t: any) => {
  if (!raw) return t('explore.unknown');
  const map: Record<string, string> = {
    easy: t('explore.difficultyEasy'),
    moderate: t('explore.difficultyModerate'),
    difficult: t('explore.difficultyDifficult'),
  };
  return map[raw.toLowerCase()] || raw;
};

const TrailCard = ({
  item,
  index,
  navigation,
  t,
}: {
  item: Trail;
  index: number;
  navigation: any;
  t: any;
}) => {
  const fadeAnim = useMemo(() => new Animated.Value(0), []);
  const translateY = useMemo(() => new Animated.Value(20), []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      delay: index * 100,
      useNativeDriver: true,
    }).start();

    Animated.timing(translateY, {
      toValue: 0,
      duration: 400,
      delay: index * 100,
      useNativeDriver: true,
    }).start();
  }, []);

  const detailText = `${item.distance.toFixed(1)} km · ${
    item.estimatedDuration
  } min · ${item.difficulty}`;

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY }],
      }}
    >
      <View style={styles.card}>
        <Text style={styles.name}>{item.name}</Text>
        {item.summary && <Text style={styles.summary}>{item.summary}</Text>}
        <Text style={styles.detail}>{detailText}</Text>

        {item.nodes.length > 1 ? (
          <MapView
            style={styles.mapPreview}
            scrollEnabled={false}
            zoomEnabled={false}
            pitchEnabled={false}
            rotateEnabled={false}
            initialRegion={{
              latitude: item.nodes[0].lat,
              longitude: item.nodes[0].lon,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            }}
          >
            <Polyline
              coordinates={item.nodes.map((n) => ({
                latitude: n.lat,
                longitude: n.lon,
              }))}
              strokeColor="#02c95c"
              strokeWidth={3}
            />
          </MapView>
        ) : (
          <Image
            source={require('../../../assets/map-placeholder.png')}
            style={styles.mapPreview}
            resizeMode="cover"
          />
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('TrailDetails', { trail: item })}
        >
          <Text style={styles.buttonText}>{t('explore.viewDetails')}</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default function ExploreScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [sortBy, setSortBy] = useState<
    'name' | 'distance' | 'estimatedDuration'
  >('distance');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const [allTrails, setAllTrails] = useState<Trail[]>([]);
  const [visibleTrails, setVisibleTrails] = useState<Trail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrailsIledeFrance(1, 20).then((localBatch) => {
      setAllTrails(localBatch);
      setVisibleTrails([]);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (loading || allTrails.length === 0) return;

    const interval = setInterval(() => {
      setVisibleTrails((current) => {
        if (current.length >= allTrails.length) {
          clearInterval(interval);
          return current;
        }
        return [...current, allTrails[current.length]];
      });
    }, 150);

    return () => clearInterval(interval);
  }, [allTrails, loading]);

  const visibleAndSorted = useMemo(() => {
    return visibleTrails
      .filter(
        (t) =>
          t.name.toLowerCase().includes(search.toLowerCase()) &&
          (difficulty
            ? formatDifficulty(t.difficulty, () => difficulty) === difficulty
            : true)
      )
      .sort((a, b) => {
        const getVal = (t: Trail) =>
          sortBy === 'name'
            ? t.name
            : sortBy === 'distance'
            ? t.distance
            : parseInt(t.estimatedDuration, 10);
        const aVal = getVal(a);
        const bVal = getVal(b);
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return sortDirection === 'asc'
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }
        return sortDirection === 'asc'
          ? (aVal as number) - (bVal as number)
          : (bVal as number) - (aVal as number);
      });
  }, [visibleTrails, search, difficulty, sortBy, sortDirection]);

  const renderTrail = useCallback(
    ({ item, index }: { item: Trail; index: number }) => (
      <TrailCard item={item} index={index} navigation={navigation} t={t} />
    ),
    [navigation, t]
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>{t('explore.title')}</Text>

        <TextInput
          placeholder={t('explore.searchPlaceholder')}
          placeholderTextColor="#aaa"
          value={search}
          onChangeText={setSearch}
          style={styles.input}
        />

        {loading ? (
          <ActivityIndicator size="large" color="#fff" style={styles.loader} />
        ) : (
          <FlatList
            data={visibleAndSorted}
            keyExtractor={(i) => i.id}
            contentContainerStyle={styles.list}
            renderItem={renderTrail}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
    backgroundColor: '#013220',
  },
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 12 },
  input: {
    backgroundColor: '#024d2d',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    color: '#fff',
  },
  list: { paddingBottom: 20 },
  loader: { marginTop: 20 },
  card: {
    backgroundColor: '#024d2d',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    marginBottom: 16,
  },
  name: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  summary: {
    fontSize: 13,
    color: '#ddd',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  detail: { fontSize: 14, color: '#ccc', marginBottom: 8 },
  mapPreview: {
    width: '100%',
    height: 180,
    marginVertical: 10,
    borderRadius: 12,
  },
  button: {
    backgroundColor: '#02c95c',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: { color: '#013220', fontWeight: 'bold' },
});
