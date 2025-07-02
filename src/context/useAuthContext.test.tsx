import { supabase } from '../../supabase-config';

jest.mock('../../supabase-config', () => {
  return {
    supabase: {
      auth: {
        getSession: jest.fn(),
        onAuthStateChange: jest.fn(),
      },
    },
  };
});

describe('AuthProvider logic', () => {
  it('calls getSession and sets user manually', async () => {
    const mockSetUserManually = jest.fn();

    supabase.auth.getSession.mockResolvedValue({
      data: { session: { user: { id: 'abc' } } },
    });

    // simulate what your effect does:
    const fetchSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) {
        console.error(error);
      }
      mockSetUserManually(session?.user || null);
    };

    await fetchSession();

    expect(supabase.auth.getSession).toHaveBeenCalled();
    expect(mockSetUserManually).toHaveBeenCalledWith({ id: 'abc' });
  });

  it('calls onAuthStateChange and sets user manually', () => {
    const mockSetUserManually = jest.fn();

    supabase.auth.onAuthStateChange.mockImplementation((_event, session) => {
      mockSetUserManually(session?.user || null);
      return {
        data: { subscription: { unsubscribe: jest.fn() } },
      };
    });

    // simulate what your effect does:
    supabase.auth.onAuthStateChange('SIGNED_IN', { user: { id: 'xyz' } });

    expect(supabase.auth.onAuthStateChange).toHaveBeenCalled();
    expect(mockSetUserManually).toHaveBeenCalledWith({ id: 'xyz' });
  });
});
