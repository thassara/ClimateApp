import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  Dimensions, 
  ScrollView, 
  ActivityIndicator,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  Alert
} from "react-native";
import { getAirQuality } from "../../services/Air quality/airQualityService";

export default function AirQualityScreen() {
  const [city, setCity] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (!city.trim()) {
      Alert.alert("Error", "Please enter a city name");
      return;
    }
    await handleCheckWithCity(city);
  };

  const handleCheckWithCity = async (cityName: string) => {
    try {
      setLoading(true);
      const res = await getAirQuality(cityName);

      setData({
        city: res.city || cityName,
        aqi: res.aqi,
        meaning: res.meaning,
        coordinates: res.coordinates,
        components: res.components
      });
    } catch (error) {
      console.error("Error fetching air quality", error);
      Alert.alert("Error", "Failed to fetch air quality data. Please try again.");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const getAqiColor = (aqi: number) => {
    switch(aqi) {
      case 1: return '#55a84f'; // Good
      case 2: return '#a3c853'; // Fair
      case 3: return '#fff833'; // Moderate
      case 4: return '#f29c33'; // Poor
      case 5: return '#e93f33'; // Very Poor
      default: return '#cccccc';
    }
  };

  const getAqiDescription = (aqi: number) => {
    switch(aqi) {
      case 1: return 'Good';
      case 2: return 'Fair';
      case 3: return 'Moderate';
      case 4: return 'Poor';
      case 5: return 'Very Poor';
      default: return 'Unknown';
    }
  };

  // Popular cities for quick selection
  const popularCities = [
    "New York", "London", "Tokyo", "Paris", "Beijing", "Delhi"
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Air Quality Checker 🌍</Text>
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter city name"
          value={city}
          onChangeText={setCity}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleCheck}>
          <Text style={styles.searchButtonText}>Check AQI</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.sectionTitle}>Popular Cities</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.citiesContainer}>
        {popularCities.map((cityName, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.cityButton}
            onPress={() => {
              setCity(cityName);
              setTimeout(() => handleCheck(), 100);
            }}
          >
            <Text style={styles.cityButtonText}>{cityName}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2e78b7" />
          <Text>Loading air quality data...</Text>
        </View>
      )}
      
      {/* Location Visualization */}
      {data && (
        <View style={styles.locationContainer}>
          <Text style={styles.sectionTitle}>Location: {data.city}</Text>
          <View style={styles.coordinates}>
            <Text style={styles.coordinateText}>Lat: {data.coordinates?.lat?.toFixed(4) || 'N/A'}</Text>
            <Text style={styles.coordinateText}>Lon: {data.coordinates?.lon?.toFixed(4) || 'N/A'}</Text>
          </View>
        </View>
      )}
      
      {data && (
        <View style={styles.result}>
          <Text style={styles.resultTitle}>Air Quality Results for {data.city}</Text>
          
          <View style={[styles.aqiContainer, {backgroundColor: getAqiColor(data.aqi)}]}>
            <Text style={styles.aqiValue}>{data.aqi}</Text>
            <Text style={styles.aqiText}>{getAqiDescription(data.aqi)}</Text>
            <Text style={styles.aqiMeaning}>{data.meaning}</Text>
          </View>
          
          <Text style={styles.componentsTitle}>Pollutant Levels (μg/m³)</Text>
          <View style={styles.componentsGrid}>
            <View style={styles.componentItem}>
              <Text style={styles.componentLabel}>PM2.5</Text>
              <Text style={styles.componentValue}>{data.components.pm2_5}</Text>
            </View>
            <View style={styles.componentItem}>
              <Text style={styles.componentLabel}>PM10</Text>
              <Text style={styles.componentValue}>{data.components.pm10}</Text>
            </View>
            <View style={styles.componentItem}>
              <Text style={styles.componentLabel}>O₃</Text>
              <Text style={styles.componentValue}>{data.components.o3}</Text>
            </View>
            <View style={styles.componentItem}>
              <Text style={styles.componentLabel}>NO₂</Text>
              <Text style={styles.componentValue}>{data.components.no2 || 'N/A'}</Text>
            </View>
            <View style={styles.componentItem}>
              <Text style={styles.componentLabel}>SO₂</Text>
              <Text style={styles.componentValue}>{data.components.so2 || 'N/A'}</Text>
            </View>
            <View style={styles.componentItem}>
              <Text style={styles.componentLabel}>CO</Text>
              <Text style={styles.componentValue}>{data.components.co || 'N/A'}</Text>
            </View>
          </View>
          
          <Text style={styles.healthTipsTitle}>Health Tips</Text>
          <View style={[styles.healthTips, 
            {backgroundColor: data.aqi <= 2 ? '#e8f5e9' : data.aqi === 3 ? '#fff3e0' : '#ffebee'}]}>
            {data.aqi <= 2 ? (
              <>
                <Text style={styles.tip}>✓ Air quality is good. Enjoy outdoor activities!</Text>
                <Text style={styles.tip}>✓ Great day for windows open and fresh air.</Text>
              </>
            ) : data.aqi === 3 ? (
              <>
                <Text style={styles.tip}>✓ Air quality is acceptable for most people</Text>
                <Text style={styles.tip}>✓ Unusually sensitive people should reduce prolonged outdoor exertion</Text>
              </>
            ) : (
              <>
                <Text style={styles.tip}>⚠️ Reduce outdoor activities</Text>
                <Text style={styles.tip}>⚠️ Sensitive groups should avoid outdoor exertion</Text>
                <Text style={styles.tip}>⚠️ Keep windows closed if possible</Text>
              </>
            )}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20,
    backgroundColor: '#f5f5f5'
  },
  title: { 
    fontSize: 28, 
    fontWeight: "bold", 
    marginBottom: 20, 
    color: '#2c3e50'
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  input: { 
    flex: 1,
    borderWidth: 1, 
    borderColor: '#ddd',
    padding: 12, 
    marginRight: 10, 
    borderRadius: 8,
    backgroundColor: 'white',
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#2e78b7',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  locationButton: {
    backgroundColor: '#34c759',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  locationButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  citiesContainer: {
    marginBottom: 20,
    maxHeight: 50,
  },
  cityButton: {
    backgroundColor: '#e1f5fe',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    justifyContent: 'center',
  },
  cityButtonText: {
    color: '#0277bd',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#2c3e50'
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  locationContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  coordinates: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
  },
  coordinateText: {
    color: '#7f8c8d',
    fontSize: 14,
  },
  result: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#2c3e50'
  },
  aqiContainer: {
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
    fontSize: 25
  },
  aqiValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
  },
  aqiText: {
    fontSize: 20,
    color: 'white',
    fontWeight: '600',
    marginTop: 5,
  },
  aqiMeaning: {
    fontSize: 16,
    color: 'white',
    marginTop: 5,
  },
  componentsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#2c3e50'
  },
  componentsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  componentItem: {
    width: width / 2 - 30,
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  componentLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 5,
  },
  componentValue: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  healthTipsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 10,
    color: '#2c3e50'
  },
  healthTips: {
    padding: 15,
    borderRadius: 8,
  },
  tip: {
    marginBottom: 8,
    fontSize: 14,
    lineHeight: 20,
  },
});