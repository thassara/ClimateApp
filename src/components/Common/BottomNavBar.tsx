import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Home, Map, Bell, Settings } from 'lucide-react-native';

interface BottomNavBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function BottomNavBar({ activeTab, setActiveTab }: BottomNavBarProps) {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'Air Quality', icon: Map, label: 'Air Quality' },
    { id: 'alerts', icon: Bell, label: 'Alerts' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <View style={styles.container}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <TouchableOpacity
            key={item.id}
            style={styles.button}
            onPress={() => setActiveTab(item.id)}
          >
            <Icon size={24} color={isActive ? '#007AFF' : '#555'} />
            <Text style={[styles.label, { color: isActive ? '#007AFF' : '#555' }]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 0.5,
    borderTopColor: '#ccc',
    backgroundColor: '#fff',
  },
  button: {
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    marginTop: 2,
  },
});
export default BottomNavBar;