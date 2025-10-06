import React from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from '../../css/carbonFootprint/CarbonFootprintScreen.styles';

interface Props {
  result: number;
}

const CarbonFootprintResultCard: React.FC<Props> = ({ result }) => (
  <View style={styles.resultCard}>
    {result === -1 ? (
      <Text style={styles.resultError}>Error calculating footprint</Text>
    ) : (
      <>
        <Icon name="earth" size={36} color="#43A047" style={{ marginBottom: 8 }} />
        <Text style={styles.resultText}>Your Carbon Footprint:</Text>
        <Text style={styles.resultValue}>{result.toFixed(2)} kg CO₂e</Text>
        <Text style={styles.resultTip}>🌱 Tip: Use public transport, save energy, and plant trees!</Text>
      </>
    )}
  </View>
);

export default CarbonFootprintResultCard;
