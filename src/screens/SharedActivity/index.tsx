import React from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Image,
} from 'react-native';
import { DrawerActions } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchBar from '../../components/Search';
import ActivityCard from './ActivityCard';
import useSharedActivityLogic from './SharedActivityScreen.logic';
import styles from './SharedActivityScreen.styles';

export default function SharedActivityScreen() {
  const {
    t,
    user,
    navigation,
    search,
    setSearch,
    tab,
    setTab,
    loading,
    refreshing,
    filteredActivities,
    onRefresh,
    handleActivityPress,
    toggleSave,
    saved,
    shareActivity,
  } = useSharedActivityLogic();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.topBar}>
        <Text style={styles.title}>{t('shared.title')}</Text>
        <View style={styles.rightIcons}>
          <TouchableOpacity
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          >
            <Image
              source={{
                uri:
                  user?.user_metadata?.avatar_url ||
                  'https://via.placeholder.com/40',
              }}
              style={styles.avatar}
            />
          </TouchableOpacity>
        </View>
      </View>

      <SearchBar
        value={search}
        onChangeText={setSearch}
        placeholder={t('shared.searchPlaceholder')}
      />

      <View style={styles.tabs}>
        {['All', 'User', 'Friends'].map((label) => (
          <TouchableOpacity
            key={label}
            onPress={() => setTab(label as any)}
            style={[styles.tabButton, tab === label && styles.activeTabButton]}
          >
            <Text style={[styles.tabText, tab === label && styles.activeTab]}>
              {t(`shared.tab${label}`)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#fff"
          style={{ marginTop: 20 }}
        />
      ) : (
        <FlatList
          data={filteredActivities}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ActivityCard
              item={item}
              user={user}
              saved={saved}
              onPress={() => handleActivityPress(item)}
              toggleSave={toggleSave}
              shareActivity={() => shareActivity(item)}
              t={t}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#fff"
            />
          }
        />
      )}
    </SafeAreaView>
  );
}
