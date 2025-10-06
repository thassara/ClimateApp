import React from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import styles from '../../css/carbonFootprint/FootprintTabsScreen.styles';
import type { SuggestionLevel, Suggestion } from '../../types/carbonFootprint/FootprintTabsScreen';

interface FootprintResultCardProps {
  result: number;
  level: SuggestionLevel;
  suggestion: Suggestion;
}

const FootprintResultCard: React.FC<FootprintResultCardProps> = ({ result, level, suggestion }) => (
  <View style={styles.resultCard}>
    <Icon name={suggestion.icon} size={36} color={suggestion.color} style={{ marginBottom: 8 }} />
    <Text style={styles.resultValue}>{result.toFixed(2)} kg CO₂e</Text>
    <Text style={[styles.resultText, { color: suggestion.color }]}> 
      {suggestion.text}
    </Text>
  </View>
);

export default FootprintResultCard;
