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
import { getAQIPredictions } from "../../services/Air quality/airQualityService";

const { width } = Dimensions.get("window");

// Sample data for demonstration
const sampleCities = ["New York", "London", "Tokyo", "Paris", "Berlin", "Sydney", "Colombo", "Dehli"];
const aqiColors = {
  good: "#4CAF50",
  moderate: "#FFC107",
  unhealthy: "#FF9800",
  veryUnhealthy: "#F44336",
  hazardous: "#9C27B0",
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

// Interface for PredictionCard props
interface PredictionCardProps {
  item: {
    day: number;
    predictedAQI: number;
    date: string;
  };
}

// Prediction Card Component
const PredictionCard = ({ item }: PredictionCardProps) => {
  const date = new Date(item.date);
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardDate}>{formattedDate}</Text>
        <View style={styles.aqiValueContainer}>
          <Text style={styles.aqiValue}>{item.predictedAQI}</Text>
          <Text style={styles.aqiLabel}>Predicted AQI</Text>
        </View>
      </View>

      <AqiIndicator aqi={item.predictedAQI} />

      <View style={styles.componentsContainer}>
        <Text style={styles.predictionText}>Day {item.day} prediction</Text>
      </View>
    </View>
  );
};


export default function PredictionScreen() {
  const [city, setCity] = useState("");
  const [predictions, setPredictions] = useState<any[]>([]);
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<"historical" | "predictions">("predictions");

  const handleFetchPredictions = async () => {
    if (!city.trim()) return;
    
    try {
      setLoading(true);
      setError(null);
      setShowSuggestions(false);
      
      const result = await getAQIPredictions(city, 5);
      
      if (result.success) {
        setPredictions(result.data.predictions);
        setHistoricalData(result.data.historicalData);
      } else {
        setError(result.message || "Failed to fetch predictions");
      }
    } catch (error) {
      console.error("Error fetching predictions", error);
      setError("Failed to fetch predictions. Please try again.");
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

  // Prepare data for the chart (combine historical and predicted data)
  const allData = [...historicalData, ...predictions.map(p => ({ date: p.date, aqi: p.predictedAQI }))];
  
  const chartData = {
    labels: allData.map(item => {
      const date = new Date(item.date);
      return date.getDate().toString() + '/' + (date.getMonth() + 1);
    }),
    datasets: [
      {
        data: allData.map(item => item.aqi),
        color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
        strokeWidth: 2
      }
    ],
    legend: ["AQI Trend"]
  };

  const chartConfig = {
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: "#4CAF50"
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Air Quality Predictions</Text>
          <Text style={styles.Icon}>🔮</Text>
        </View>
        
        <Text style={styles.subtitle}>
          Get AQI predictions for the next 5 days
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
            onPress={handleFetchPredictions}
            disabled={!city.trim()}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="cloud-download" size={20} color="#fff" />
                <Text style={styles.searchButtonText}>Get Predictions</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#000" />
            <Text style={styles.loadingText}>Fetching predictions...</Text>
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Ionicons name="warning" size={24} color="#F44336" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {predictions.length > 0 && !loading && !error && (
          <View style={styles.resultsContainer}>
            <View style={styles.tabContainer}>
              <TouchableOpacity 
                style={[styles.tab, selectedTab === "historical" && styles.activeTab]}
                onPress={() => setSelectedTab("historical")}
              >
                <Text style={[styles.tabText, selectedTab === "historical" && styles.activeTabText]}>
                  Historical Data
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.tab, selectedTab === "predictions" && styles.activeTab]}
                onPress={() => setSelectedTab("predictions")}
              >
                <Text style={[styles.tabText, selectedTab === "predictions" && styles.activeTabText]}>
                  Predictions
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.resultsHeader}>
              <Text style={styles.resultsTitle}>
                Air Quality {selectedTab === "historical" ? "History" : "Predictions"} for {city}
              </Text>
            </View>

            {/* Chart showing the trend */}
            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>
                AQI Trend (Historical + Predictions)
              </Text>
              <LineChart
                data={chartData}
                width={width - 40}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
                fromZero={true}
              />
              <View style={styles.chartNote}>
                <Text style={styles.chartNoteText}>
                  Note: Vertical line separates historical data (left) from predictions (right)
                </Text>
              </View>
            </View>

            {selectedTab === "historical" ? (
              <FlatList
                data={historicalData}
                keyExtractor={(item) => item.date}
                renderItem={({ item }) => (
                  <View style={styles.card}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.cardDate}>
                        {new Date(item.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </Text>
                      <View style={styles.aqiValueContainer}>
                        <Text style={styles.aqiValue}>{item.aqi}</Text>
                        <Text style={styles.aqiLabel}>AQI</Text>
                      </View>
                    </View>
                    <AqiIndicator aqi={item.aqi} />
                  </View>
                )}
                contentContainerStyle={styles.listContainer}
                scrollEnabled={false}
              />
            ) : (
              <FlatList
                data={predictions}
                keyExtractor={(item) => item.date}
                renderItem={({ item }) => <PredictionCard item={item} />}
                contentContainerStyle={styles.listContainer}
                scrollEnabled={false}
              />
            )}
          </View>
        )}

        {predictions.length === 0 && !loading && !error && (
          <View style={styles.placeholderContainer}>
            <Ionicons name="analytics" size={64} color="rgba(0,0,0,0.3)" />
            <Text style={styles.placeholderText}>
              Enter a city name to view AQI predictions
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
  Icon: {
    marginRight: 10,
    fontSize: 30
  },
  searchIcon:{
    marginRight: 10,
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
    backgroundColor: "#2e78b7",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  searchButtonDisabled: {
    backgroundColor: "#2e78b7",
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
  tabContainer: {
    flexDirection: "row",
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
  },
  tab: {
    flex: 1,
    padding: 16,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#4CAF50",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  activeTabText: {
    color: "#fff",
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
  predictionText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    fontStyle: "italic",
  },
  chartContainer: {
    marginBottom: 20,
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
  },
  chartNote: {
    marginTop: 12,
    padding: 8,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  chartNoteText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    fontStyle: "italic",
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