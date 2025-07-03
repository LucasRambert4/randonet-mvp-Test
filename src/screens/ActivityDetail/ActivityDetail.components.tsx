import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons, Feather, Entypo } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import styles from './ActivityDetailScreen.styles';

// Helper to get avatar URL with fallback
const getAvatarUrl = (user: any) => {
  const url = user?.user_metadata?.avatar_url || user?.avatar_url;
  return url || 'https://via.placeholder.com/40';
};

export const TopBar = ({ navigation, user, title }: any) => (
  <View style={styles.topBar}>
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <Ionicons name="arrow-back" size={24} color="white" />
    </TouchableOpacity>
    <Text style={styles.title}>{title}</Text>
    <TouchableOpacity
      onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
    >
      <Image
        source={{
          uri:
            user?.user_metadata?.avatar_url || 'https://via.placeholder.com/40',
        }}
        style={styles.avatar}
      />
    </TouchableOpacity>
  </View>
);

export const HeaderRow = ({
  ownerInfo,
  activityData,
  loc,
  shareActivity,
  toggleSave,
  isSaved,
  isOwner,
  navigation,
  confirmDelete,
  routePath,
}: any) => (
  <View style={styles.headerRow}>
    <View style={styles.userInfo}>
      <Image
        source={{ uri: getAvatarUrl(ownerInfo) }}
        style={styles.avatarSmall}
      />
      <View>
        <Text style={styles.username}>{ownerInfo.display_name}</Text>
        <Text style={styles.meta}>
          {new Date(activityData.start_time).toLocaleDateString(loc)} •{' '}
          {activityData.location}
        </Text>
      </View>
    </View>
    <View style={styles.iconRow}>
      <TouchableOpacity onPress={shareActivity}>
        <Feather name="share-2" size={22} color="white" />
      </TouchableOpacity>
      <TouchableOpacity onPress={toggleSave}>
        <Ionicons
          name={isSaved ? 'bookmark' : 'bookmark-outline'}
          size={22}
          color={isSaved ? '#00ffcc' : 'white'}
        />
      </TouchableOpacity>
      {isOwner && (
        <>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Record', {
                screen: 'SaveActivity',
                params: {
                  activityId: activityData.id,
                  title: activityData.title,
                  description: activityData.description,
                  rating: activityData.rating,
                  type: activityData.type,
                  difficulty: activityData.difficulty,
                  startTime: new Date(activityData.start_time).getTime(),
                  endTime: new Date(activityData.end_time).getTime(),
                  distance: activityData.distance_meters,
                  location: activityData.location,
                  elevation: activityData.elevation,
                },
              })
            }
          >
            <Feather name="edit" size={22} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={confirmDelete}>
            <Entypo name="trash" size={22} color="red" />
          </TouchableOpacity>
        </>
      )}
    </View>
  </View>
);

export const StatsGrid = ({ t, activityData }: any) => (
  <View style={styles.statsGrid}>
    <View style={styles.statBox}>
      <Text style={styles.label}>{t('activityDetail.title')}</Text>
      <Text style={styles.value}>{activityData.title}</Text>
    </View>

    <View style={styles.statBox}>
      <Text style={styles.label}>{t('activityDetail.distance')}</Text>
      <Text style={styles.value}>
        {(activityData.distance_meters / 1000).toFixed(1)} km
      </Text>
    </View>
    <View style={styles.statBox}>
      <Text style={styles.label}>{t('activityDetail.duration')}</Text>
      <Text style={styles.value}>
        {activityData.duration_seconds < 60
          ? `${activityData.duration_seconds} ${t('common.seconds')}`
          : `${Math.round(activityData.duration_seconds / 60)} ${t(
              'common.minutes'
            )}`}
      </Text>
    </View>

    <View style={styles.statBox}>
      <Text style={styles.label}>{t('activityDetail.elevation')}</Text>
      <Text style={styles.value}>{activityData.elevation || 0} m</Text>
    </View>
    <View style={styles.statBox}>
      <Text style={styles.label}>{t('activityDetail.difficulty')}</Text>
      <Text style={styles.value}>{activityData.difficulty}</Text>
    </View>

    <View style={styles.statBox}>
      <Text style={styles.label}>{t('activityDetail.type')}</Text>
      <Text style={styles.value}>{activityData.type}</Text>
    </View>
    <View style={styles.statBox}>
      <Text style={styles.label}>{t('activityDetail.rating')}</Text>
      <View style={{ flexDirection: 'row' }}>
        {Array.from({ length: 3 }).map((_, i) => (
          <Ionicons
            key={i}
            name={i < activityData.rating ? 'star' : 'star-outline'}
            size={18}
            color="gold"
          />
        ))}
      </View>
    </View>
  </View>
);

export const DescriptionBox = ({ t, description }: any) =>
  description ? (
    <View style={{ marginTop: 20 }}>
      <Text style={styles.label}>{t('activityDetail.description')}</Text>
      <Text style={[styles.value, { marginTop: 4 }]}>{description}</Text>
    </View>
  ) : null;
