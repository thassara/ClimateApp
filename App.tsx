import React, { useState } from 'react';
import { View, StyleSheet,Text } from 'react-native';
import { HomeScreen } from './src/screens/Common/HomeScreen';
import { BottomNavBar } from './src/components/Common/BottomNavBar';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        {activeTab === 'home' && <HomeScreen />}
        {activeTab === 'map' && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Map Screen (Coming Soon)</Text></View>}
        {activeTab === 'alerts' && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Alerts Screen (Coming Soon)</Text></View>}
        {activeTab === 'settings' && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Settings Screen (Coming Soon)</Text></View>}
      </View>
      <BottomNavBar activeTab={activeTab} setActiveTab={setActiveTab} />
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: '#E0F2FE' } });
