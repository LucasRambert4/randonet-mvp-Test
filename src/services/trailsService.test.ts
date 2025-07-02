import { fetchTrailsIledeFrance } from './trailsService';

describe('trailsService', () => {
  it('should return an array', async () => {
    const trails = await fetchTrailsIledeFrance();
    expect(Array.isArray(trails)).toBe(true);
  });

  it('should contain trails with expected properties', async () => {
    const trails = await fetchTrailsIledeFrance();
    expect(trails[0]).toHaveProperty('id');
    expect(trails[0]).toHaveProperty('name');
    expect(trails[0]).toHaveProperty('distance');
  });
});
