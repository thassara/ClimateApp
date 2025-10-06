import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import HomeScreen from '../screens/Common/HomeScreen';
import AirQualityScreen from '../screens/Air quality/AirQualityScreen';
import FootprintTabsScreen from '../screens/Common/FootprintTabsScreen';
import ClimateNewsScreen from '../screens/News/ClimateNewsScreen';
import BottomNavBar from '../components/Common/BottomNavBar';

const TAB_COMPONENTS: Record<string, React.ComponentType<any>> = {
  home: HomeScreen,
  'Air Quality': AirQualityScreen,
  Footprint: FootprintTabsScreen,
  news: ClimateNewsScreen,
  // Add more tabs/screens as needed
};

const CustomMainNavigator = () => {
  const [activeTab, setActiveTab] = useState('home');
  const ActiveComponent = TAB_COMPONENTS[activeTab] || HomeScreen;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.content}>
          <ActiveComponent />
        </View>
        <BottomNavBar activeTab={activeTab} setActiveTab={setActiveTab} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
  },
});

export default CustomMainNavigator;
