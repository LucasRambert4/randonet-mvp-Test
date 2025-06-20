import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import SearchBar from '../../components/Search/SearchBar';
import { useAuth } from '../../context/AuthContext';
import styles from './UserSearchScreen.styles';

const dummyUsers = [
  { id: '1', name: 'Alice', avatar: 'https://via.placeholder.com/40' },
  { id: '2', name: 'Bob', avatar: 'https://via.placeholder.com/40' },
  { id: '3', name: 'Charlie', avatar: 'https://via.placeholder.com/40' },
];

export default function UserSearchScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [requests, setRequests] = useState<Record<string, 'none' | 'sent' | 'friend'>>({});

  const filtered = dummyUsers.filter((u) =>
    u.name.toLowerCase().includes(query.toLowerCase())
  );

  const sendRequest = (id: string) => {
    setRequests((prev) => ({ ...prev, [id]: 'sent' }));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Ajouter des amis</Text>
        <Image
          source={{ uri: user?.photoURL || 'https://via.placeholder.com/40' }}
          style={styles.avatar}
        />
      </View>
      <SearchBar value={query} onChangeText={setQuery} />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const status = requests[item.id] || 'none';
          return (
            <View style={styles.item}>
              <TouchableOpacity
                style={styles.itemInfo}
                onPress={() => navigation.navigate('UserProfile' as never, { user: item } as never)}
              >
                <Image source={{ uri: item.avatar }} style={styles.itemAvatar} />
                <Text style={styles.itemName}>{item.name}</Text>
              </TouchableOpacity>
              {status === 'friend' ? (
                <Text style={styles.friendText}>Amis</Text>
              ) : status === 'sent' ? (
                <Text style={styles.requestedText}>Envoyé</Text>
              ) : (
                <TouchableOpacity onPress={() => sendRequest(item.id)}>
                  <Ionicons name="person-add" size={20} color="white" />
                </TouchableOpacity>
              )}
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}
