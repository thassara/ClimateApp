import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Home, Map, Bell, Settings, Leaf, Newspaper } from 'lucide-react-native';

interface BottomNavBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function BottomNavBar({ activeTab, setActiveTab }: BottomNavBarProps) {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'Air Quality', icon: Map, label: 'Air Quality' },
    { id: 'Footprint', icon: Leaf, label: 'Footprint' },
    { id: 'alerts', icon: Bell, label: 'Alerts' },
    { id: 'settings', icon: Settings, label: 'Settings' },
    { id: 'news', icon: Newspaper, label: 'News' },
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
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 0.5,
    borderTopColor: '#ccc',
    backgroundColor: '#fff',
    width: '100%',
    minHeight: 60,
    // Responsive horizontal padding
    paddingHorizontal: 8,
  },
  button: {
    alignItems: 'center',
    flex: 1,
    minWidth: 60,
    maxWidth: 120,
    paddingVertical: 4,
    marginHorizontal: 2,
  },
  label: {
    fontSize: 13,
    marginTop: 2,
    textAlign: 'center',
    minWidth: 40,
    maxWidth: 100,
  },
});
export default BottomNavBar;