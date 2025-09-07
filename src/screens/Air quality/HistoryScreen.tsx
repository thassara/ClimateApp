import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LineChart } from "react-native-chart-kit";
import { getAirQualityHistory } from "../../services/Air quality/airQualityService";

const { width } = Dimensions.get("window");

// Sample data for demonstration (will be replaced with actual API data)
const sampleCities = ["New York", "London", "Tokyo", "Paris", "Berlin", "Sydney", "Colombo"];
const aqiColors = {
  good: "#4CAF50",
  moderate: "#FFC107",
  unhealthy: "#FF9800",
  veryUnhealthy: "#F44336",
  hazardous: "#9C27B0",
};

// Colors for different pollutants in the chart
const pollutantColors = {
  pm2_5: "#FF6384",
  no2: "#36A2EB",
  o3: "#FFCE56",
  so2: "#4BC0C0",
  co: "#9966FF",
  pm10: "#FF9F40",
};

// Interface for AqiIndicator props
interface AqiIndicatorProps {
  aqi: number;
}

// Helper function to determine AQI level
const getAqiLevel = (aqi: number) => {
  if (aqi <= 50) return { level: "Good", color: aqiColors.good };
  if (aqi <= 100) return { level: "Moderate", color: aqiColors.moderate };
  if (aqi <= 150) return { level: "Unhealthy for Sensitive Groups", color: aqiColors.unhealthy };
  if (aqi <= 200) return { level: "Unhealthy", color: aqiColors.veryUnhealthy };
  if (aqi <= 300) return { level: "Very Unhealthy", color: aqiColors.hazardous };
  return { level: "Hazardous", color: aqiColors.hazardous };
};

// AQI Indicator Component
const AqiIndicator = ({ aqi }: AqiIndicatorProps) => {
  const { level, color } = getAqiLevel(aqi);
  return (
    <View style={styles.aqiContainer}>
      <View style={[styles.aqiDot, { backgroundColor: color }]} />
      <Text style={[styles.aqiText, { color }]}>{level}</Text>
    </View>
  );
};

// Interface for HistoryCard props
interface HistoryCardProps {
  item: {
    date: string;
    avgAqi: number;
    maxAqi: number;
    minAqi: number;
    hourlyData: any[];
  };
  onSelect: (date: string, hourlyData: any[]) => void;
  isSelected: boolean;
  showChart: boolean;
}

// History Card Component (showing daily data)
const HistoryCard = ({ item, onSelect, isSelected, showChart }: HistoryCardProps) => {
  const date = new Date(item.date);
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  // Prepare data for the chart
  const chartData = {
    labels: item.hourlyData.map(hour => {
      const date = new Date(hour.timestamp);
      return date.getHours().toString().padStart(2, '0') + ':00';
    }),
    datasets: [
      {
        data: item.hourlyData.map(hour => hour.components.pm2_5),
        color: () => pollutantColors.pm2_5,
        strokeWidth: 2,
        label: "PM2.5"
      },
      {
        data: item.hourlyData.map(hour => hour.components.no2),
        color: () => pollutantColors.no2,
        strokeWidth: 2,
        label: "NO₂"
      },
      {
        data: item.hourlyData.map(hour => hour.components.o3),
        color: () => pollutantColors.o3,
        strokeWidth: 2,
        label: "O₃"
      },
      {
        data: item.hourlyData.map(hour => hour.components.so2 || 0),
        color: () => pollutantColors.so2,
        strokeWidth: 2,
        label: "SO₂"
      },
    ],
  };

  const chartConfig = {
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: "3",
      strokeWidth: "1",
    }
  };

  return (
    <View>
      <TouchableOpacity 
        style={[styles.card, isSelected && styles.selectedCard]}
        onPress={() => onSelect(item.date, item.hourlyData)}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardDate}>{formattedDate}</Text>
          <View style={styles.aqiValueContainer}>
            <Text style={styles.aqiValue}>{item.avgAqi.toFixed(1)}</Text>
            <Text style={styles.aqiLabel}>Avg AQI</Text>
          </View>
        </View>

        <AqiIndicator aqi={item.avgAqi} />

        <View style={styles.componentsContainer}>
          <View style={styles.componentRow}>
            <View style={styles.componentItem}>
              <Text style={styles.componentLabel}>Max AQI</Text>
              <Text style={styles.componentValue}>{item.maxAqi.toFixed(1)}</Text>
            </View>
            <View style={styles.componentItem}>
              <Text style={styles.componentLabel}>Min AQI</Text>
              <Text style={styles.componentValue}>{item.minAqi.toFixed(1)}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      {isSelected && showChart && (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>
            Pollutant Levels by Hour for {formattedDate}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={true}>
            <LineChart
              data={chartData}
              width={Math.max(width - 40, item.hourlyData.length * 50)}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
              withVerticalLines={item.hourlyData.length <= 24}
              withHorizontalLines={true}
              segments={5}
            />
          </ScrollView>
          
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: pollutantColors.pm2_5 }]} />
              <Text style={styles.legendText}>PM2.5</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: pollutantColors.no2 }]} />
              <Text style={styles.legendText}>NO₂</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: pollutantColors.o3 }]} />
              <Text style={styles.legendText}>O₃</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: pollutantColors.so2 }]} />
              <Text style={styles.legendText}>SO₂</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

