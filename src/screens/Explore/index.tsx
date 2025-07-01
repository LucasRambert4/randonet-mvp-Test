import React from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  Platform,
} from 'react-native';
import TrailCard from './TrailCard';
import useExploreScreenLogic from './ExploreScreen.logic';
import styles from './ExploreScreen.styles';

export default function ExploreScreen() {
  const { t, search, setSearch, loading, visibleAndSorted, renderTrail } =
    useExploreScreenLogic();

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { paddingTop: Platform.OS === 'android' ? 25 : 0 },
      ]}
    >
      <View style={styles.container}>
        <Text style={styles.title}>{t('explore.title')}</Text>

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
