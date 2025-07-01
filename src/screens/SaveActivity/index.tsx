import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useSaveActivityLogic from './SaveActivityScreen.logic';
import styles from './SaveActivityScreen.styles';

export default function SaveActivityScreen() {
  const {
    t,
    title,
    description,
    rating,
    type,
    difficulty,
    setTitle,
    setDescription,
    setRating,
    setType,
    setDifficulty,
    location,
    elevation,
    save,
  } = useSaveActivityLogic();

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
        {location || t('saveActivity.empty')}
      </Text>

      <Text style={styles.label}>{t('saveActivity.labelElevation')}</Text>
      <Text style={styles.readOnlyText}>{Math.round(elevation)} m</Text>

      <TouchableOpacity onPress={save} style={styles.saveBtn}>
        <Text style={styles.saveText}>{t('saveActivity.buttonSave')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
