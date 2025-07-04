import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import MapView, { Polyline } from 'react-native-maps';
import useTrailDetailsLogic from './TrailDetailsScreen.logic';
import styles from './TrailDetailsScreen.styles';

function TopBar({ navigation, user, title, onShare }: any) {
  return (
    <View style={styles.topBar}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      <Text style={styles.title}>{title}</Text>

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={onShare} style={{ marginRight: 12 }}>
          <Feather name="share-2" size={22} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        >
          <Image
            source={{
              uri:
                user?.user_metadata?.avatar_url ||
                user?.avatar_url ||
                'https://via.placeholder.com/40',
            }}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function TrailDetailsScreen() {
  const {
    t,
    navigation,
    trail,
    loading,
    shareTrail,
    toggleSave,
    isSaved,
    startActivity,
    firstNode,
    user,
  } = useTrailDetailsLogic();

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator
          size="large"
          color="#02c95c"
          style={{ marginTop: 40 }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <TopBar
        navigation={navigation}
        user={user}
        title={trail.name}
        onShare={shareTrail}
      />

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <MapView
          style={styles.map}
          showsUserLocation={false}
          initialRegion={{
            latitude: firstNode.lat,
            longitude: firstNode.lon,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          {trail.nodes?.length > 1 && (
            <Polyline
              coordinates={trail.nodes.map((n) => ({
                latitude: n.lat,
                longitude: n.lon,
              }))}
              strokeColor="#02c95c"
              strokeWidth={4}
            />
          )}
        </MapView>

        <View style={styles.contentBox}>
          <Text style={styles.summary}>{trail.summary || '-'}</Text>

          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.label}>{t('trailDetail.distance')}</Text>
              <Text style={styles.value}>{trail.distance || '-'} km</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.label}>{t('trailDetail.duration')}</Text>
              <Text style={styles.value}>
                {trail.estimatedDuration || '-'} min
              </Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.label}>{t('trailDetail.difficulty')}</Text>
              <Text style={styles.value}>{trail.difficulty || '-'}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={toggleSave}>
            <Ionicons
              name={isSaved ? 'bookmark' : 'bookmark-outline'}
              size={22}
              color={isSaved ? '#00ffcc' : '#02c95c'}
            />
            <Text style={styles.saveText}>
              {isSaved ? t('trailDetail.unsave') : t('trailDetail.save')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.startButton} onPress={startActivity}>
            <Ionicons name="play-circle" size={22} color="#ffffff" />
            <Text style={styles.startText}>{t('trailDetail.start')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
