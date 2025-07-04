import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import SearchBar from '../../components/Search';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import useMyRoutes from './useMyRoutes';
import ActivityCard from './ActivityCard';
import styles from './MyRoutesScreen.styles';

export default function MyRoutesScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { t } = useTranslation();

  const [tab, setTab] = useState<'Completed' | 'Saved'>('Completed');
  const [search, setSearch] = useState('');

  const {
    completedActivities,
    savedActivities,
    loading,
    refreshing,
    confirmDelete,
    onRefresh,
    handleActivityPress,
  } = useMyRoutes(user, tab);

  const dataSource = (
    tab === 'Saved' ? savedActivities : completedActivities
  ).filter((route) =>
    (route.title || t('myRoutes.activityDefault'))
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.title}>{t('myRoutes.title')}</Text>
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
        placeholder={t('myRoutes.searchPlaceholder')}
      />

      <View style={styles.tabs}>
        <TouchableOpacity onPress={() => setTab('Completed')}>
          <Text
            style={[styles.tabText, tab === 'Completed' && styles.activeTab]}
          >
            {t('myRoutes.tabCompleted')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setTab('Saved')}>
          <Text style={[styles.tabText, tab === 'Saved' && styles.activeTab]}>
            {t('myRoutes.tabSaved')}
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#fff"
          style={{ marginTop: 20 }}
        />
      ) : (
        <FlatList
          data={dataSource}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ActivityCard
              item={item}
              confirmDelete={() => confirmDelete(item)}
              handlePress={() => handleActivityPress(item, tab)}
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
