import React, { useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, Image, Animated } from 'react-native';
import MapView, { Polyline } from 'react-native-maps';
import { Trail } from '../../services/trailsService';
import styles from './ExploreScreen.styles';

export function TrailCard({
  item,
  index,
  navigation,
  t,
}: {
  item: Trail;
  index: number;
  navigation: any;
  t: any;
}) {
  const fadeAnim = useMemo(() => new Animated.Value(0), []);
  const translateY = useMemo(() => new Animated.Value(20), []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      delay: index * 100,
      useNativeDriver: true,
    }).start();

    Animated.timing(translateY, {
      toValue: 0,
      duration: 400,
      delay: index * 100,
      useNativeDriver: true,
    }).start();
  }, []);

  const detailText = `${item.distance.toFixed(1)} km · ${
    item.estimatedDuration
  } min · ${item.difficulty}`;

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY }] }}>
      <View style={styles.card}>
        <Text style={styles.name}>{item.name}</Text>
        {item.summary && <Text style={styles.summary}>{item.summary}</Text>}
        <Text style={styles.detail}>{detailText}</Text>

        {item.nodes.length > 1 ? (
          <MapView
            style={styles.mapPreview}
            scrollEnabled={false}
            zoomEnabled={false}
            pitchEnabled={false}
            rotateEnabled={false}
            initialRegion={{
              latitude: item.nodes[0].lat,
              longitude: item.nodes[0].lon,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            }}
          >
            <Polyline
              coordinates={item.nodes.map((n) => ({
                latitude: n.lat,
                longitude: n.lon,
              }))}
              strokeColor="#02c95c"
              strokeWidth={3}
            />
          </MapView>
        ) : (
          <Image
            source={require('../../../assets/map-placeholder.png')}
            style={styles.mapPreview}
            resizeMode="cover"
          />
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('TrailDetails', { trail: item })}
        >
          <Text style={styles.buttonText}>{t('explore.viewDetails')}</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}
