import { describe, it, expect, jest } from '@jest/globals';

const eq = jest.fn();
const select = jest.fn(() => ({ eq }));
const from = jest.fn(() => ({ select }));
const supabase = { from };

async function fetchProfilesAndFriends(userId: string) {
  const { data: profileData, error: userErr } = await supabase
    .from('profiles')
    .select('id, display_name, avatar_url');

  if (userErr) throw new Error('Profile fetch failed');

  const { data: friendships } = await supabase
    .from('friendships')
    .select('friend_id')
    .eq('user_id', userId);

  return { profileData, friendships };
}

describe('UserSearchScreen Logic', () => {
  it('throws if profiles fetch fails', async () => {
    select.mockResolvedValueOnce({ error: true });
    await expect(fetchProfilesAndFriends('abc')).rejects.toThrow(
      'Profile fetch failed'
    );
  });

  it('returns profile and friendships', async () => {
    select.mockResolvedValueOnce({ data: [{ id: '1' }] });
    eq.mockResolvedValueOnce({ data: [{ friend_id: 'f1' }] });

    const result = await fetchProfilesAndFriends('abc');
    expect(result).toEqual({
      profileData: [{ id: '1' }],
      friendships: [{ friend_id: 'f1' }],
    });
  });
});
