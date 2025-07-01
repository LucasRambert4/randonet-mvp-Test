import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SearchBar from '../../components/Search';
import { DrawerActions } from '@react-navigation/native';
import styles from './ChatScreen.styles';

export default function ConversationList({
  navigation,
  topPadding,
  search,
  setSearch,
  tab,
  setTab,
  conversations,
  setSelectedConversation,
  getOtherUserName,
  t,
  user,
}: any) {
  return (
    <ScrollView
      style={[styles.container, { paddingTop: topPadding }]}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.topBar}>
        <Text style={styles.title}>{t('chatList.title')}</Text>
        <View style={styles.rightIcons}>
          <TouchableOpacity
            onPress={() => navigation.navigate('UserSearch')}
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
          <Text style={[styles.tabText, tab === 'Groups' && styles.activeTab]}>
            {t('chatList.tabGroups')}
          </Text>
        </TouchableOpacity>
      </View>

      {conversations.map((item: any) => (
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
