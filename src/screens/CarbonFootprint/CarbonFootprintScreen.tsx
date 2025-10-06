import React, { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";
import styles from '../../css/carbonFootprint/CarbonFootprintScreen.styles';
import type { CarbonFootprintInputs } from '../../types/carbonFootprint/CarbonFootprintScreen';
import CarbonFootprintInputForm from '../../components/carbonFootprint/CarbonFootprintInputForm';
import CarbonFootprintResultCard from '../../components/carbonFootprint/CarbonFootprintResultCard';

export default function CarbonFootprintScreen() {
  const [carKm, setCarKm] = useState("");
  const [busKm, setBusKm] = useState("");
  const [trainKm, setTrainKm] = useState("");
  const [kwh, setKwh] = useState("");
  const [result, setResult] = useState<null | number>(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async () => {
    setLoading(true);
    setResult(null);
    try {
      const payload = {
        transportation: {
          carKm: Number(carKm) || 0,
          busKm: Number(busKm) || 0,
          trainKm: Number(trainKm) || 0,
        },
        electricity: {
          kwh: Number(kwh) || 0,
        },
      };
      const res = await fetch("http://10.142.132.7:5000/api/carbon-footprint/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setResult(data.carbonFootprint);
    } catch (err) {
      setResult(-1);
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={styles.headerBox}>
        {/* You can add a header icon here if desired */}
        <Text style={styles.title}>Carbon Footprint Calculator</Text>
        <Text style={styles.subtitle}>Calculate your impact and get eco tips 🌍</Text>
      </View>
      <View style={styles.card}>
        <CarbonFootprintInputForm
          carKm={carKm} setCarKm={setCarKm}
          busKm={busKm} setBusKm={setBusKm}
          trainKm={trainKm} setTrainKm={setTrainKm}
          kwh={kwh} setKwh={setKwh}
        />
        <TouchableOpacity style={styles.button} onPress={handleCalculate} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Calculate</Text>}
        </TouchableOpacity>
        {result !== null && (
          <CarbonFootprintResultCard result={result} />
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