// Function to process API data and group by day
const processHistoryData = (data: any[]) => {
  // Group data by day
  const dailyData: {[key: string]: any[]} = {};
  
  data.forEach(item => {
    const date = new Date(item.timestamp);
    const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD format
    
    if (!dailyData[dateKey]) {
      dailyData[dateKey] = [];
    }
    
    dailyData[dateKey].push(item);
  });
  
  // Calculate daily averages, max, and min
  const processedData = Object.keys(dailyData).map(date => {
    const dayData = dailyData[date];
    const aqis = dayData.map(d => d.aqi);
    
    return {
      date,
      avgAqi: aqis.reduce((sum, aqi) => sum + aqi, 0) / aqis.length,
      maxAqi: Math.max(...aqis),
      minAqi: Math.min(...aqis),
      hourlyData: dayData // Keep hourly data for the graph
    };
  });
  
  return processedData;
};

export default function HistoryScreen() {
  const [city, setCity] = useState("");
  const [history, setHistory] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetchHistory = async () => {
    if (!city.trim()) return;
    
    try {
      setLoading(true);
      setError(null);
      setShowSuggestions(false);
      setSelectedDate(null);
      const res = await getAirQualityHistory(city, 5); // last 3 days
      
      // Process the data to group by day
      const processedData = processHistoryData(res.trends);
      setHistory(processedData);
      
      if (processedData.length === 0) {
        setError("No historical data available for this city");
      }
    } catch (error) {
      console.error("Error fetching history", error);
      setError("Failed to fetch air quality data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (text: string) => {
    setCity(text);
    if (text.length > 1) {
      const filtered = sampleCities.filter(city => 
        city.toLowerCase().includes(text.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (suggestion: string) => {
    setCity(suggestion);
    setShowSuggestions(false);
  };

  const handleDateSelect = (date: string) => {
    // Toggle selection - if already selected, deselect it
    setSelectedDate(selectedDate === date ? null : date);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Historical Air Quality</Text>
          <Ionicons name="stats-chart" size={32} color="#000" />
        </View>
        
        <Text style={styles.subtitle}>
          Track air quality trends over time
        </Text>

        <View style={styles.searchSection}>
          <View style={styles.inputContainer}>
            <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter city name"
              placeholderTextColor="#999"
              value={city}
              onChangeText={handleInputChange}
              onFocus={() => city.length > 1 && setShowSuggestions(true)}
            />
          </View>

          {showSuggestions && suggestions.length > 0 && (
            <View style={styles.suggestionsContainer}>
              {suggestions.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionItem}
                  onPress={() => selectSuggestion(suggestion)}
                >
                  <Ionicons name="location" size={18} color="#667eea" />
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <TouchableOpacity 
            style={[styles.searchButton, !city.trim() && styles.searchButtonDisabled]}
            onPress={handleFetchHistory}
            disabled={!city.trim()}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="cloud-download" size={20} color="#fff" />
                <Text style={styles.searchButtonText}>Get History</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#000" />
            <Text style={styles.loadingText}>Fetching air quality data...</Text>
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Ionicons name="warning" size={24} color="#F44336" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {history.length > 0 && !loading && !error && (
          <View style={styles.resultsContainer}>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsTitle}>
                Air Quality History for {city}
              </Text>
              <Text style={styles.resultsSubtitle}>
                Last {history.length} days
              </Text>
            </View>

            <FlatList
              data={history}
              keyExtractor={(item) => item.date}
              renderItem={({ item }) => (
                <HistoryCard 
                  item={item} 
                  onSelect={handleDateSelect}
                  isSelected={selectedDate === item.date}
                  showChart={true}
                />
              )}
              contentContainerStyle={styles.listContainer}
              scrollEnabled={false}
            />
          </View>
        )}

        {history.length === 0 && !loading && !error && (
          <View style={styles.placeholderContainer}>
            <Ionicons name="earth" size={64} color="rgba(0,0,0,0.3)" />
            <Text style={styles.placeholderText}>
              Enter a city name to view its air quality history
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(0,0,0,0.6)",
    marginBottom: 30,
  },
  searchSection: {
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  suggestionsContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  suggestionText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#333",
  },
  searchButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4CAF50",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  searchButtonDisabled: {
    backgroundColor: "#9E9E9E",
  },
  searchButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
  loadingContainer: {
    alignItems: "center",
    padding: 40,
  },
  loadingText: {
    color: "#000",
    marginTop: 16,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFEBEE",
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  errorText: {
    color: "#F44336",
    marginLeft: 12,
    fontSize: 14,
  },
  resultsContainer: {
    marginTop: 20,
  },
  resultsHeader: {
    marginBottom: 20,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  resultsSubtitle: {
    fontSize: 14,
    color: "rgba(0,0,0,0.6)",
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: "#4CAF50",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardDate: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  aqiValueContainer: {
    alignItems: "center",
  },
  aqiValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  aqiLabel: {
    fontSize: 12,
    color: "#666",
  },
  aqiContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  aqiDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  aqiText: {
    fontSize: 14,
    fontWeight: "500",
  },
  componentsContainer: {
    marginTop: 8,
  },
  componentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  componentItem: {
    width: "48%",
  },
  componentLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  componentValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  chartContainer: {
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  chart: {
    borderRadius: 16,
    marginLeft: -10,
  },
  legendContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 16,
    gap: 12,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: "#666",
  },
  placeholderContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  placeholderText: {
    color: "rgba(0,0,0,0.6)",
    textAlign: "center",
    marginTop: 16,
    fontSize: 16,
  },
});