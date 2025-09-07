// src/components/WeatherCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CloudSun, Sun, CloudRain, Wind, Droplet } from 'lucide-react-native';

interface WeatherCardProps {
  location: string;
  temperature: number;
  condition: 'sunny' | 'partly-cloudy' | 'rainy' | 'cloudy';
  humidity: number;
  windSpeed: number;
}

export const WeatherCard = ({
  location,
  temperature,
  condition,
  humidity,
  windSpeed,
}: WeatherCardProps) => {
  const getWeatherIcon = () => {
    switch (condition) {
      case 'sunny':
        return <Sun size={48} color="#FACC15" />;
      case 'partly-cloudy':
        return <CloudSun size={48} color="#6B7280" />;
      case 'rainy':
        return <CloudRain size={48} color="#3B82F6" />;
      case 'cloudy':
        return <CloudSun size={48} color="#9CA3AF" />;
      default:
        return <Sun size={48} color="#FACC15" />;
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.location}>{location}</Text>
          <Text style={styles.today}>Today</Text>
        </View>
        {getWeatherIcon()}
      </View>
      <View style={styles.tempRow}>
        <Text style={styles.temp}>{temperature}°</Text>
        <Text style={styles.condition}>{condition}</Text>
      </View>
      <View style={styles.infoRow}>
        <View style={styles.info}>
          <Droplet size={16} color="#3B82F6" style={{ marginRight: 4 }} />
          <Text>{humidity}%</Text>
        </View>
        <View style={styles.info}>
          <Wind size={16} color="#60A5FA" style={{ marginRight: 4 }} />
          <Text>{windSpeed} km/h</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  location: { fontSize: 18, fontWeight: '600' },
  today: { color: '#6B7280' },
  tempRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 12 },
  temp: { fontSize: 36, fontWeight: '700' },
  condition: { color: '#6B7280', marginLeft: 8, marginBottom: 2 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between' },
  info: { flexDirection: 'row', alignItems: 'center' },
});
