import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { API_BASE_URL } from '@env';
import { fetchFootprintHistory } from '../../services/Awareness/footprintService';
import styles from '../../css/carbonFootprint/FootprintTabsScreen.styles';
import type { SuggestionLevel, TabItem, FootprintHistoryItem } from '../../types/carbonFootprint/FootprintTabsScreen';
import FootprintTabBar from '../../components/carbonFootprint/FootprintTabBar';
import FootprintInputCard from '../../components/carbonFootprint/FootprintInputCard';
import FootprintResultCard from '../../components/carbonFootprint/FootprintResultCard';
import FootprintHistoryCard from '../../components/carbonFootprint/FootprintHistoryCard';

const TABS: TabItem[] = [
  { key: "car", label: "Car", icon: "car" },
  { key: "van", label: "Van", icon: "van-utility" },
  { key: "bus", label: "Bus", icon: "bus" },
  { key: "train", label: "Train", icon: "train" },
  { key: "electricity", label: "Electricity", icon: "flash" },
];

const SUGGESTIONS = {
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
  const [history, setHistory] = useState<FootprintHistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

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
      const res = await fetch(`${API_BASE_URL}/api/carbon-footprint/calculate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setResult(data.carbonFootprint);
      setLevel(data.level);
    } catch (err) {
      setResult(-1);
      setLevel(null);
    }
    setLoading(false);
  };

  const loadHistory = async () => {
    try {
      const data = await fetchFootprintHistory();
      setHistory(data);
      setShowHistory(true);
    } catch (e) {
      setHistory([]);
      setShowHistory(true);
    }
  };

  const tab = TABS.find(t => t.key === activeTab)!;
  const suggestion = level ? SUGGESTIONS[level] : SUGGESTIONS.unknown;

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={{alignItems:'center', paddingBottom: 32}} showsVerticalScrollIndicator={false}>
        <FootprintTabBar tabs={TABS} activeTab={activeTab} setActiveTab={setActiveTab} setInput={setInput} setResult={setResult} />
        <FootprintInputCard tab={tab} input={input} setInput={setInput} loading={loading} onCalculate={handleCalculate} onHistory={loadHistory} />
        {result !== null && result !== -1 && level && (
          <FootprintResultCard result={result} level={level} suggestion={suggestion} />
        )}
        {showHistory && (
          <FootprintHistoryCard history={history} onClose={() => setShowHistory(false)} />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
