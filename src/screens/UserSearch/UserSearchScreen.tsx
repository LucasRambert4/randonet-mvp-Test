import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import SearchBar from '../../components/Search/SearchBar';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../../supabase-config';
import { useTranslation } from 'react-i18next';

export default function UserSearchScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [friendships, setFriendships] = useState<any[]>([]);

  useEffect(() => {
    async function fetchEverything() {
      const { data: profileData, error: userErr } = await supabase
        .from('profiles')
        .select('id, display_name, avatar_url');

      if (!userErr && profileData) {
        const filtered = profileData.filter((u) => u.id !== user?.id);
        setUsers(filtered);
      }

      const { data: friendData, error: friendErr } = await supabase
        .from('friendships')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

      if (!friendErr && friendData) {
        setFriendships(friendData);
      }
    }

    fetchEverything();
  }, []);

  const acceptFriend = async (id: string) => {
    await supabase
      .from('friendships')
      .update({ status: 'accepted' })
      .eq('id', id);
    refreshFriendships();
  };

  const rejectFriend = async (id: string) => {
    await supabase
      .from('friendships')
      .update({ status: 'rejected' })
      .eq('id', id);
    refreshFriendships();
  };

  const refreshFriendships = async () => {
    const { data } = await supabase
      .from('friendships')
      .select('*')
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);
    setFriendships(data || []);
  };

  const sendRequest = async (targetId: string) => {
    await supabase.from('friendships').insert([
      {
        sender_id: user.id,
        receiver_id: targetId,
        status: 'pending',
      },
    ]);
    refreshFriendships();
  };

  const getFriendStatus = (targetId: string) => {
    const rel = friendships.find(
      (f) =>
        (f.sender_id === user.id && f.receiver_id === targetId) ||
        (f.receiver_id === user.id && f.sender_id === targetId)
    );
    return rel?.status || 'none';
  };

  const getFriendRelation = (targetId: string) => {
    return friendships.find(
      (f) =>
        (f.sender_id === user.id && f.receiver_id === targetId) ||
        (f.receiver_id === user.id && f.sender_id === targetId)
    );
  };

  const filtered = users.filter((u) => {
    const name = u.display_name || u.email || '';
    return name.toLowerCase().includes(query.toLowerCase());
  });

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar
        value={query}
        onChangeText={setQuery}
        placeholder={t('userSearch.searchPlaceholder')}
      />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{t('userSearch.noUsers')}</Text>
          </View>
        )}
        renderItem={({ item }) => {
          const status = getFriendStatus(item.id);
          const rel = getFriendRelation(item.id);
          const name = item.display_name || item.email;

          return (
            <TouchableOpacity
              onPress={() => navigation.navigate('UserProfile', { user: item })}
              style={styles.userRow}
            >
              <Image
                source={{
                  uri: item.avatar_url || 'https://via.placeholder.com/40',
                }}
                style={styles.avatar}
              />
              <View style={styles.userInfo}>
                <Text style={styles.username}>{name}</Text>

                {status === 'pending' && rel?.receiver_id === user.id && (
                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      onPress={() => acceptFriend(rel.id)}
                      style={styles.actionBtn}
                    >
                      <Text style={[styles.actionText, styles.acceptText]}>
                        {t('userSearch.accept')}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => rejectFriend(rel.id)}
                      style={styles.actionBtn}
                    >
                      <Text style={[styles.actionText, styles.rejectText]}>
                        {t('userSearch.reject')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

                {status === 'pending' && rel?.sender_id === user.id && (
                  <Text style={styles.pendingText}>
                    {t('userSearch.pending')}
                  </Text>
                )}

                {status === 'accepted' && (
                  <Text style={styles.friendText}>
                    {t('userSearch.friend')}
                  </Text>
                )}
              </View>

              {status === 'none' && (
                <TouchableOpacity
                  onPress={() => sendRequest(item.id)}
                  style={styles.addBtn}
                >
                  <Text style={[styles.actionText, styles.addText]}>
                    {t('userSearch.add')}
                  </Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#013220' },
  emptyContainer: { padding: 20 },
  emptyText: { color: '#ccc', fontStyle: 'italic' },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2c3e50',
  },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  userInfo: { flex: 1 },
  username: { color: 'white', fontSize: 16 },
  actionRow: { flexDirection: 'row' },
  actionBtn: { marginRight: 12 },
  actionText: { fontWeight: 'bold' },
  acceptText: { color: '#2ecc71' },
  rejectText: { color: '#e74c3c' },
  pendingText: { color: '#aaa' },
  friendText: { color: '#aaa' },
  addBtn: {},
  addText: { color: '#2ecc71' },
});
