import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../../css/carbonFootprint/FootprintTabsScreen.styles';
import type { FootprintHistoryItem } from '../../types/carbonFootprint/FootprintTabsScreen';

interface FootprintHistoryCardProps {
  history: FootprintHistoryItem[];
  onClose: () => void;
}

const FootprintHistoryCard: React.FC<FootprintHistoryCardProps> = ({ history, onClose }) => (
  <View style={styles.historyCard}>
    <Text style={{fontWeight:'bold', fontSize:18, marginBottom:8}}>Calculation History</Text>
    {history.length === 0 ? (
      <Text style={{color:'#888'}}>No records found.</Text>
    ) : (
      history.map((item, idx) => (
        <View key={item._id || idx} style={{marginBottom:10, borderBottomWidth:1, borderColor:'#E0E0E0', paddingBottom:6}}>
          <Text style={{fontSize:15}}>
            {item.createdAt ? new Date(item.createdAt).toLocaleString() : ''} - {item.total?.toFixed(2)} kg CO₂e ({item.level})
          </Text>
          {item.transportation && (
            <Text style={{fontSize:13, color:'#388E3C'}}>Transport: {Object.entries(item.transportation).map(([k,v])=>`${k.replace('Km','')}: ${v}`).join(', ')}</Text>
          )}
          {item.electricity && item.electricity.kwh && (
            <Text style={{fontSize:13, color:'#388E3C'}}>Electricity: {item.electricity.kwh} kWh</Text>
          )}
        </View>
      ))
    )}
    <TouchableOpacity style={[styles.button, {backgroundColor:'#E53935', marginTop:8}]} onPress={onClose}>
      <Text style={styles.buttonText}>Close History</Text>
    </TouchableOpacity>
  </View>
);

export default FootprintHistoryCard;
