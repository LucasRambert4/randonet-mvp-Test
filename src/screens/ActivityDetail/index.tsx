import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  View,
} from 'react-native';
import MapView, { Polyline } from 'react-native-maps';

import styles from './ActivityDetailScreen.styles';
import { useActivityDetail } from './ActivityDetail.logic';

import {
  TopBar,
  HeaderRow,
  StatsGrid,
  DescriptionBox,
} from './ActivityDetail.components';

export default function ActivityDetailScreen() {
  const {
    t,
    loc,
    navigation,
    loading,
    activityData,
    ownerInfo,
    routePath,
    isOwner,
    shareActivity,
    toggleSave,
    isSaved,
    confirmDelete,
    avatarUrl,
    ownerAvatarUrl,
  } = useActivityDetail();

  if (loading || !activityData || !ownerInfo) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator
          size="large"
          color="#fff"
          style={{ marginTop: 40 }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <TopBar
        title={t('activityDetail.title')}
        avatarUrl={avatarUrl}
        navigation={navigation}
      />

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <MapView
          style={styles.map}
          showsUserLocation={false}
          initialRegion={
            routePath.length
              ? {
                  latitude: routePath[0].latitude,
                  longitude: routePath[0].longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }
              : undefined
          }
        >
          {routePath.length > 1 && (
            <Polyline
              coordinates={routePath}
              strokeColor="#00f"
              strokeWidth={3}
            />
          )}
        </MapView>

        <View style={styles.contentBox}>
          <HeaderRow
            ownerInfo={ownerInfo}
            ownerAvatarUrl={ownerAvatarUrl}
            activityData={activityData}
            loc={loc}
            shareActivity={shareActivity}
            toggleSave={toggleSave}
            isSaved={isSaved}
            isOwner={isOwner}
            navigation={navigation}
            confirmDelete={confirmDelete}
            routePath={routePath}
          />

          <StatsGrid t={t} activityData={activityData} />
          <DescriptionBox t={t} description={activityData.description} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
