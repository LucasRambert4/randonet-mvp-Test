import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './SaveActivityScreen.styles';

interface SaveActivityFormProps {
  t: (key: string) => string;
  title: string;
  setTitle: (text: string) => void;
  description: string;
  setDescription: (text: string) => void;
  rating: number;
  setRating: (n: number) => void;
  type: string;
  setType: (t: string) => void;
  difficulty: string;
  setDifficulty: (d: string) => void;
  save: () => void;
}

export default function SaveActivityForm({
  t,
  title,
  setTitle,
  description,
  setDescription,
  rating,
  setRating,
  type,
  setType,
  difficulty,
  setDifficulty,
  save,
}: SaveActivityFormProps) {
  return (
    <>
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
        {(['Easy', 'Normal', 'Hard'] as const).map((d) => (
          <TouchableOpacity
            key={d}
            onPress={() => setDifficulty(d.toLowerCase())}
            style={[
              styles.chip,
              difficulty === d.toLowerCase() && styles.activeChip,
            ]}
          >
            <Text style={styles.chipText}>
              {t(`saveActivity.difficulty${d}`)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity onPress={save} style={styles.saveBtn}>
        <Text style={styles.saveText}>{t('saveActivity.buttonSave')}</Text>
      </TouchableOpacity>
    </>
  );
}
