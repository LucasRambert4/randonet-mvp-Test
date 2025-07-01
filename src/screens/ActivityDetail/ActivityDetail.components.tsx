import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons, Feather, Entypo } from '@expo/vector-icons';
import styles from './ActivityDetailScreen.styles';

export const TopBar = ({ navigation, ownerInfo, title }: any) => (
  <View style={styles.topBar}>
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <Ionicons name="arrow-back" size={24} color="white" />
    </TouchableOpacity>
    <Text style={styles.title}>{title}</Text>
    <Image
      source={{ uri: ownerInfo.avatar_url || 'https://via.placeholder.com/40' }}
      style={styles.avatar}
    />
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
        source={{
          uri: ownerInfo.avatar_url || 'https://via.placeholder.com/40',
        }}
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
                  route: routePath,
                  distance: activityData.distance_meters,
                  startTime: new Date(activityData.start_time),
                  endTime: new Date(activityData.end_time),
                  elevation: activityData.elevation,
                  location: activityData.location,
                  activityId: activityData.id,
                  existingData: activityData,
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
      <Text style={styles.label}>{t('activityDetail.distance')}</Text>
      <Text style={styles.value}>
        {(activityData.distance_meters / 1000).toFixed(1)} km
      </Text>
    </View>
    <View style={styles.statBox}>
      <Text style={styles.label}>{t('activityDetail.duration')}</Text>
      <Text style={styles.value}>
        {Math.round(activityData.duration_seconds / 60)} {t('common.minutes')}
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
