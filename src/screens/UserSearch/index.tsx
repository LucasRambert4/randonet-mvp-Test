import React from 'react';
import { SafeAreaView, FlatList } from 'react-native';
import { useUserSearchScreen } from './UserSearchScreen.logic';
import {
  TopBar,
  SearchHeader,
  UserRow,
  EmptyList,
} from './UserSearchScreen.components';
import styles from './UserSearchScreen.styles';

export default function UserSearchScreen() {
  const {
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
  } = useUserSearchScreen();

  return (
    <SafeAreaView style={styles.container}>
      <TopBar navigation={navigation} user={user} t={t} />

      <SearchHeader value={query} onChangeText={setQuery} t={t} />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<EmptyList t={t} />}
        renderItem={({ item }) => (
          <UserRow
            item={item}
            user={user}
            t={t}
            navigation={navigation}
            getFriendStatus={getFriendStatus}
            getFriendRelation={getFriendRelation}
            acceptFriend={acceptFriend}
            rejectFriend={rejectFriend}
            sendRequest={sendRequest}
          />
        )}
      />
    </SafeAreaView>
  );
}
