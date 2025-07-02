// src/screens/Explore/tests/formatDifficulty.ts

export function formatDifficulty(
  raw?: string,
  t: (key: string) => string = (k) => k
) {
  if (!raw) return t('explore.unknown');

  const map: Record<string, string> = {
    easy: t('explore.difficultyEasy'),
    moderate: t('explore.difficultyModerate'),
    difficult: t('explore.difficultyDifficult'),
  };

  return map[raw.toLowerCase()] || raw;
}
