import React from 'react';
import { View, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from '../../css/carbonFootprint/CarbonFootprintScreen.styles';

interface Props {
  carKm: string;
  setCarKm: (v: string) => void;
  busKm: string;
  setBusKm: (v: string) => void;
  trainKm: string;
  setTrainKm: (v: string) => void;
  kwh: string;
  setKwh: (v: string) => void;
}

const CarbonFootprintInputForm: React.FC<Props> = ({ carKm, setCarKm, busKm, setBusKm, trainKm, setTrainKm, kwh, setKwh }) => (
  <>
    <View style={styles.inputRow}>
      <Icon name="car" size={28} color="#43A047" style={styles.inputIcon} />
      <TextInput
        style={styles.input}
        placeholder="Car (km driven)"
        keyboardType="numeric"
        value={carKm}
        onChangeText={setCarKm}
        placeholderTextColor="#A5D6A7"
      />
    </View>
    <View style={styles.inputRow}>
      <Icon name="bus" size={28} color="#1E88E5" style={styles.inputIcon} />
      <TextInput
        style={styles.input}
        placeholder="Bus (km traveled)"
        keyboardType="numeric"
        value={busKm}
        onChangeText={setBusKm}
        placeholderTextColor="#90CAF9"
      />
    </View>
    <View style={styles.inputRow}>
      <Icon name="train" size={28} color="#FBC02D" style={styles.inputIcon} />
      <TextInput
        style={styles.input}
        placeholder="Train (km traveled)"
        keyboardType="numeric"
        value={trainKm}
        onChangeText={setTrainKm}
        placeholderTextColor="#FFF59D"
      />
    </View>
    <View style={styles.inputRow}>
      <Icon name="flash" size={28} color="#FF7043" style={styles.inputIcon} />
      <TextInput
        style={styles.input}
        placeholder="Electricity (kWh used)"
        keyboardType="numeric"
        value={kwh}
        onChangeText={setKwh}
        placeholderTextColor="#FFAB91"
      />
    </View>
  </>
);

export default CarbonFootprintInputForm;
