import { useEffect, useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { fetchTrailsIledeFrance, Trail } from '../../services/trailsService';
import TrailCard from './TrailCard';

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

  const formatDifficulty = (raw?: string) => {
    if (!raw) return t('explore.unknown');
    const map: Record<string, string> = {
      easy: t('explore.difficultyEasy'),
      moderate: t('explore.difficultyModerate'),
      difficult: t('explore.difficultyDifficult'),
    };
    return map[raw.toLowerCase()] || raw;
  };

  const visibleAndSorted = useMemo(() => {
    return visibleTrails
      .filter(
        (trail) =>
          trail.name.toLowerCase().includes(search.toLowerCase()) &&
          (difficulty
            ? formatDifficulty(trail.difficulty) === difficulty
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

  return {
    t,
    search,
    setSearch,
    loading,
    visibleAndSorted,
    renderTrail,
  };
}
