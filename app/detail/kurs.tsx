import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function DetailKurs() {
  const router = useRouter();

  const [rates, setRates] = useState<any>(null);
  const [history, setHistory] = useState<any>(null); // State untuk pergerakan
  const [loading, setLoading] = useState(true);
  const [amountIDR, setAmountIDR] = useState("1000000");
  const [selectedCurrency, setSelectedCurrency] = useState("USD");

  const targetCurrencies = ["USD", "EUR", "JPY", "SGD", "AUD", "GBP"];

  useEffect(() => {
    fetchData();
  }, [selectedCurrency]);

  const fetchData = async () => {
    try {
      // 1. Ambil kurs terbaru (Real-time harian)
      const resLatest = await fetch(
        "https://api.frankfurter.app/latest?from=IDR"
      );
      const dataLatest = await resLatest.json();
      setRates(dataLatest.rates);

      // 2. Ambil pergerakan 7 hari terakhir (Historical Data)
      const today = new Date().toISOString().split("T")[0];
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];

      const resHistory = await fetch(
        `https://api.frankfurter.app/${sevenDaysAgo}..${today}?from=IDR&to=${selectedCurrency}`
      );
      const dataHistory = await resHistory.json();
      setHistory(dataHistory.rates);

      setLoading(false);
    } catch (e) {
      console.log("Gagal ambil data:", e);
      setLoading(false);
    }
  };

  const convertResult =
    rates && rates[selectedCurrency]
      ? (parseFloat(amountIDR) || 0) * rates[selectedCurrency]
      : 0;

  if (loading) {
    return (
      <View style={styles.loadingCenter}>
        <ActivityIndicator size="large" color="#0D47A1" />
        <Text style={{ marginTop: 10, color: "#666" }}>
          Menghubungkan ke Pasar Global...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 60 }}
    >
      <Stack.Screen options={{ headerShown: false }} />

      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={24} color="#0D47A1" />
      </TouchableOpacity>

      <View style={styles.headerSection}>
        <Text style={styles.emoji}>💸💰</Text>
        <Text style={styles.title}>Live Exchange Rate</Text>
        <Text style={styles.subtitle}>
          Data terupdate langsung dari Bank Sentral Eropa
        </Text>
      </View>

      {/* 1. SELEKSI MATA UANG & PERGERAKAN */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Pergerakan 7 Hari Terakhir ({selectedCurrency})
        </Text>
        <View style={styles.historyContainer}>
          {history &&
            Object.keys(history).map((date) => (
              <View key={date} style={styles.historyRow}>
                <Text style={styles.historyDate}>{date}</Text>
                <Text style={styles.historyValue}>
                  1 IDR = {history[date][selectedCurrency].toFixed(6)}
                </Text>
              </View>
            ))}
          <Text style={styles.noteText}>
            *Data diperbarui setiap hari kerja (Real-time harian)
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Pilih Mata Uang Global</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.rateScroll}
      >
        {targetCurrencies.map((curr) => (
          <TouchableOpacity
            key={curr}
            style={[
              styles.rateCard,
              selectedCurrency === curr && styles.rateCardActive,
            ]}
            onPress={() => setSelectedCurrency(curr)}
          >
            <Text
              style={[
                styles.currText,
                selectedCurrency === curr && styles.whiteText,
              ]}
            >
              {curr}
            </Text>
            <Text
              style={[
                styles.valText,
                selectedCurrency === curr && styles.whiteText,
              ]}
            >
              {rates[curr]?.toFixed(6)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 2. KALKULATOR */}
      <View style={styles.calcCard}>
        <Text style={styles.calcTitle}>🔄 Simulasi Konversi</Text>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Input Rupiah (IDR):</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={amountIDR}
            onChangeText={setAmountIDR}
          />
        </View>

        <View style={styles.resultBox}>
          <Text style={styles.resultLabel}>
            Anda menerima estimasi ({selectedCurrency}):
          </Text>
          <Text style={styles.resultValue}>
            {selectedCurrency}{" "}
            {convertResult.toLocaleString("en-US", {
              maximumFractionDigits: 4,
            })}
          </Text>
        </View>
      </View>

      <View style={{ height: 50 }} />

      {/* 3. ANALISIS KEUNTUNGAN & KERUGIAN */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Analisis Risiko & Potensi</Text>
        <View style={styles.row}>
          {/* Sisi Keuntungan */}
          <View style={[styles.benefitCard, { backgroundColor: "#E3F2FD" }]}>
            <View style={styles.cardHeader}>
              <Ionicons name="shield-checkmark" size={18} color="#0D47A1" />
              <Text style={[styles.cardTitle, { color: "#0D47A1" }]}>
                Manfaat
              </Text>
            </View>
            <Text style={styles.cardBody}>• Lindung Nilai (Hedging)</Text>
            <Text style={styles.cardBody}>• Persiapan Biaya Luar Negeri</Text>
            <Text style={styles.cardBody}>• Likuiditas Sangat Tinggi</Text>
          </View>

          {/* Sisi Kerugian */}
          <View style={[styles.benefitCard, { backgroundColor: "#FBE9E7" }]}>
            <View style={styles.cardHeader}>
              <Ionicons name="alert-circle" size={18} color="#D84315" />
              <Text style={[styles.cardTitle, { color: "#D84315" }]}>
                Risiko
              </Text>
            </View>
            <Text style={styles.cardBody}>• Selisih Kurs Beli & Jual</Text>
            <Text style={styles.cardBody}>• Inflasi Mata Uang Terkait</Text>
            <Text style={styles.cardBody}>• Ketidakpastian Politik</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F0F2F5", padding: 20 },
  loadingCenter: { flex: 1, justifyContent: "center", alignItems: "center" },
  backBtn: { marginTop: 40, marginBottom: 10 },
  headerSection: { alignItems: "center", marginBottom: 25 },
  emoji: { fontSize: 50, marginBottom: 5 },
  title: { fontSize: 26, fontWeight: "bold", color: "#0D47A1" },
  subtitle: { fontSize: 13, color: "#666", textAlign: "center" },

  section: { marginBottom: 25 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },

  historyContainer: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 15,
    elevation: 2,
  },
  historyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  historyDate: { fontSize: 12, color: "#666" },
  historyValue: { fontSize: 13, fontWeight: "bold", color: "#0D47A1" },
  noteText: { fontSize: 10, color: "#999", marginTop: 10, fontStyle: "italic" },

  rateScroll: { flexDirection: "row", marginBottom: 25 },
  rateCard: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 15,
    marginRight: 10,
    width: 100,
    alignItems: "center",
    elevation: 2,
  },
  rateCardActive: { backgroundColor: "#0D47A1" },
  currText: { fontWeight: "bold", fontSize: 14, color: "#0D47A1" },
  valText: { fontSize: 11, color: "#666", marginTop: 5 },
  whiteText: { color: "#FFF" },

  calcCard: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 20,
    elevation: 4,
  },
  calcTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#0D47A1",
  },
  inputGroup: { marginBottom: 15 },
  label: { fontSize: 12, color: "#888", marginBottom: 5 },
  input: {
    borderBottomWidth: 2,
    borderBottomColor: "#0D47A1",
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    paddingVertical: 5,
  },
  resultBox: {
    backgroundColor: "#E3F2FD",
    padding: 20,
    borderRadius: 15,
    marginTop: 10,
  },
  resultLabel: { fontSize: 12, color: "#0D47A1", fontWeight: "500" },
  resultValue: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#0D47A1",
    marginTop: 5,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  benefitCard: {
    width: "48%",
    padding: 12,
    borderRadius: 15,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 13,
    marginLeft: 5,
  },
  cardBody: {
    fontSize: 10,
    color: "#444",
    lineHeight: 16,
    marginBottom: 2,
  },
});
