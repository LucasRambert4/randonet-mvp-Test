import { getVisibleAndSorted } from './getVisibleAndSorted';

describe('getVisibleAndSorted', () => {
  const trails = [
    {
      name: 'Trail Alpha',
      distance: 5,
      estimatedDuration: '30',
      difficulty: 'easy',
    },
    {
      name: 'Trail Beta',
      distance: 10,
      estimatedDuration: '60',
      difficulty: 'moderate',
    },
    {
      name: 'Trail Gamma',
      distance: 2,
      estimatedDuration: '20',
      difficulty: 'difficult',
    },
  ];

  const formatDifficulty = (raw?: string) => raw || '';

  it('filters trails by search text', () => {
    const result = getVisibleAndSorted(
      trails,
      'Beta',
      '',
      'name',
      'asc',
      formatDifficulty
    );
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Trail Beta');
  });

  it('filters trails by difficulty', () => {
    const result = getVisibleAndSorted(
      trails,
      '',
      'easy',
      'name',
      'asc',
      formatDifficulty
    );
    expect(result).toHaveLength(1);
    expect(result[0].difficulty).toBe('easy');
  });

  it('sorts trails by name ascending', () => {
    const result = getVisibleAndSorted(
      trails,
      '',
      '',
      'name',
      'asc',
      formatDifficulty
    );
    expect(result[0].name).toBe('Trail Alpha');
    expect(result[1].name).toBe('Trail Beta');
    expect(result[2].name).toBe('Trail Gamma');
  });

  it('sorts trails by distance descending', () => {
    const result = getVisibleAndSorted(
      trails,
      '',
      '',
      'distance',
      'desc',
      formatDifficulty
    );
    expect(result[0].distance).toBe(10);
    expect(result[1].distance).toBe(5);
    expect(result[2].distance).toBe(2);
  });

  it('sorts trails by estimatedDuration ascending', () => {
    const result = getVisibleAndSorted(
      trails,
      '',
      '',
      'estimatedDuration',
      'asc',
      formatDifficulty
    );
    expect(result[0].estimatedDuration).toBe('20');
    expect(result[1].estimatedDuration).toBe('30');
    expect(result[2].estimatedDuration).toBe('60');
  });

  it('returns empty when no trails match search', () => {
    const result = getVisibleAndSorted(
      trails,
      'Nonexistent',
      '',
      'name',
      'asc',
      formatDifficulty
    );
    expect(result).toHaveLength(0);
  });

  it('returns empty when no trails match difficulty', () => {
    const result = getVisibleAndSorted(
      trails,
      '',
      'extreme',
      'name',
      'asc',
      formatDifficulty
    );
    expect(result).toHaveLength(0);
  });
});
