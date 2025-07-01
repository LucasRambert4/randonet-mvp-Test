import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import useUserProfileLogic from './UserProfileScreen.logic';
import styles from './UserProfileScreen.styles';
import { ActivityCard } from './UserProfileScreen.components';

export default function UserProfileScreen() {
  const {
    navigation,
    t,
    profile,
    activities,
    loading,
    handleActivityPress,
    shareActivity,
  } = useUserProfileLogic();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>{profile?.name || t('common.loading')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.header}>
        {profile?.avatar ? (
          <Image source={{ uri: profile.avatar }} style={styles.avatar} />
        ) : null}
        <Text style={styles.name}>{profile?.name}</Text>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#fff"
          style={{ marginTop: 20 }}
        />
      ) : (
        <FlatList
          data={activities}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ActivityCard
              item={item}
              profile={profile}
              t={t}
              onPress={() => handleActivityPress(item)}
              onShare={() => shareActivity(item)}
            />
          )}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
}
