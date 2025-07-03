import { useEffect, useState, useRef } from 'react';
import { Platform, StatusBar } from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { supabase } from '../../../supabase-config';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { ChatStackParamList } from '../../navigation/types';

export default function useChatScreenLogic() {
  const { user } = useAuth();
  const navigation =
    useNavigation<NativeStackNavigationProp<ChatStackParamList>>();
  const { t } = useTranslation();

  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'Chats' | 'Groups'>('Chats');
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [profiles, setProfiles] = useState<any[]>([]);

  const flatListRef = useRef<any>(null);
  const isAutoScrollRef = useRef(true);
  const channelRef = useRef<any>(null);

  const handleScroll = (event: any) => {
    const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
    const distanceFromBottom =
      contentSize.height - layoutMeasurement.height - contentOffset.y;
    isAutoScrollRef.current = distanceFromBottom < 100;
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      const { data: convs } = await supabase
        .from('conversations')
        .select('*')
        .or(`user1.eq.${user.id},user2.eq.${user.id}`);

      const { data: profs } = await supabase
        .from('profiles')
        .select('id, display_name');

      setConversations(convs || []);
      setProfiles(profs || []);
    };

    fetchData();
  }, [user]);

  const getOtherUserName = (conv: any) => {
    const otherId = conv.user1 === user.id ? conv.user2 : conv.user1;
    return (
      profiles.find((p) => p.id === otherId)?.display_name ||
      t('common.unknown')
    );
  };

  const sendMessage = async () => {
    if (newMessage.trim() === '' || !selectedConversation) return;

    await supabase.from('messages').insert([
      {
        conversation_id: selectedConversation.id,
        sender_id: user.id,
        content: newMessage.trim(),
      },
    ]);

    setNewMessage('');
  };

  useEffect(() => {
    if (!selectedConversation) return;

    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    const newChannel = supabase
      .channel(`conversation-${selectedConversation.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${selectedConversation.id}`,
        },
        (payload) => {
          setMessages((prev) => {
            if (prev.some((m) => m.id === payload.new.id)) return prev;
            return [...prev, payload.new];
          });
          if (isAutoScrollRef.current) {
            flatListRef.current?.scrollToEnd({ animated: true });
          }
        }
      )
      .subscribe();

    channelRef.current = newChannel;

    const fetchInitialMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', selectedConversation.id)
        .order('created_at', { ascending: true });

      setMessages(data || []);
    };

    fetchInitialMessages();

    return () => {
      if (channelRef.current) supabase.removeChannel(channelRef.current);
    };
  }, [selectedConversation]);

  const topPadding =
    Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;

  return {
    topPadding,
    selectedConversation,
    setSelectedConversation,
    navigation,
    search,
    setSearch,
    tab,
    setTab,
    conversations,
    getOtherUserName,
    t,
    user,
    profiles,
    messages,
    newMessage,
    setNewMessage,
    flatListRef,
    handleScroll,
    sendMessage,
  };
}
