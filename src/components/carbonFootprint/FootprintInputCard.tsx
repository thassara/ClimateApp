import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import styles from '../../css/carbonFootprint/FootprintTabsScreen.styles';
import type { TabItem } from '../../types/carbonFootprint/FootprintTabsScreen';

interface FootprintInputCardProps {
  tab: TabItem;
  input: string;
  setInput: (input: string) => void;
  loading: boolean;
  onCalculate: () => void;
  onHistory: () => void;
}

const FootprintInputCard: React.FC<FootprintInputCardProps> = ({ tab, input, setInput, loading, onCalculate, onHistory }) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>Enter {tab?.label} usage</Text>
    <View style={styles.inputRow}>
      <Icon name={tab?.icon || "car"} size={32} color="#43A047" style={styles.inputIcon} />
      <TextInput
        style={styles.input}
        placeholder={tab.key === "electricity" ? "kWh used" : "km traveled"}
        keyboardType="numeric"
        value={input}
        onChangeText={setInput}
        placeholderTextColor="#A5D6A7"
      />
    </View>
    <TouchableOpacity style={styles.button} onPress={onCalculate} disabled={loading || !input}>
      <Text style={styles.buttonText}>{loading ? "Calculating..." : "Calculate"}</Text>
    </TouchableOpacity>
    <TouchableOpacity style={[styles.button, {backgroundColor: '#388E3C', marginTop: 8}]} onPress={onHistory}>
      <Text style={styles.buttonText}>View History</Text>
    </TouchableOpacity>
  </View>
);

export default FootprintInputCard;
