import React from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { DrawerActions } from '@react-navigation/native';
import useExploreScreenLogic from './ExploreScreen.logic';
import styles from './ExploreScreen.styles';

export default function ExploreScreen() {
  const logic = useExploreScreenLogic();
  const {
    t,
    avatarUrl,
    navigation,
    search,
    setSearch,
    loading,
    visibleAndSorted,
    renderTrail,
  } = useExploreScreenLogic();

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { paddingTop: Platform.OS === 'android' ? 25 : 0 },
      ]}
    >
      <View style={styles.container}>
        {/* ✅ New custom top bar */}
        <View style={styles.topBar}>
          <Text style={styles.title}>Explore</Text>

          <TouchableOpacity
            onPress={() =>
              logic.navigation.dispatch(DrawerActions.openDrawer())
            }
          >
            <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          </TouchableOpacity>
        </View>

        <TextInput
          placeholder={t('explore.searchPlaceholder')}
          placeholderTextColor="#aaa"
          value={search}
          onChangeText={setSearch}
          style={styles.input}
        />

        {loading ? (
          <ActivityIndicator size="large" color="#fff" style={styles.loader} />
        ) : (
          <FlatList
            data={visibleAndSorted}
            keyExtractor={(i) => i.id}
            contentContainerStyle={styles.list}
            renderItem={renderTrail}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
