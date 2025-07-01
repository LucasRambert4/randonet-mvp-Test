import { useState, useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import * as Location from 'expo-location';
import haversine from 'haversine';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation';
import { useTranslation } from 'react-i18next';
import { Trail } from '../../services/trailsService';

export default function useRecordActivityLogic() {
  const { t } = useTranslation();
  const navigation =
    useNavigation<
      NativeStackNavigationProp<RootStackParamList, 'SaveActivity'>
    >();
  const routeParams = useRoute() as { params: { trail?: Trail } };
  const { trail } = routeParams.params || {};

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

  const [closestTrailPoint, setClosestTrailPoint] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const watchId = useRef<Location.LocationSubscription | null>(null);
  const prevAltitude = useRef<number | null>(null);
  const mapRef = useRef<any>(null);
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
        if (trail?.nodes?.length) {
          const first = trail.nodes[0];
          mapRef.current?.animateToRegion({
            latitude: first.lat,
            longitude: first.lon,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
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
      }
    })();
    return () => intervalRef.current && clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    if (recording && !paused && startTime) {
      intervalRef.current = setInterval(() => {
        setDuration(Math.floor((Date.now() - startTime.getTime()) / 1000));
      }, 1000);
    } else {
      intervalRef.current && clearInterval(intervalRef.current);
    }
    return () => intervalRef.current && clearInterval(intervalRef.current);
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

          if (trail?.nodes?.length) {
            let minDist = Infinity;
            let nearestNode = trail.nodes[0];
            trail.nodes.forEach((node) => {
              const dist = haversine(
                { latitude: coords.latitude, longitude: coords.longitude },
                { latitude: node.lat, longitude: node.lon },
                { unit: 'meter' }
              );
              if (dist < minDist) {
                minDist = dist;
                nearestNode = node;
              }
            });
            setClosestTrailPoint({
              latitude: nearestNode.lat,
              longitude: nearestNode.lon,
            });
          }

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
    watchId.current && watchId.current.remove();
    intervalRef.current && clearInterval(intervalRef.current);
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
      trailId: trail?.id || null,
    });
  };

  const dismissActivity = () => {
    watchId.current && watchId.current.remove();
    intervalRef.current && clearInterval(intervalRef.current);
    setRecording(false);
    setPaused(false);
    setRoute([]);
    setDistance(0);
    setDuration(0);
    setStartTime(null);
    setElevation(0);
    setPlaceName('');
    setClosestTrailPoint(null);
    navigation.reset({
      index: 0,
      routes: [{ name: 'RecordMain', params: {} }],
    });
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

  return {
    t,
    trail,
    mapRef,
    route,
    location,
    closestTrailPoint,
    centerMap,
    startRecording,
    pauseOrResume,
    stopRecording,
    dismissActivity,
    recording,
    paused,
    distance,
    duration,
    speed,
    formatDuration,
  };
}
