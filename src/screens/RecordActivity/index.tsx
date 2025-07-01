import React from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Polyline, Marker } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useRecordActivityLogic from './RecordActivityScreen.logic';
import styles, { height, TAB_BAR_HEIGHT } from './RecordActivityScreen.styles';

export default function RecordActivityScreen() {
  const {
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
  } = useRecordActivityLogic();

  const insets = useSafeAreaInsets();

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
        ref={mapRef}
        style={styles.map}
        showsUserLocation
        followsUserLocation
      >
        {trail?.nodes?.length > 1 && (
          <Polyline
            coordinates={trail.nodes.map((n) => ({
              latitude: n.lat,
              longitude: n.lon,
            }))}
            strokeWidth={4}
            strokeColor="#02c95c"
          />
        )}

        {location && closestTrailPoint && (
          <Polyline
            coordinates={[
              { latitude: location.latitude, longitude: location.longitude },
              closestTrailPoint,
            ]}
            strokeWidth={2}
            strokeColor="#f39c12"
            lineDashPattern={[5, 5]}
          />
        )}

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
