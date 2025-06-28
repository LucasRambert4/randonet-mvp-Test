import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Platform,
} from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import SearchBar from '../../components/Search/SearchBar';
import { supabase } from '../../../supabase-config';
import { useTranslation } from 'react-i18next';
import styles from './ChatScreen.styles';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types/navigation';

export default function ChatListScreen() {
  const { user } = useAuth();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'Chats' | 'Groups'>('Chats');
  const [conversations, setConversations] = useState<any[]>([]);

  const { t } = useTranslation();

  const topPadding =
    Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0;

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const { data: convs } = await supabase
        .from('conversations')
        .select(
          '*, user1Profile:profiles!conversations_user1_fkey(*), user2Profile:profiles!conversations_user2_fkey(*)'
        )
        .or(`user1.eq.${user.id},user2.eq.${user.id}`);

      setConversations(convs || []);
    };

    fetchData();
  }, [user]);

  if (!user) return null;

  const getOtherUser = (conv: any) =>
    user.id === conv.user1 ? conv.user2Profile : conv.user1Profile;

  const filteredConversations = conversations.filter((conv) =>
    getOtherUser(conv)
      ?.display_name?.toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <ScrollView
      style={[styles.container, { paddingTop: topPadding }]}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.topBar}>
        <Text style={styles.title}>{t('chatList.title')}</Text>
        <View style={styles.rightIcons}>
          <TouchableOpacity onPress={() => navigation.navigate('UserSearch')}>
            <Ionicons name="search" size={24} color="white" />
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
          <Text style={[styles.tabText, tab === 'Groups' && styles.activeTab]}>
            {t('chatList.tabGroups')}
          </Text>
        </TouchableOpacity>
      </View>

      {filteredConversations.map((item) => {
        const otherUser = getOtherUser(item);
        return (
          <TouchableOpacity
            key={item.id}
            onPress={() =>
              navigation.navigate('Conversation', { conversation: item })
            }
            style={styles.chatItem}
          >
            <Image
              source={{
                uri: otherUser?.avatar_url || 'https://via.placeholder.com/50',
              }}
              style={styles.chatAvatar}
            />
            <View style={styles.chatContent}>
              <View style={styles.chatHeader}>
                <Text style={styles.chatName}>{otherUser?.display_name}</Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
