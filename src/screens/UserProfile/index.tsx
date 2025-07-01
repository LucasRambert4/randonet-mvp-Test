import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Polyline } from 'react-native-maps';
import useUserProfileLogic from './UserProfileScreen.logic';
import styles from './UserProfileScreen.styles';

export default function UserProfileScreen() {
  const { user, navigation, t, activities, loading, handleActivityPress } =
    useUserProfileLogic();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>{user.name}</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.header}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <Text style={styles.name}>{user.name}</Text>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#fff"
          style={{ marginTop: 20 }}
        />
      ) : (
        <FlatList
          data={activities}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleActivityPress(item)}>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>{item.title || item.name}</Text>
                <Text style={styles.cardMeta}>
                  {item.date} • {item.distance} • {item.duration}
                </Text>
                {item.path?.length > 1 && (
                  <MapView
                    style={styles.map}
                    scrollEnabled={false}
                    zoomEnabled={false}
                    pitchEnabled={false}
                    rotateEnabled={false}
                    initialRegion={{
                      latitude: item.path[0].latitude,
                      longitude: item.path[0].longitude,
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.01,
                    }}
                  >
                    <Polyline
                      coordinates={item.path}
                      strokeColor="#02c95c"
                      strokeWidth={3}
                    />
                  </MapView>
                )}
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
}
