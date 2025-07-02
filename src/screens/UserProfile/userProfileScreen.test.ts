import { describe, it, expect, jest } from '@jest/globals';

const single = jest.fn();
const eq = jest.fn(() => ({ single }));
const select = jest.fn(() => ({ eq }));
const from = jest.fn(() => ({ select }));

const supabase = { from };

async function getProfileAndActivities(friendId: string) {
  const { data: prof, error: profileError } = await supabase
    .from('profiles')
    .select('display_name, avatar_url')
    .eq('id', friendId)
    .single();

  if (profileError) throw new Error('Profile error');

  return prof;
}

describe('UserProfile Logic', () => {
  it('returns profile data if no error', async () => {
    single.mockResolvedValueOnce({
      data: { display_name: 'Test', avatar_url: 'url' },
    });
    const prof = await getProfileAndActivities('123');
    expect(prof).toEqual({ display_name: 'Test', avatar_url: 'url' });
  });

  it('throws if profile has error', async () => {
    single.mockResolvedValueOnce({ error: true });
    await expect(getProfileAndActivities('123')).rejects.toThrow(
      'Profile error'
    );
  });
});
