import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import SearchBar from '../../components/Search/SearchBar';

const dummySavedRoutes = [
  {
    id: '1',
    name: 'Vallée Fleurie',
    location: 'Grenoble',
    date: '2024-06-01',
    distance: '10 km',
    elevation: '500 m',
    duration: '4h',
    difficulty: 'Normal',
    type: 'hiking',
    rating: 3,
  },
];

export default function SavedScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [tab, setTab] = useState<'Completed' | 'Saved'>('Saved'); // ← Default to SAVED
  const [search, setSearch] = useState('');

  const filteredRoutes = dummySavedRoutes.filter((route) =>
    route.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderActivityIcon = (type: string) => {
    switch (type) {
      case 'hiking':
        return <FontAwesome5 name="hiking" size={20} color="white" />;
      case 'running':
        return <FontAwesome5 name="running" size={20} color="white" />;
      case 'biking':
        return <FontAwesome5 name="bicycle" size={20} color="white" />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Text style={styles.title}>Mes Itinéraires</Text>
        <View style={styles.rightIcons}>
          <TouchableOpacity>
            <Ionicons name="search" size={22} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          >
            <Image
              source={{
                uri: user?.photoURL || 'https://via.placeholder.com/40',
              }}
              style={styles.avatar}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <SearchBar value={search} onChangeText={setSearch} />

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity onPress={() => setTab('Completed')}>
          <Text
            style={[styles.tabText, tab === 'Completed' && styles.activeTab]}
          >
            Completed
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setTab('Saved')}>
          <Text style={[styles.tabText, tab === 'Saved' && styles.activeTab]}>
            Saved
          </Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={filteredRoutes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <View style={styles.left}>
                <Text style={styles.metaText}>
                  {item.name} • {item.location}
                </Text>
                <Text style={styles.metaText}>
                  {item.date} • {item.distance} • {item.duration}
                </Text>
                <Text style={styles.metaText}>Élévation: {item.elevation}</Text>
                <Text style={styles.metaText}>
                  Difficulty: {item.difficulty}
                </Text>
                <View style={styles.rating}>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Ionicons
                      key={i}
                      name={i < item.rating ? 'star' : 'star-outline'}
                      size={18}
                      color="white"
                    />
                  ))}
                </View>
              </View>
              <View style={styles.right}>{renderActivityIcon(item.type)}</View>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

import styles from './SavedScreen.styles';
