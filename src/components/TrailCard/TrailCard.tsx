import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Trail } from '../services/trailsService';

interface TrailCardProps {
  trail: Trail;
  onPress?: (trail: Trail) => void;
}

const TrailCard: React.FC<TrailCardProps> = ({ trail, onPress }) => {
  const handlePress = () => {
    if (onPress) {
      onPress(trail);
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={handlePress}
    >
      <Text style={styles.name}>{trail.name}</Text>
      {trail.summary ? (
        <Text style={styles.summary}>{trail.summary}</Text>
      ) : null}
      <View style={styles.infoRow}>
        <Text style={styles.info}>{trail.distance.toFixed(1)} km</Text>
        <Text style={styles.info}>{trail.estimatedDuration} min</Text>
        {trail.difficulty ? (
          <Text style={styles.info}>{trail.difficulty}</Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  summary: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  info: {
    fontSize: 14,
    color: '#333',
  },
});

export default TrailCard;
