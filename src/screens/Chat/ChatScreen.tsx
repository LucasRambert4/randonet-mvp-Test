import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import SearchBar from '../../components/Search/SearchBar';

const dummyMessages = [
  {
    id: '1',
    name: 'Summit Seekers',
    lastMessage:
      'John: Attention, secteur pierreux après le virage en épingle...',
    time: '12:48 AM',
  },
];

export default function ChatScreen() {
  const [tab, setTab] = useState<'Chats' | 'Groups'>('Chats');
  const [search, setSearch] = useState('');
  const navigation = useNavigation();
  const { user } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Text style={styles.title}>Communauté</Text>
        <View style={styles.rightIcons}>
          <TouchableOpacity
            onPress={() => navigation.navigate('UserSearch' as never)}
          >
            <Ionicons name="search" size={22} color="white" />
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

      {/* Search */}
      <SearchBar value={search} onChangeText={setSearch} />

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          onPress={() => setTab('Chats')}
          style={styles.tabItem}
        >
          <Text style={[styles.tabText, tab === 'Chats' && styles.activeTab]}>
            Chats
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setTab('Groups')}
          style={styles.tabItem}
        >
          <Text style={[styles.tabText, tab === 'Groups' && styles.activeTab]}>
            Groups
          </Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={dummyMessages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.chatItem}>
            <Image
              source={{ uri: 'https://via.placeholder.com/50' }}
              style={styles.chatAvatar}
            />
            <View style={styles.chatContent}>
              <View style={styles.chatHeader}>
                <Text style={styles.chatName}>{item.name}</Text>
                <Text style={styles.chatTime}>{item.time}</Text>
              </View>
              <Text numberOfLines={1} style={styles.chatPreview}>
                {item.lastMessage}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

import styles from './ChatScreen.styles';
