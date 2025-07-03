import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import MapView, { Polyline } from 'react-native-maps';
import { Ionicons, Feather } from '@expo/vector-icons';
import styles from './SharedActivityScreen.styles';

export default function ActivityCard({
  item,
  user,
  saved,
  onPress,
  toggleSave,
  shareActivity,
  t,
}: any) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Image
            source={{
              uri:
                item.user_id === user.id
                  ? user?.user_metadata?.avatar_url ||
                    'https://via.placeholder.com/40'
                  : item.avatar_url || 'https://via.placeholder.com/30',
            }}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.username}>{item.username}</Text>
            <Text style={styles.activityTitle}>{item.title}</Text>
            <Text style={styles.meta}>
              {item.date}, {item.location || t('shared.unknown')}
            </Text>
            <Text style={styles.meta}>
              {t('shared.labelActivity')}: {item.type} •{' '}
              {t('shared.labelDifficulty')}: {item.difficulty}
            </Text>
            <Text style={styles.meta}>
              {item.distance} • {item.duration}
            </Text>
          </View>
        </View>

        {item.path?.length > 1 ? (
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
              strokeColor="#00f"
              strokeWidth={3}
            />
          </MapView>
        ) : (
          <Image
            source={require('../../../assets/map-placeholder.png')}
            style={styles.map}
            resizeMode="cover"
          />
        )}

        <View style={styles.actions}>
          <TouchableOpacity onPress={() => toggleSave(item.id)}>
            <Ionicons
              name={saved.includes(item.id) ? 'bookmark' : 'bookmark-outline'}
              size={24}
              color="white"
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={shareActivity}>
            <Feather name="share-2" size={22} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}
