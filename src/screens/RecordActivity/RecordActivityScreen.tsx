import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Dimensions,
  StyleSheet,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import MapView, { PROVIDER_GOOGLE, Polyline, Marker } from 'react-native-maps';
import haversine from 'haversine';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/index';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

const { height } = Dimensions.get('window');
const TAB_BAR_HEIGHT = 60; // adjust to your actual tab-bar height

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'SaveActivity'
>;

export default function RecordActivityScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();

  const [recording, setRecording] = useState(false);
  const [paused, setPaused] = useState(false);
  const [route, setRoute] = useState<Location.LocationObjectCoords[]>([]);
  const [location, setLocation] =
    useState<Location.LocationObjectCoords | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [distance, setDistance] = useState(0);
  const [elevation, setElevation] = useState(0);
  const [placeName, setPlaceName] = useState('');
  const [duration, setDuration] = useState(0);

  const watchId = useRef<Location.LocationSubscription | null>(null);
  const prevAltitude = useRef<number | null>(null);
  const mapRef = useRef<MapView | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          t('record.permissionNeeded'),
          t('record.permissionRequired')
        );
      } else {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation(loc.coords);
        mapRef.current?.animateToRegion({
          ...loc.coords,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001,
        });
        const placemarks = await Location.reverseGeocodeAsync(loc.coords);
        if (placemarks.length > 0) {
          setPlaceName(
            `${placemarks[0].city || ''}, ${placemarks[0].country || ''}`
          );
        }
      }
    })();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (recording && !paused && startTime) {
      intervalRef.current = setInterval(() => {
        setDuration(Math.floor((Date.now() - startTime.getTime()) / 1000));
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [recording, paused, startTime]);

  const startRecording = async () => {
    setRecording(true);
    setPaused(false);
    setRoute([]);
    setDistance(0);
    setElevation(0);
    setDuration(0);
    setStartTime(new Date());
    watchId.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Highest,
        timeInterval: 1000,
        distanceInterval: 5,
      },
      (loc) => {
        if (!paused) {
          const coords = loc.coords;
          setLocation(coords);
          if (
            prevAltitude.current !== null &&
            coords.altitude > prevAltitude.current + 3
          ) {
            setElevation((e) => e + (coords.altitude - prevAltitude.current));
          }
          prevAltitude.current = coords.altitude;
          setRoute((prev) => {
            const newRoute = [...prev, coords];
            if (newRoute.length >= 2) {
              const last = newRoute[newRoute.length - 2];
              const current = newRoute[newRoute.length - 1];
              setDistance(
                (d) => d + haversine(last, current, { unit: 'meter' })
              );
            }
            return newRoute;
          });
          mapRef.current?.animateToRegion({
            ...coords,
            latitudeDelta: 0.001,
            longitudeDelta: 0.001,
          });
        }
      }
    );
  };

  const pauseOrResume = () => setPaused((p) => !p);

  const stopRecording = () => {
    if (watchId.current) watchId.current.remove();
    if (intervalRef.current) clearInterval(intervalRef.current);
    const finalEndTime = new Date();
    setRecording(false);
    setPaused(false);
    setDuration(
      Math.floor(
        (finalEndTime.getTime() -
          (startTime?.getTime() || finalEndTime.getTime())) /
          1000
      )
    );
    navigation.navigate('SaveActivity', {
      route,
      distance,
      startTime,
      endTime: finalEndTime,
      elevation,
      location: placeName,
    });
  };

  const dismissActivity = () => {
    if (watchId.current) watchId.current.remove();
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRecording(false);
    setPaused(false);
    setRoute([]);
    setDistance(0);
    setDuration(0);
    setStartTime(null);
    setElevation(0);
    setPlaceName('');
  };

  const centerMap = () => {
    if (location) {
      mapRef.current?.animateToRegion({
        ...location,
        latitudeDelta: 0.001,
        longitudeDelta: 0.001,
      });
    }
  };

  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const speed = duration > 0 ? distance / duration : 0;

  return (
    <SafeAreaView
      style={[
        styles.container,
        { paddingBottom: insets.bottom + TAB_BAR_HEIGHT },
      ]}
      edges={['top']}
    >
      <MapView
        provider={PROVIDER_GOOGLE}
        ref={(ref) => (mapRef.current = ref)}
        style={styles.map}
        showsUserLocation
        followsUserLocation
      >
        {route.length > 0 && (
          <>
            <Polyline coordinates={route} strokeWidth={4} strokeColor="#00f" />
            <Marker coordinate={route[0]} title={t('record.markerStart')} />
            <Marker
              coordinate={route[route.length - 1]}
              title={t('record.markerCurrent')}
            />
          </>
        )}
      </MapView>

      <TouchableOpacity
        style={[
          styles.focusButton,
          { bottom: height * 0.34 + insets.bottom + 16 },
        ]}
        onPress={centerMap}
      >
        <Text style={styles.focusButtonText}>🎯</Text>
      </TouchableOpacity>

      <View style={styles.infoPanel}>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.label}>{t('record.labelDistance')}</Text>
            <Text style={styles.value}>{Math.round(distance)} m</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.label}>{t('record.labelDuration')}</Text>
            <Text style={styles.value}>{formatDuration(duration)}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.label}>{t('record.labelSpeed')}</Text>
            <Text style={styles.value}>{speed.toFixed(1)} m/s</Text>
          </View>
        </View>

        <View style={styles.buttonGrid}>
          <TouchableOpacity
            style={styles.buttonGreen}
            onPress={recording ? pauseOrResume : startRecording}
          >
            <Text style={styles.buttonText}>
              {recording
                ? paused
                  ? t('record.resume')
                  : t('record.pause')
                : t('record.start')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonRed} onPress={stopRecording}>
            <Text style={styles.buttonText}>{t('record.end')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonGray} onPress={dismissActivity}>
            <Text style={styles.buttonText}>{t('record.dismiss')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d3a27',
  },
  map: {
    width: '100%',
    height: height * 0.66,
  },
  infoPanel: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: '#09341f',
    justifyContent: 'space-between',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  infoItem: {
    alignItems: 'center',
  },
  label: {
    color: '#aaa',
    fontSize: 14,
  },
  value: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  buttonGreen: {
    backgroundColor: '#2ecc71',
    width: '48%',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonRed: {
    backgroundColor: '#e74c3c',
    width: '48%',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonGray: {
    backgroundColor: '#7f8c8d',
    width: '48%',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  focusButton: {
    position: 'absolute',
    right: 24,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 24,
    zIndex: 10,
  },
  focusButtonText: {
    fontSize: 20,
  },
});
