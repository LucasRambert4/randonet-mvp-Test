import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import styles from './MyRoutesScreen.styles';

export default function ActivityCard({ item, confirmDelete, handlePress }) {
  const renderActivityIcon = (type: string) => {
    switch (type) {
      case 'hiking':
        return <FontAwesome5 name="hiking" size={20} color="white" />;
      case 'running':
        return <FontAwesome5 name="running" size={20} color="white" />;
      case 'biking':
        return <FontAwesome5 name="bicycle" size={20} color="white" />;
      default:
        return null;
    }
  };

  return (
    <Swipeable
      renderRightActions={() => (
        <TouchableOpacity style={styles.deleteAction} onPress={confirmDelete}>
          <Ionicons name="trash-bin" size={24} color="white" />
        </TouchableOpacity>
      )}
    >
      <TouchableOpacity style={styles.card} onPress={handlePress}>
        <View style={styles.cardContent}>
          <View style={styles.left}>
            <Text style={styles.metaText}>
              {item.title} • {item.location}
            </Text>
            <Text style={styles.metaText}>
              {item.date} • {item.distance} • {item.duration}
            </Text>
            <Text style={styles.metaText}>
              Elevation: {item.elevation ?? 0} m
            </Text>
            <Text style={styles.metaText}>
              Difficulty: {item.difficulty ?? ''}
            </Text>
            <View style={styles.rating}>
              {Array.from({ length: 3 }).map((_, i) => (
                <Ionicons
                  key={i}
                  name={i < (item.rating || 0) ? 'star' : 'star-outline'}
                  size={18}
                  color="white"
                />
              ))}
            </View>
          </View>
          <View style={styles.right}>{renderActivityIcon(item.type)}</View>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
}
