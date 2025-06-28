import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import SearchBar from '../../components/Search/SearchBar';
import { supabase } from '../../../supabase-config';
import { useTranslation } from 'react-i18next';
import styles from './ChatScreen.styles';

export default function ChatScreen() {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'Chats' | 'Groups'>('Chats');
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [profiles, setProfiles] = useState<any[]>([]);

  const flatListRef = useRef<FlatList>(null);
  const isAutoScrollRef = useRef(true);
  const channelRef = useRef<any>(null);

  const handleScroll = (event: any) => {
    const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
    const distanceFromBottom =
      contentSize.height - layoutMeasurement.height - contentOffset.y;
    isAutoScrollRef.current = distanceFromBottom < 100;
  };

  const { t } = useTranslation();

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

    const tempMessage = {
      id: `temp-${Date.now()}`,
      conversation_id: selectedConversation.id,
      sender_id: user.id,
      content: newMessage,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempMessage]);
    flatListRef.current?.scrollToEnd({ animated: true });

    await supabase.from('messages').insert([
      {
        conversation_id: selectedConversation.id,
        sender_id: user.id,
        content: newMessage,
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
          setMessages((prev) => [...prev, payload.new]);
          if (isAutoScrollRef.current) {
            flatListRef.current?.scrollToEnd({ animated: true });
          }
        }
      )
      .subscribe();

    channelRef.current = newChannel;

    const fetchInitialMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', selectedConversation.id)
        .order('created_at', { ascending: true });

      if (!error) {
        setMessages(data || []);
      }
    };

    fetchInitialMessages();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [selectedConversation]);

  const topPadding =
    Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;

  if (!selectedConversation) {
    return (
      <ScrollView
        style={[styles.container, { paddingTop: topPadding }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.topBar}>
          <Text style={styles.title}>{t('chatList.title')}</Text>
          <View style={styles.rightIcons}>
            <TouchableOpacity
              onPress={() => navigation.navigate('UserSearch' as never)}
              style={{ marginRight: 12 }}
            >
              <Ionicons name="person-add" size={22} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            >
              <Image
                source={{
                  uri:
                    user?.user_metadata?.avatar_url ||
                    'https://via.placeholder.com/40',
                }}
                style={styles.avatar}
              />
            </TouchableOpacity>
          </View>
        </View>

        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder={t('chatList.searchPlaceholder')}
        />

        <View style={styles.tabs}>
          <TouchableOpacity
            onPress={() => setTab('Chats')}
            style={styles.tabItem}
          >
            <Text style={[styles.tabText, tab === 'Chats' && styles.activeTab]}>
              {t('chatList.tabChats')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setTab('Groups')}
            style={styles.tabItem}
          >
            <Text
              style={[styles.tabText, tab === 'Groups' && styles.activeTab]}
            >
              {t('chatList.tabGroups')}
            </Text>
          </TouchableOpacity>
        </View>

        {conversations.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => setSelectedConversation(item)}
            style={styles.chatItem}
          >
            <Image
              source={{ uri: 'https://via.placeholder.com/50' }}
              style={styles.chatAvatar}
            />
            <View style={styles.chatContent}>
              <View style={styles.chatHeader}>
                <Text style={styles.chatName}>{getOtherUserName(item)}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#013220', paddingTop: topPadding }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 12,
              marginBottom: 12,
              backgroundColor: '#014b2c',
              borderBottomWidth: 1,
              borderBottomColor: '#2c3e50',
            }}
          >
            <TouchableOpacity onPress={() => setSelectedConversation(null)}>
              <Ionicons
                name="arrow-back"
                size={24}
                color="white"
                style={{ marginRight: 10 }}
              />
            </TouchableOpacity>
            <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
              {getOtherUserName(selectedConversation)}
            </Text>
          </View>

          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            keyboardShouldPersistTaps="handled"
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 12, paddingTop: 8 }}
            onContentSizeChange={() => {
              if (isAutoScrollRef.current) {
                flatListRef.current?.scrollToEnd({ animated: true });
              }
            }}
            renderItem={({ item }) => (
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View
                  style={{
                    alignSelf:
                      item.sender_id === user.id ? 'flex-end' : 'flex-start',
                    backgroundColor:
                      item.sender_id === user.id ? '#2ecc71' : '#3498db',
                    padding: 10,
                    borderRadius: 10,
                    marginVertical: 4,
                    marginHorizontal: 10,
                    maxWidth: '75%',
                  }}
                >
                  <Text style={{ color: 'white' }}>{item.content}</Text>
                </View>
              </TouchableWithoutFeedback>
            )}
          />

          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: 10,
              paddingVertical: 8,
              backgroundColor: '#013220',
              borderTopWidth: 1,
              borderTopColor: 'gray',
            }}
          >
            <TextInput
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder={t('chatScreen.messagePlaceholder')}
              placeholderTextColor="#ccc"
              style={{
                flex: 1,
                backgroundColor: '#1a1a1a',
                color: 'white',
                padding: 10,
                borderRadius: 10,
              }}
            />
            <TouchableOpacity onPress={sendMessage}>
              <Text
                style={{ color: '#2ecc71', fontWeight: 'bold', padding: 10 }}
              >
                {t('chatScreen.send')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
