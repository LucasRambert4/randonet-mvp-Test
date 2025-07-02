import { describe, it, expect, jest } from '@jest/globals';

const supabase = {
  auth: {
    signInWithPassword: jest.fn(),
  },
};
global.Alert = { alert: jest.fn() };

async function handleLogin(email: string, password: string) {
  if (!email || !password) {
    Alert.alert('Error', 'Credentials missing');
    return;
  }
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    Alert.alert('Error', 'Login failed');
  }
}

describe('LoginScreen Logic', () => {
  it('alerts if email or password missing', async () => {
    await handleLogin('', '');
    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Credentials missing');
  });

  it('alerts if signInWithPassword returns error', async () => {
    supabase.auth.signInWithPassword.mockResolvedValueOnce({ error: true });
    await handleLogin('test@test.com', 'pass');
    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Login failed');
  });

  it('does not alert if login succeeds', async () => {
    Alert.alert.mockClear();
    supabase.auth.signInWithPassword.mockResolvedValueOnce({});
    await handleLogin('test@test.com', 'pass');
    expect(Alert.alert).not.toHaveBeenCalledWith('Error', 'Login failed');
  });
});
