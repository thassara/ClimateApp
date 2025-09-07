import React from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { SearchBar } from "../../components/Common/SearchBar";
import { WeatherCard } from '../../components/Common/WeatherCard';

export function HomeScreen() {
 
    const currentLocation = {
    location: 'New York',
    temperature: 24,
    condition: 'partly-cloudy' as const,
    humidity: 65,
    windSpeed: 12,
  };

  const savedLocations = [
    {
      location: 'London',
      temperature: 18,
      condition: 'rainy' as const,
      humidity: 78,
      windSpeed: 8,
    },
    {
      location: 'Tokyo',
      temperature: 28,
      condition: 'sunny' as const,
      humidity: 55,
      windSpeed: 6,
    },
  ];


  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Climate App</Text>
      <SearchBar />
      <Text style={styles.sectionTitle}>Current Location</Text>
      <WeatherCard {...currentLocation} />
      <Text style={styles.sectionTitle}>Saved Locations</Text>
      {savedLocations.map((loc, i) => <WeatherCard key={i} {...loc} />)}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E0F2FE' },
  title: { fontSize: 24, fontWeight: '700', marginHorizontal: 16, marginTop: 40, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginHorizontal: 16, marginTop: 16, marginBottom: 8 },
});

export default HomeScreen;  
