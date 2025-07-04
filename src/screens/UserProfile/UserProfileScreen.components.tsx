import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Polyline } from 'react-native-maps';
import styles from './UserProfileScreen.styles';

export const ActivityCard = ({
  item,
  profile,
  t,
  onPress,
  onShare,
}: {
  item: any;
  profile: { name: string; avatar: string } | null;
  t: any;
  onPress: () => void;
  onShare: () => void;
}) => (
  <TouchableOpacity onPress={onPress}>
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Image
          source={{
            uri: profile?.avatar || 'https://via.placeholder.com/40',
          }}
          style={styles.avatarSmall}
        />
        <View>
          <Text style={styles.username}>{profile?.name}</Text>
          <Text style={styles.meta}>
            {item.date} • {item.location || t('shared.unknown')}
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
            strokeColor="#02c95c"
            strokeWidth={3}
          />
        </MapView>
      ) : null}

      <View style={styles.actions}>
        <TouchableOpacity onPress={onShare}>
          <Ionicons name="share-social" size={22} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  </TouchableOpacity>
);
