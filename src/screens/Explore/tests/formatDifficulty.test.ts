import { formatDifficulty } from './formatDifficulty';

describe('formatDifficulty', () => {
  const t = (key: string) => `i18n:${key}`;

  it('formats known difficulty', () => {
    expect(formatDifficulty('easy', t)).toBe('i18n:explore.difficultyEasy');
    expect(formatDifficulty('moderate', t)).toBe(
      'i18n:explore.difficultyModerate'
    );
    expect(formatDifficulty('difficult', t)).toBe(
      'i18n:explore.difficultyDifficult'
    );
  });

  it('falls back to raw if unknown', () => {
    expect(formatDifficulty('superhard', t)).toBe('superhard');
  });

  it('returns unknown if undefined', () => {
    expect(formatDifficulty(undefined, t)).toBe('i18n:explore.unknown');
  });
});
