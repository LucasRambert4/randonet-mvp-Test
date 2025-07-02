// src/screens/Explore/ExploreScreen.logic.tsx

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { fetchTrailsIledeFrance, Trail } from '../../services/trailsService';
import TrailCard from './TrailCard';

// ✔️ Import helpers bien isolés
import { formatDifficulty } from './tests/formatDifficulty';
import { getVisibleAndSorted } from './tests/getVisibleAndSorted';

export default function useExploreScreenLogic() {
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
    return getVisibleAndSorted(
      visibleTrails,
      search,
      difficulty,
      sortBy,
      sortDirection,
      (raw) => formatDifficulty(raw, t)
    );
  }, [visibleTrails, search, difficulty, sortBy, sortDirection, t]);

  const renderTrail = useCallback(
    ({ item, index }: { item: Trail; index: number }) => (
      <TrailCard item={item} index={index} navigation={navigation} t={t} />
    ),
    [navigation, t]
  );

  return {
    t,
    search,
    setSearch,
    difficulty,
    setDifficulty,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    loading,
    visibleAndSorted,
    renderTrail,
  };
}
