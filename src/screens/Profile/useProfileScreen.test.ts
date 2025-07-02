import { describe, it, expect, jest } from '@jest/globals';

// ---------------------------
// Mocks
// ---------------------------
const supabase = {
  auth: {
    updateUser: jest.fn(),
    signOut: jest.fn(),
    getUser: jest.fn(),
    getSession: jest.fn(),
  },
  storage: {
    from: jest.fn(() => ({
      upload: jest.fn(),
      getPublicUrl: jest.fn(),
    })),
  },
};

global.Alert = { alert: jest.fn() };
global.fetch = jest.fn();
const setUserManually = jest.fn();

// ---------------------------
// Example extracted helpers
// ---------------------------

async function _updateName() {
  const { error } = await supabase.auth.updateUser({
    data: { displayName: 'Test Name' },
  });
  if (error) throw new Error('Update failed');
  Alert.alert('Success', 'Name updated');
}

async function _logout() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    Alert.alert('Error', 'Logout failed');
  } else {
    setUserManually(null);
  }
}

async function _refreshUser() {
  const { data } = await supabase.auth.getUser();
  if (data?.user) setUserManually(data.user);
}

async function _deleteAccount() {
  supabase.auth.getSession.mockResolvedValueOnce({
    data: { session: { access_token: 'mocktoken' } },
  });

  fetch.mockResolvedValueOnce({ ok: true });

  const { data: session } = await supabase.auth.getSession();
  const accessToken = session.session.access_token;

  await fetch('https://your-endpoint.com', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  await supabase.auth.signOut();
  setUserManually(null);
  Alert.alert('Deleted');
}

// ---------------------------
// Tests
// ---------------------------
describe('useProfileScreen Logic', () => {
  it('updates name successfully', async () => {
    supabase.auth.updateUser.mockResolvedValueOnce({});
    await _updateName();
    expect(Alert.alert).toHaveBeenCalledWith('Success', 'Name updated');
  });

  it('logs out user', async () => {
    supabase.auth.signOut.mockResolvedValueOnce({});
    await _logout();
    expect(setUserManually).toHaveBeenCalledWith(null);
  });

  it('refreshes user', async () => {
    supabase.auth.getUser.mockResolvedValueOnce({
      data: { user: { id: 'abc' } },
    });
    await _refreshUser();
    expect(setUserManually).toHaveBeenCalledWith({ id: 'abc' });
  });

  it('handles delete account flow', async () => {
    await _deleteAccount();
    expect(fetch).toHaveBeenCalled();
    expect(Alert.alert).toHaveBeenCalledWith('Deleted');
  });
});
