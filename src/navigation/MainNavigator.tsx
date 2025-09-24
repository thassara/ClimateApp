import React from 'react';
import HomeScreen from '.././screens/Common/HomeScreen';
import FootprintTabsScreen from '../screens/Common/FootprintTabsScreen';
import AirQualityScreen from '../screens/Air quality/AirQualityScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function MainNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName = 'home';
            if (route.name === 'Home') iconName = 'home';
            if (route.name === 'Air Quality') iconName = 'weather-partly-cloudy';
            if (route.name === 'Footprint') iconName = 'leaf';
            if (route.name === 'Alerts') iconName = 'bell';
            if (route.name === 'Settings') iconName = 'cog';
            return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
          },
          headerShown: false,
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Air Quality" component={AirQualityScreen} />
        <Tab.Screen name="Footprint" component={FootprintTabsScreen} />
        {/* Add Alerts and Settings screens as needed */}
      </Tab.Navigator>
    </NavigationContainer>
  );
}
