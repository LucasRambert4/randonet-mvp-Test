export async function sendMessage(
  newMessage: string,
  selectedConversation: any,
  userId: string,
  supabase: any
) {
  if (newMessage.trim() === '' || !selectedConversation) return false;

  await supabase.from('messages').insert([
    {
      conversation_id: selectedConversation.id,
      sender_id: userId,
      content: newMessage,
    },
  ]);

  return true;
}
