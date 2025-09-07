import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { BottomNavBar } from './src/components/Common/BottomNavBar';

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AirQualityScreen from "../ClimateApp/src/screens/Air quality/AirQualityScreen";
import HistoryScreen from "../ClimateApp/src/screens/Air quality/HistoryScreen"; 
import PredictionScreen from './src/screens/Air quality/PredictionScreen';

const Stack = createStackNavigator();

function AirQualityDashboard({ navigation }: { navigation: any }) {
  return (
    <View style={AirQualityStyles.dashboardContainer}>
      <TouchableOpacity style={AirQualityStyles.card} onPress={() => navigation.navigate("Air Quality")}>
        <Text style={AirQualityStyles.cardTitle}>Air Quality</Text>
        <Text style={AirQualityStyles.cardSubtitle}>Check live AQI 🌍</Text>
      </TouchableOpacity>

      <TouchableOpacity style={AirQualityStyles.card} onPress={() => navigation.navigate("History")}>
        <Text style={AirQualityStyles.cardTitle}>History</Text>
        <Text style={AirQualityStyles.cardSubtitle}>See past trends 📈</Text>
      </TouchableOpacity>

      <TouchableOpacity style={AirQualityStyles.card} onPress={() => navigation.navigate("Future")}>
        <Text style={AirQualityStyles.cardTitle}>AQI Predictor</Text>
        <Text style={AirQualityStyles.cardSubtitle}>Predict your location's Air Quality 🔮</Text>
      </TouchableOpacity>
    </View>
  );
}

function FutureScreen() {
  return (
    <View style={AirQualityStyles.screenCenter}>
      <Text style={{ fontSize: 20 }}>Future Forecast (Coming Soon) 🔮</Text>
    </View>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <NavigationContainer>
      <View style={AirQualityStyles.container}>
        <View style={{ flex: 1 }}>
          {activeTab === 'home' && (
            <View style={AirQualityStyles.screenCenter}>
              <Text>(Coming Soon)</Text>
            </View>
          )}
          {activeTab === 'Air Quality' && (
            <Stack.Navigator screenOptions={{ headerShown: true }}>
              <Stack.Screen name="Dashboard" component={AirQualityDashboard} />
              <Stack.Screen name="Air Quality" component={AirQualityScreen} />
              <Stack.Screen name="History" component={HistoryScreen} />
              <Stack.Screen name="Future" component={PredictionScreen} />
            </Stack.Navigator>
          )}
          {activeTab === 'alerts' && (
            <View style={AirQualityStyles.screenCenter}>
              <Text>Alerts Screen (Coming Soon)</Text>
            </View>
          )}
          {activeTab === 'settings' && (
            <View style={AirQualityStyles.screenCenter}>
              <Text>Settings Screen (Coming Soon)</Text>
            </View>
          )}
        </View>
        <BottomNavBar activeTab={activeTab} setActiveTab={setActiveTab} />
      </View>
    </NavigationContainer>
  );
}

const AirQualityStyles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#E0F2FE',
  },
  dashboardContainer: { 
    flex: 1, 
    flexDirection: "column",  // Stack vertically
    justifyContent: "center"
  },
  card: {
    width: "100%",             // Full row
    height: 150,               // Adjust height as needed
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    marginTop: 10,
    marginBottom: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  cardSubtitle: { fontSize: 14, color: "#555" },
  screenCenter: { flex: 1, justifyContent: "center", alignItems: "center" },
});

