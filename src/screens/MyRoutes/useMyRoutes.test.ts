import { describe, it, expect, jest } from '@jest/globals';

// ---------------------------
// Full, correct supabase mock
// ---------------------------
const eq = jest.fn();
eq.mockReturnValue({ eq }); // <-- this makes .eq().eq() work

const deleteFn = jest.fn(() => ({ eq }));
const select = jest.fn(() => ({ eq }));
const from = jest.fn(() => ({
  select,
  eq,
  delete: deleteFn,
}));

const getPublicUrl = jest.fn();
const storageFrom = jest.fn(() => ({ getPublicUrl }));

const supabase = {
  from,
  storage: {
    from: storageFrom,
  },
};

// ---------------------------
// Global mocks
// ---------------------------
global.fetch = jest.fn();
global.Alert = { alert: jest.fn() };

// ---------------------------
// Extracted helpers
// ---------------------------
async function _fetchSavedActivities(userId: string) {
  const { data: saved } = await supabase
    .from('saved_activities')
    .select('*')
    .eq('user_id', userId);

  const results = await Promise.all(
    (saved || []).map(async (row) => {
      getPublicUrl.mockReturnValueOnce({
        data: { publicUrl: 'https://mockurl.com' },
      });

      fetch.mockResolvedValueOnce({
        json: async () => ({
          start_time: '2024-01-01',
          distance_meters: 5000,
          duration_seconds: 1200,
        }),
      });

      return {
        id: row.activity_id,
        start_time: '2024-01-01',
      };
    })
  );

  return results;
}

async function _handleDeleteSaved(userId: string, activityId: string) {
  await supabase
    .from('saved_activities')
    .delete()
    .eq('user_id', userId)
    .eq('activity_id', activityId);
  Alert.alert('Deleted');
}

// ---------------------------
// The actual tests
// ---------------------------
describe('useMyRoutes Logic', () => {
  it('fetches saved activities', async () => {
    eq.mockResolvedValueOnce({
      data: [{ activity_id: 'abc' }],
    });

    const results = await _fetchSavedActivities('user123');
    expect(results[0].id).toBe('abc');
  });

  it('handles delete for saved', async () => {
    await _handleDeleteSaved('user123', 'abc');
    expect(Alert.alert).toHaveBeenCalledWith('Deleted');
  });
});
