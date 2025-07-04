import { describe, it, expect, jest } from '@jest/globals';

const single = jest.fn();
const select = jest.fn(() => ({ single }));
const from = jest.fn(() => ({ select }));
const supabase = { from };

async function fetchActivity(activityId: string) {
  if (!activityId) return null;
  const [ownerId, filename] = activityId.split('/');
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .single();
  if (error) throw new Error('Fetch error');
  return data;
}

describe('ActivityDetail Logic', () => {
  it('returns null if no activityId', async () => {
    const result = await fetchActivity('');
    expect(result).toBeNull();
  });

  it('returns data if no error', async () => {
    single.mockResolvedValueOnce({ data: { id: '123' } });
    const data = await fetchActivity('owner/file');
    expect(data).toEqual({ id: '123' });
  });

  it('throws if error', async () => {
    single.mockResolvedValueOnce({ error: true });
    await expect(fetchActivity('owner/file')).rejects.toThrow('Fetch error');
  });
});
