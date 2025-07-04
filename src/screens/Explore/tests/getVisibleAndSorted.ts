import { Trail } from '../../../services/trailsService';

export function getVisibleAndSorted(
  trails: Trail[],
  search: string,
  difficulty: string,
  sortBy: 'name' | 'distance' | 'estimatedDuration',
  sortDirection: 'asc' | 'desc',
  formatDifficulty: (raw?: string) => string
) {
  return trails
    .filter(
      (trail) =>
        trail.name.toLowerCase().includes(search.toLowerCase()) &&
        (difficulty ? formatDifficulty(trail.difficulty) === difficulty : true)
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
}
