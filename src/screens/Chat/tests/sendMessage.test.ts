import { sendMessage } from './sendMessage';

describe('sendMessage', () => {
  it('calls supabase insert when message is valid', async () => {
    const mockInsert = jest.fn();
    const supabase = { from: jest.fn(() => ({ insert: mockInsert })) };

    const result = await sendMessage('Hello', { id: 1 }, '123', supabase);

    expect(supabase.from).toHaveBeenCalledWith('messages');
    expect(mockInsert).toHaveBeenCalledWith([
      {
        conversation_id: 1,
        sender_id: '123',
        content: 'Hello',
      },
    ]);
    expect(result).toBe(true);
  });

  it('returns false if message is empty', async () => {
    const result = await sendMessage('', { id: 1 }, '123', {});
    expect(result).toBe(false);
  });

  it('returns false if no conversation selected', async () => {
    const result = await sendMessage('Hello', null, '123', {});
    expect(result).toBe(false);
  });
});
