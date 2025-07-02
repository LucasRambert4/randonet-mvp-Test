import { getOtherUserName } from './getOtherUserName';

describe('getOtherUserName', () => {
  const t = (key: string) => `i18n:${key}`;

  it('returns other user name', () => {
    const conv = { user1: '1', user2: '2' };
    const profiles = [{ id: '2', display_name: 'Lucas' }];
    expect(getOtherUserName(conv, '1', profiles, t)).toBe('Lucas');
  });

  it('returns unknown if not found', () => {
    const conv = { user1: '1', user2: '3' };
    const profiles = [{ id: '2', display_name: 'Lucas' }];
    expect(getOtherUserName(conv, '1', profiles, t)).toBe(
      'i18n:common.unknown'
    );
  });
});
