import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import SearchBar from '../../components/Search/SearchBar';
import styles from './UserSearchScreen.styles';

export const TopBar = ({ navigation, user, t }: any) => (
  <View style={styles.topBar}>
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <Ionicons name="arrow-back" size={24} color="white" />
    </TouchableOpacity>

    <Text style={styles.title}>{t('userSearch.title')}</Text>

    <TouchableOpacity
      onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
    >
      <Image
        source={{
          uri:
            user?.user_metadata?.avatar_url || 'https://via.placeholder.com/40',
        }}
        style={styles.avatar}
      />
    </TouchableOpacity>
  </View>
);

export const SearchHeader = ({ value, onChangeText, t }: any) => (
  <SearchBar
    value={value}
    onChangeText={onChangeText}
    placeholder={t('userSearch.searchPlaceholder')}
  />
);

export const EmptyList = ({ t }: any) => (
  <View style={styles.emptyContainer}>
    <Text style={styles.emptyText}>{t('userSearch.noUsers')}</Text>
  </View>
);

export const UserRow = ({
  item,
  user,
  t,
  navigation,
  getFriendStatus,
  getFriendRelation,
  acceptFriend,
  rejectFriend,
  sendRequest,
}: any) => {
  const status = getFriendStatus(item.id);
  const rel = getFriendRelation(item.id);
  const name = item.display_name || item.email;

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('Home', {
          screen: 'UserProfile',
          params: { user: item },
        })
      }
      style={styles.userRow}
    >
      <Image
        source={{ uri: item.avatar_url || 'https://via.placeholder.com/40' }}
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
          <Text style={styles.pendingText}>{t('userSearch.pending')}</Text>
        )}

        {status === 'accepted' && (
          <Text style={styles.friendText}>{t('userSearch.friend')}</Text>
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
};
