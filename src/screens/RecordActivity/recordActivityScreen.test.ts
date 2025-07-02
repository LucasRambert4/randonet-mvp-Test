
import { describe, it, expect } from '@jest/globals';
import haversine from 'haversine';

function calculateDistance(from: any, to: any) {
  return haversine(from, to, { unit: 'km' });
}

describe('RecordActivityScreen Logic', () => {
  it('calculates distance between two points', () => {
    const p1 = { latitude: 48.8566, longitude: 2.3522 };
    const p2 = { latitude: 48.857, longitude: 2.353 };
    const dist = calculateDistance(p1, p2);
    expect(dist).toBeGreaterThan(0);
  });
});
