import { StyleSheet } from 'react-native';

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

export default styles;
