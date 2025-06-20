import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

const dummyActivities = [
  {
    id: '1',
    username: 'Username',
    date: '22/05/2025',
    location: 'Paris, Île-de-France',
    type: 'Hike',
    difficulty: 'Easy',
    distance: '121.3 km',
    elevation: '1263m',
    duration: '~7 day',
  },
  {
    id: '2',
    username: 'AnotherUser',
    date: '18/05/2025',
    location: 'Lyon, Rhône-Alpes',
    type: 'Run',
    difficulty: 'Moderate',
    distance: '25 km',
    elevation: '400m',
    duration: '3h',
  },
  {
    id: '3',
    username: 'Explorer',
    date: '10/05/2025',
    location: "Nice, Côte d'Azur",
    type: 'Trek',
    difficulty: 'Hard',
    distance: '60 km',
    elevation: '2000m',
    duration: '2 days',
  },
];

export default function HomeScreen() {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [liked, setLiked] = useState<string[]>([]);
  const [saved, setSaved] = useState<string[]>([]);

  const openDetail = (activityId: string) => {
    navigation.navigate('ActivityDetail', { id: activityId });
  };

  const toggleLike = (id: string) => {
    setLiked((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSave = (id: string) => {
    setSaved((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const shareActivity = async (item: (typeof dummyActivities)[0]) => {
    try {
      await Share.share({
        message: `Check out this activity from ${item.username} in ${item.location} (${item.distance}, ${item.duration})`,
      });
    } catch (error) {
      console.error('Erreur de partage :', error);
    }
  };

  const renderItem = ({ item }: { item: (typeof dummyActivities)[0] }) => (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image
          source={{ uri: user?.photoURL || 'https://via.placeholder.com/30' }}
          style={styles.avatar}
        />
        <View>
          <Text style={styles.username}>{item.username}</Text>
          <Text style={styles.meta}>
            {item.date}, {item.location}
          </Text>
          <Text style={styles.meta}>
            Activité: {item.type} • Difficulté: {item.difficulty}
          </Text>
          <Text style={styles.meta}>
            {item.distance} • {item.elevation} • {item.duration}
          </Text>
        </View>
      </View>

      <TouchableOpacity onPress={() => openDetail(item.id)}>
        <Image
          source={require('../../../assets/map-placeholder.png')}
          style={styles.map}
          resizeMode="cover"
        />
      </TouchableOpacity>

      <View style={styles.actions}>
        <TouchableOpacity onPress={() => toggleLike(item.id)}>
          <Ionicons
            name={liked.includes(item.id) ? 'heart' : 'heart-outline'}
            size={24}
            color={liked.includes(item.id) ? 'red' : 'white'}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => toggleSave(item.id)}>
          <Ionicons
            name={saved.includes(item.id) ? 'bookmark' : 'bookmark-outline'}
            size={24}
            color="white"
          />
        </TouchableOpacity>

        <TouchableOpacity>
          <Ionicons name="chatbubble-outline" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => shareActivity(item)}>
          <Feather name="share-2" size={22} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.topBar}>
        <Text style={styles.title}>Accueil</Text>
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

      <FlatList
        data={dummyActivities}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </SafeAreaView>
  );
}

import styles from './HomeScreen.styles';
