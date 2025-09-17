import * as React from "react";
import { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";

const CarbonFootprintCalculator = () => {
  const [carKm, setCarKm] = useState("");
  const [busKm, setBusKm] = useState("");
  const [trainKm, setTrainKm] = useState("");
  const [kwh, setKwh] = useState("");
  const [result, setResult] = useState<number | string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async () => {
    setLoading(true);
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
    try {
      const res = await fetch("http://localhost:5000/api/carbon-footprint/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setResult(data.carbonFootprint);
    } catch (err) {
      setResult("Error calculating footprint");
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Carbon Footprint Calculator</Text>
      <TextInput style={styles.input} placeholder="Car (km)" keyboardType="numeric" value={carKm} onChangeText={setCarKm} />
      <TextInput style={styles.input} placeholder="Bus (km)" keyboardType="numeric" value={busKm} onChangeText={setBusKm} />
      <TextInput style={styles.input} placeholder="Train (km)" keyboardType="numeric" value={trainKm} onChangeText={setTrainKm} />
      <TextInput style={styles.input} placeholder="Electricity (kWh)" keyboardType="numeric" value={kwh} onChangeText={setKwh} />
      <Button title={loading ? "Calculating..." : "Calculate"} onPress={handleCalculate} disabled={loading} />
      {result !== null && (
        <Text style={styles.result}>Carbon Footprint: {result} kg CO2e</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 8, marginBottom: 10, borderRadius: 5 },
  result: { marginTop: 20, fontSize: 18, color: "green" },
});

export default CarbonFootprintCalculator;
