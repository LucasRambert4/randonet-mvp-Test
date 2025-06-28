import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { supabase } from '../../../supabase-config';
import * as FileSystem from 'expo-file-system';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

export default function SaveActivityScreen() {
  const navigation = useNavigation();
  const routeParams = useRoute().params as {
    route: any[];
    distance: number;
    startTime: Date | null;
    endTime: Date;
    elevation: number;
    location: string;
    activityId?: string;
    existingData?: any;
  };
  const { user } = useAuth();
  const { t } = useTranslation();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState(0);
  const [type, setType] = useState<'hiking' | 'running' | 'biking'>('running');
  const [difficulty, setDifficulty] = useState<'easy' | 'normal' | 'hard'>(
    'normal'
  );

  useEffect(() => {
    if (routeParams.existingData) {
      const d = routeParams.existingData;
      setTitle(d.title || '');
      setDescription(d.description || '');
      setRating(d.rating || 0);
      setType(d.type || 'running');
      setDifficulty(d.difficulty || 'normal');
    }
  }, []);

  const save = async () => {
    if (!user)
      return Alert.alert(
        t('saveActivity.errorTitle'),
        t('saveActivity.errorNotLoggedIn')
      );

    try {
      const filename = routeParams.activityId || `${Date.now()}.json`;
      const path = `${user.id}/${filename}`;
      const duration =
        routeParams.startTime && routeParams.endTime
          ? Math.round(
              (+new Date(routeParams.endTime) -
                +new Date(routeParams.startTime)) /
                1000
            )
          : 0;

      const data = {
        user_id: user.id,
        start_time: routeParams.startTime?.toISOString(),
        end_time: routeParams.endTime.toISOString(),
        duration_seconds: duration,
        distance_meters: Math.round(routeParams.distance),
        path: routeParams.route,
        title,
        description,
        rating,
        type,
        difficulty,
        location: routeParams.location,
        elevation: Math.round(routeParams.elevation || 0),
      };

      const fileUri = FileSystem.cacheDirectory + filename;
      await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(data), {
        encoding: FileSystem.EncodingType.UTF8,
      });

      const { error: uploadError } = await supabase.storage
        .from('activities')
        .upload(
          path,
          { uri: fileUri, type: 'application/json', name: filename } as any,
          { upsert: true, contentType: 'application/json' }
        );

      if (uploadError) throw uploadError;

      Alert.alert(
        t('saveActivity.successTitle'),
        t('saveActivity.successMessage')
      );
      navigation.goBack();
    } catch (err: any) {
      Alert.alert(
        t('saveActivity.errorTitle'),
        err.message || t('saveActivity.errorSaveFailed')
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>{t('saveActivity.labelTitle')}</Text>
      <TextInput
        placeholder={t('saveActivity.placeholderTitle')}
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>{t('saveActivity.labelDescription')}</Text>
      <TextInput
        placeholder={t('saveActivity.placeholderDescription')}
        style={[styles.input, styles.multiline]}
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Text style={styles.label}>{t('saveActivity.labelRating')}</Text>
      <View style={styles.row}>
        {[1, 2, 3].map((i) => (
          <TouchableOpacity key={i} onPress={() => setRating(i)}>
            <Ionicons
              name={i <= rating ? 'star' : 'star-outline'}
              size={24}
              color="gold"
            />
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>{t('saveActivity.labelType')}</Text>
      <View style={styles.row}>
        {(['running', 'hiking', 'biking'] as const).map((tpe) => (
          <TouchableOpacity
            key={tpe}
            onPress={() => setType(tpe)}
            style={[styles.chip, type === tpe && styles.activeChip]}
          >
            <Text style={styles.chipText}>{t(`saveActivity.type${tpe}`)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>{t('saveActivity.labelDifficulty')}</Text>
      <View style={styles.row}>
        {(['easy', 'normal', 'hard'] as const).map((d) => (
          <TouchableOpacity
            key={d}
            onPress={() => setDifficulty(d)}
            style={[styles.chip, difficulty === d && styles.activeChip]}
          >
            <Text style={styles.chipText}>
              {t(
                `saveActivity.difficulty${
                  d.charAt(0).toUpperCase() + d.slice(1)
                }`
              )}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>{t('saveActivity.labelLocation')}</Text>
      <Text style={styles.readOnlyText}>
        {routeParams.location || t('saveActivity.empty')}
      </Text>

      <Text style={styles.label}>{t('saveActivity.labelElevation')}</Text>
      <Text style={styles.readOnlyText}>
        {Math.round(routeParams.elevation || 0)} m
      </Text>

      <TouchableOpacity onPress={save} style={styles.saveBtn}>
        <Text style={styles.saveText}>{t('saveActivity.buttonSave')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#013220',
    flexGrow: 1,
  },
  label: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 4,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
  },
  multiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 10,
  },
  chip: {
    backgroundColor: '#999',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  activeChip: {
    backgroundColor: '#2ecc71',
  },
  chipText: {
    color: '#fff',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  readOnlyText: {
    color: 'white',
    backgroundColor: '#2c3e50',
    padding: 10,
    borderRadius: 8,
    marginTop: 5,
    fontSize: 16,
  },
  saveBtn: {
    backgroundColor: '#27ae60',
    padding: 15,
    marginTop: 30,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
