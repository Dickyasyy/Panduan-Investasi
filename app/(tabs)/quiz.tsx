import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  TextInput,
  Dimensions,
  KeyboardAvoidingView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "../../components/theme";

const { width } = Dimensions.get("window");

const GOALS = [
  { id: "rumah", title: "Rumah Impian", icon: "home", color: "#FF5722", desc: "DP & Cicilan" },
  { id: "sekolah", title: "Pendidikan", icon: "school", color: "#2196F3", desc: "Dana Sekolah" },
  { id: "liburan", title: "Liburan", icon: "airplane", color: "#00BCD4", desc: "Travel & Healing" },
  { id: "kendaraan", title: "Kendaraan", icon: "car", color: "#4CAF50", desc: "Mobil/Motor" },
  { id: "pensiun", title: "Masa Tua", icon: "umbrella", color: "#9C27B0", desc: "Dana Pensiun" },
  { id: "gadget", title: "Gadget", icon: "laptop", color: "#607D8B", desc: "Upgrade Device" },
];

export default function QuizScreen() {
  const { theme } = useAppTheme();
  const [selectedGoal, setSelectedGoal] = useState<any>(null);
  const [targetAmount, setTargetAmount] = useState("");
  const [years, setYears] = useState(5);
  const [showResult, setShowResult] = useState(false);

  const resetQuiz = () => {
    setSelectedGoal(null);
    setTargetAmount("");
    setYears(5);
    setShowResult(false);
  };

  const getResult = () => {
    const rawAmount = targetAmount.replace(/[^0-9]/g, "");
    const amount = parseInt(rawAmount) || 0;
    const monthlySave = Math.round(amount / (years * 12));

    if (years <= 2) {
      return {
        type: "Aman & Likuid",
        rec: "Bank Digital & RDPU",
        reason: "Jangka pendek membutuhkan keamanan dana tinggi agar tidak berkurang saat ingin dipakai.",
        allocation: [{ name: "Tabungan", p: "70%" }, { name: "Pasar Uang", p: "30%" }],
        monthly: monthlySave,
        icon: "shield-checkmark",
        color: "#009688",
      };
    } else if (years <= 5) {
      return {
        type: "Pertumbuhan Stabil",
        rec: "Emas & Obligasi",
        reason: "Cocok untuk jangka menengah guna menjaga nilai uang dari gerusan inflasi.",
        allocation: [{ name: "Emas", p: "50%" }, { name: "Obligasi", p: "50%" }],
        monthly: monthlySave,
        icon: "trending-up",
        color: "#D4AF37",
      };
    } else {
      return {
        type: "Profit Maksimal",
        rec: "Saham & Crypto",
        reason: "Jangka panjang memungkinkan Anda melewati volatilitas pasar untuk profit lebih besar.",
        allocation: [{ name: "Saham", p: "70%" }, { name: "Bluechip", p: "20%" }, { name: "Crypto", p: "10%" }],
        monthly: monthlySave,
        icon: "rocket",
        color: "#F44336",
      };
    }
  };

  // 1. DASHBOARD (Hanya Grid Impian)
  if (!selectedGoal) {
    return (
      <View style={[styles.mainContainer, { backgroundColor: theme.background }]}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          <View style={styles.headerBag}>
            <Text style={[styles.headerTitle, { color: theme.text }]}>Wujudkan{"\n"}Impianmu 🚀</Text>
            <Text style={[styles.headerSub, { color: theme.subText }]}>Pilih target keuangan yang ingin kamu capai.</Text>
          </View>

          <View style={styles.gridContainer}>
            {GOALS.map((goal) => (
              <TouchableOpacity
                key={goal.id}
                style={[styles.goalCard, { backgroundColor: theme.card, borderColor: theme.border }]}
                onPress={() => setSelectedGoal(goal)}
              >
                <View style={[styles.iconBox, { backgroundColor: goal.color + "15" }]}>
                  <Ionicons name={goal.icon as any} size={28} color={goal.color} />
                </View>
                <Text style={[styles.goalTitleGrid, { color: theme.text }]}>{goal.title}</Text>
                <Text style={[styles.goalDescGrid, { color: theme.subText }]}>{goal.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }

  // 2. HASIL AKHIR
  if (showResult) {
    const result = getResult();
    return (
      <ScrollView style={[styles.mainContainer, { backgroundColor: theme.background }]}>
        <View style={styles.resultPadding}>
          <View style={[styles.resultBox, { backgroundColor: theme.card }]}>
            <View style={[styles.iconCircleResult, { backgroundColor: result.color + "15" }]}>
              <Ionicons name={result.icon as any} size={50} color={result.color} />
            </View>
            <Text style={[styles.resType, { color: theme.text }]}>Strategi {result.type}</Text>
            <Text style={[styles.resReason, { color: theme.subText }]}>{result.reason}</Text>

            <View style={[styles.monthlyCard, { backgroundColor: theme.background }]}>
              <Text style={styles.monthlyLabel}>Estimasi Menabung / Bulan</Text>
              <Text style={[styles.monthlyValue, { color: theme.tint }]}>Rp {result.monthly.toLocaleString("id-ID")}</Text>
            </View>

            <View style={styles.allocationSection}>
              <Text style={[styles.allocTitle, { color: theme.text }]}>Alokasi Portofolio:</Text>
              {result.allocation.map((item, idx) => (
                <View key={idx} style={styles.allocRow}>
                  <Text style={[styles.allocName, { color: theme.text }]}>{item.name}</Text>
                  <View style={[styles.allocBarBg, { backgroundColor: theme.border }]}>
                    <View style={[styles.allocBarFill, { width: item.p as any, backgroundColor: result.color }]} />
                  </View>
                  <Text style={[styles.allocPercent, { color: theme.subText }]}>{item.p}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity style={[styles.mainBtn, { backgroundColor: theme.tint, width: "100%", marginTop: 25 }]} onPress={resetQuiz}>
              <Text style={styles.mainBtnText}>Coba Target Lain</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }

  // 3. INPUT SIMULASI
  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <ScrollView style={[styles.mainContainer, { backgroundColor: theme.background }]}>
        <View style={styles.headerBag}>
          <TouchableOpacity onPress={() => setSelectedGoal(null)} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text, marginTop: 15 }]}>{selectedGoal.title}</Text>
          <Text style={[styles.headerSub, { color: theme.subText }]}>Berapa target dana yang ingin kamu kumpulkan?</Text>
        </View>

        <View style={styles.formPadding}>
          <View style={[styles.inputContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.inputLabel, { color: theme.subText }]}>Target Dana (IDR)</Text>
            <TextInput
              style={[styles.textInput, { color: theme.text }]}
              placeholder="100000000"
              placeholderTextColor={theme.subText}
              keyboardType="numeric"
              value={targetAmount}
              onChangeText={setTargetAmount}
            />
          </View>

          <Text style={[styles.sectionTitle, { color: theme.text }]}>Dalam Berapa Tahun?</Text>
          <View style={styles.yearsRow}>
            {[1, 3, 5, 10].map((y) => (
              <TouchableOpacity
                key={y}
                onPress={() => setYears(y)}
                style={[styles.yearChip, { backgroundColor: years === y ? theme.tint : theme.card, borderColor: theme.border }]}
              >
                <Text style={{ color: years === y ? "#fff" : theme.text, fontWeight: "bold" }}>{y} Thn</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.mainBtn, { backgroundColor: theme.tint, opacity: targetAmount ? 1 : 0.5 }]}
            onPress={() => targetAmount && setShowResult(true)}
            disabled={!targetAmount}
          >
            <Text style={styles.mainBtnText}>Lihat Strategi Investasi</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1 },
  headerBag: { paddingHorizontal: 25, marginTop: Platform.OS === "ios" ? 60 : 40, marginBottom: 20 },
  headerTitle: { fontSize: 32, fontWeight: "900", lineHeight: 38 },
  headerSub: { fontSize: 14, marginTop: 8, opacity: 0.7 },
  backButton: { width: 40, height: 40, justifyContent: 'center' },

  gridContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", paddingHorizontal: 20 },
  goalCard: {
    width: "48%",
    aspectRatio: 1,
    padding: 15,
    borderRadius: 24,
    marginBottom: 15,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 4,
  },
  iconBox: { width: 55, height: 55, borderRadius: 18, justifyContent: "center", alignItems: "center", marginBottom: 10 },
  goalTitleGrid: { fontSize: 15, fontWeight: "800", textAlign: "center" },
  goalDescGrid: { fontSize: 11, textAlign: "center", marginTop: 4, opacity: 0.6 },

  formPadding: { paddingHorizontal: 25 },
  inputContainer: { padding: 20, borderRadius: 24, borderWidth: 1, marginBottom: 25 },
  inputLabel: { fontSize: 11, fontWeight: "bold", marginBottom: 8, textTransform: "uppercase" },
  textInput: { fontSize: 24, fontWeight: "bold" },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 15 },
  yearsRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 35 },
  yearChip: { paddingVertical: 12, borderRadius: 15, borderWidth: 1, width: "22%", alignItems: "center" },
  mainBtn: { padding: 20, borderRadius: 22, alignItems: "center" },
  mainBtnText: { color: "white", fontWeight: "bold", fontSize: 16 },

  resultPadding: { padding: 25, paddingTop: 60 },
  resultBox: { padding: 30, borderRadius: 35, alignItems: "center", elevation: 5 },
  iconCircleResult: { width: 90, height: 90, borderRadius: 45, justifyContent: "center", alignItems: "center", marginBottom: 15 },
  resType: { fontSize: 24, fontWeight: "900" },
  resReason: { textAlign: "center", fontSize: 14, marginTop: 10, opacity: 0.7, lineHeight: 22 },
  monthlyCard: { width: "100%", padding: 20, borderRadius: 22, marginVertical: 25, alignItems: "center" },
  monthlyLabel: { fontSize: 12, fontWeight: "bold", color: '#888' },
  monthlyValue: { fontSize: 22, fontWeight: "900", marginTop: 5 },

  allocationSection: { width: "100%" },
  allocTitle: { fontSize: 15, fontWeight: "bold", marginBottom: 15 },
  allocRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  allocName: { width: 85, fontSize: 12, fontWeight: "600" },
  allocBarBg: { flex: 1, height: 8, borderRadius: 4, marginHorizontal: 10, overflow: "hidden" },
  allocBarFill: { height: "100%", borderRadius: 4 },
  allocPercent: { width: 35, fontSize: 12, fontWeight: "bold", textAlign: "right" },
});