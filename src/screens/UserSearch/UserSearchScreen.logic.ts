import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../../supabase-config';
import { useTranslation } from 'react-i18next';
import { ChatStackParamList } from '../../navigation/types';

export const useUserSearchScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<ChatStackParamList>>();
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
    await supabase
      .from('friendships')
      .insert([
        { sender_id: user.id, receiver_id: targetId, status: 'pending' },
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

  return {
    t,
    user,
    navigation,
    query,
    setQuery,
    filtered,
    getFriendStatus,
    getFriendRelation,
    acceptFriend,
    rejectFriend,
    sendRequest,
  };
};
