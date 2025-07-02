
import { describe, it, expect, jest } from '@jest/globals';

const single = jest.fn();
const eq2 = jest.fn(() => ({ single }));
const eq1 = jest.fn(() => ({ eq: eq2 }));
const select = jest.fn(() => ({ eq: eq1 }));
const from = jest.fn(() => ({ select }));
const supabase = { from };

async function checkSaved(userId: string, trailId: string) {
  let isSaved = false;
  if (!userId || !trailId) return isSaved;
  const { data } = await supabase
    .from('saved_activities')
    .select('id')
    .eq('user_id', userId)
    .eq('trail_id', trailId)
    .single();
  if (data) isSaved = true;
  return isSaved;
}

describe('TrailDetailsScreen Logic', () => {
  it('returns false if missing user or trail', async () => {
    const result = await checkSaved('', '');
    expect(result).toBe(false);
  });

  it('returns true if data exists', async () => {
    single.mockResolvedValueOnce({ data: { id: 'abc' } });
    const result = await checkSaved('user1', 'trail1');
    expect(result).toBe(true);
  });
});
