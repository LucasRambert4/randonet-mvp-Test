
import { describe, it, expect, jest } from '@jest/globals';

const eq = jest.fn(() => ({ data: [{ activity_id: '1' }, { activity_id: '2' }] }));
const select = jest.fn(() => ({ eq }));
const from = jest.fn(() => ({ select }));
const supabase = { from };

async function fetchSaved(userId: string) {
  const { data } = await supabase
    .from('saved_activities')
    .select('activity_id')
    .eq('user_id', userId);
  return data.map((d: any) => d.activity_id);
}

describe('SharedActivityScreen Logic', () => {
  it('fetches saved activity IDs', async () => {
    const ids = await fetchSaved('user123');
    expect(ids).toEqual(['1', '2']);
  });
});
