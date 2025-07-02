import { describe, it, expect, jest } from '@jest/globals';

const Location = {
  requestForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
};
const supabase = {
  from: jest.fn(() => ({
    insert: jest.fn(),
  })),
};
global.alert = jest.fn();

async function sendSOS() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    alert('Permission to access location was denied');
    return;
  }

  const location = await Location.getCurrentPositionAsync();
  const { latitude, longitude } = location.coords;

  const { error } = await supabase
    .from('sos_alerts')
    .insert([{ latitude, longitude }]);

  if (error) {
    alert('Failed to send SOS.');
  }
}

describe('SOSModalTrigger Logic', () => {
  it('alerts if permission is denied', async () => {
    Location.requestForegroundPermissionsAsync.mockResolvedValueOnce({
      status: 'denied',
    });
    await sendSOS();
    expect(alert).toHaveBeenCalledWith(
      'Permission to access location was denied'
    );
  });

  it('inserts to supabase if permission granted', async () => {
    Location.requestForegroundPermissionsAsync.mockResolvedValueOnce({
      status: 'granted',
    });
    Location.getCurrentPositionAsync.mockResolvedValueOnce({
      coords: { latitude: 1, longitude: 2 },
    });
    const insertMock = jest.fn().mockResolvedValueOnce({});
    supabase.from.mockReturnValueOnce({ insert: insertMock });

    await sendSOS();
    expect(insertMock).toHaveBeenCalledWith([{ latitude: 1, longitude: 2 }]);
  });

  it('alerts if supabase insert fails', async () => {
    Location.requestForegroundPermissionsAsync.mockResolvedValueOnce({
      status: 'granted',
    });
    Location.getCurrentPositionAsync.mockResolvedValueOnce({
      coords: { latitude: 1, longitude: 2 },
    });
    const insertMock = jest.fn().mockResolvedValueOnce({ error: true });
    supabase.from.mockReturnValueOnce({ insert: insertMock });

    await sendSOS();
    expect(alert).toHaveBeenCalledWith('Failed to send SOS.');
  });
});
