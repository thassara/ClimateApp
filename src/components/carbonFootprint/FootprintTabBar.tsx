import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import type { TabItem } from '../../types/carbonFootprint/FootprintTabsScreen';
import styles from '../../css/carbonFootprint/FootprintTabsScreen.styles';

interface FootprintTabBarProps {
  tabs: TabItem[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setInput: (input: string) => void;
  setResult: (result: number | null) => void;
}

const FootprintTabBar: React.FC<FootprintTabBarProps> = ({ tabs, activeTab, setActiveTab, setInput, setResult }) => (
  <View style={styles.tabBar}>
    {tabs.map(t => (
      <TouchableOpacity
        key={t.key}
        style={[styles.tab, activeTab === t.key && styles.tabActive]}
        onPress={() => { setActiveTab(t.key); setInput(''); setResult(null); }}
      >
        <Icon name={t.icon} size={28} color={activeTab === t.key ? "#43A047" : "#888"} />
        <Text style={[styles.tabLabel, activeTab === t.key && styles.tabLabelActive]}>{t.label}</Text>
      </TouchableOpacity>
    ))}
  </View>
);

export default FootprintTabBar;
