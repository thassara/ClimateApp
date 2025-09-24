import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

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
        <Icon name="leaf" size={40} color="#43A047" style={{ marginBottom: 8 }} />
        <Text style={styles.title}>Carbon Footprint Calculator</Text>
        <Text style={styles.subtitle}>Calculate your impact and get eco tips 🌍</Text>
      </View>
      <View style={styles.card}>
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
        <TouchableOpacity style={styles.button} onPress={handleCalculate} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Calculate</Text>}
        </TouchableOpacity>
        {result !== null && (
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
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E8F5E9", justifyContent: "center", alignItems: "center" },
  headerBox: { alignItems: "center", marginBottom: 10 },
  title: { fontSize: 28, fontWeight: "bold", color: "#388E3C" },
  subtitle: { fontSize: 16, color: "#388E3C", marginBottom: 10 },
  card: { backgroundColor: "#fff", borderRadius: 24, padding: 24, width: "92%", shadowColor: "#388E3C", shadowOpacity: 0.15, shadowRadius: 12, elevation: 8 },
  inputRow: { flexDirection: "row", alignItems: "center", marginBottom: 18, backgroundColor: "#F1F8E9", borderRadius: 12, paddingHorizontal: 10 },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, fontSize: 18, color: "#388E3C", paddingVertical: 8 },
  button: { backgroundColor: "#43A047", borderRadius: 12, padding: 14, alignItems: "center", marginTop: 10, shadowColor: "#388E3C", shadowOpacity: 0.2, shadowRadius: 4, elevation: 2 },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 20 },
  resultCard: { marginTop: 24, alignItems: "center", backgroundColor: "#E0F2F1", borderRadius: 18, padding: 18 },
  resultText: { fontSize: 20, color: "#388E3C", marginTop: 8 },
  resultValue: { fontSize: 32, fontWeight: "bold", color: "#43A047", marginVertical: 6 },
  resultTip: { fontSize: 16, color: "#388E3C", marginTop: 10, textAlign: "center" },
  resultError: { color: "#E53935", fontSize: 18, fontWeight: "bold" },
});
