import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, KeyboardAvoidingView, Animated } from "react-native";
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

const TABS = [
  { key: "car", label: "Car", icon: "car" },
  { key: "van", label: "Van", icon: "van-utility" },
  { key: "bus", label: "Bus", icon: "bus" },
  { key: "train", label: "Train", icon: "train" },
  { key: "electricity", label: "Electricity", icon: "flash" },
];

type SuggestionLevel = "high" | "middle" | "low";

const SUGGESTIONS: Record<SuggestionLevel | "unknown", { text: string; color: string; icon: string }> = {
  high: { text: "Your footprint is high! Try carpooling, public transport, or saving energy.", color: "#E53935", icon: "alert" },
  middle: { text: "Your footprint is moderate. Good job, but you can do even better!", color: "#FBC02D", icon: "emoticon-neutral" },
  low: { text: "Excellent! Your footprint is low. Keep up the eco-friendly habits!", color: "#43A047", icon: "emoticon-happy" },
  unknown: { text: "Calculation complete. Please try to reduce your footprint!", color: "#607D8B", icon: "leaf" },
};

export default function FootprintTabsScreen() {
  const [activeTab, setActiveTab] = useState("car");
  const [level, setLevel] = useState<SuggestionLevel | null>(null);
  const [result, setResult] = useState<null | number>(null);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  const showModalWithAnimation = () => {
    setModalVisible(true);
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const handleCalculate = async () => {
    setLoading(true);
    let payload: any = {};
    if (activeTab === "electricity") {
      payload.electricity = { kwh: Number(input) || 0 };
    } else {
      payload.transportation = {};
      payload.transportation[`${activeTab}Km`] = Number(input) || 0;
    }
    try {
      console.log('Sending:', payload);
      const res = await fetch("http://10.142.132.7:5000/api/carbon-footprint/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      console.log('Received:', data);
      setResult(data.carbonFootprint);
      setLevel(data.level);
    } catch (err) {
      setResult(-1);
      setLevel(null);
    }
    setLoading(false);
  };

  const tab = TABS.find(t => t.key === activeTab);
  const suggestion = level ? SUGGESTIONS[level] : null;

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={styles.tabBar}>
        {TABS.map(t => (
          <TouchableOpacity key={t.key} style={[styles.tab, activeTab === t.key && styles.tabActive]} onPress={() => { setActiveTab(t.key); setInput(""); setResult(null); }}>
            <Icon name={t.icon} size={28} color={activeTab === t.key ? "#43A047" : "#888"} />
            <Text style={[styles.tabLabel, activeTab === t.key && styles.tabLabelActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Enter {tab?.label} usage</Text>
        <View style={styles.inputRow}>
          <Icon name={tab?.icon || "car"} size={32} color="#43A047" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder={activeTab === "electricity" ? "kWh used" : "km traveled"}
            keyboardType="numeric"
            value={input}
            onChangeText={setInput}
            placeholderTextColor="#A5D6A7"
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleCalculate} disabled={loading || !input}>
          <Text style={styles.buttonText}>{loading ? "Calculating..." : "Calculate"}</Text>
        </TouchableOpacity>
      </View>
      {result !== null && result !== -1 && (
        <View style={styles.resultCard}>
          <Icon name={suggestion?.icon || "leaf"} size={36} color={suggestion?.color || "#43A047"} style={{ marginBottom: 8 }} />
          <Text style={styles.resultValue}>{result.toFixed(2)} kg CO₂e</Text>
          <Text style={[styles.resultText, { color: suggestion?.color }]}> 
            {level && SUGGESTIONS[level] ? SUGGESTIONS[level].text : SUGGESTIONS["unknown"].text}
          </Text>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E8F5E9", justifyContent: "flex-start", alignItems: "center" },
  tabBar: { flexDirection: "row", justifyContent: "space-around", width: "100%", backgroundColor: "#fff", paddingVertical: 12, borderBottomWidth: 1, borderColor: "#C8E6C9" },
  tab: { alignItems: "center", flex: 1, paddingVertical: 6 },
  tabActive: { borderBottomWidth: 3, borderColor: "#43A047" },
  tabLabel: { fontSize: 14, color: "#888", marginTop: 2 },
  tabLabelActive: { color: "#43A047", fontWeight: "bold" },
  card: { backgroundColor: "#fff", borderRadius: 24, padding: 24, width: "92%", marginTop: 24, shadowColor: "#388E3C", shadowOpacity: 0.15, shadowRadius: 12, elevation: 8 },
  cardTitle: { fontSize: 20, fontWeight: "bold", color: "#388E3C", marginBottom: 10 },
  inputRow: { flexDirection: "row", alignItems: "center", marginBottom: 18, backgroundColor: "#F1F8E9", borderRadius: 12, paddingHorizontal: 10 },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, fontSize: 18, color: "#388E3C", paddingVertical: 8 },
  button: { backgroundColor: "#43A047", borderRadius: 12, padding: 14, alignItems: "center", marginTop: 10, shadowColor: "#388E3C", shadowOpacity: 0.2, shadowRadius: 4, elevation: 2 },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 20 },
  resultValue: { fontSize: 32, fontWeight: "bold", color: "#43A047", marginVertical: 6 },
  resultText: { fontSize: 16, marginTop: 10, textAlign: "center" },
  resultError: { color: "#E53935", fontSize: 18, fontWeight: "bold" },
  closeBtn: { marginTop: 18, backgroundColor: "#43A047", borderRadius: 8, paddingVertical: 8, paddingHorizontal: 24 },
  closeBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 22,
    marginTop: 18,
    alignItems: 'center',
    width: '92%',
    shadowColor: '#388E3C',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
});


