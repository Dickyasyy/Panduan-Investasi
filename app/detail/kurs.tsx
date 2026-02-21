import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator } from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function DetailKurs() {
  const router = useRouter();

  const [rates, setRates] = useState<any>(null);
  const [history, setHistory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // State untuk Konversi
  const [amount, setAmount] = useState("1000000");
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [isIdrToForeign, setIsIdrToForeign] = useState(true); // Toggle Arah Konversi

  const targetCurrencies = ["USD", "EUR", "JPY", "SGD", "AUD", "GBP"];

  useEffect(() => {
    fetchData();
  }, [selectedCurrency]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const resLatest = await fetch("https://api.frankfurter.app/latest?from=IDR");
      const dataLatest = await resLatest.json();
      setRates(dataLatest.rates);

      const today = new Date().toISOString().split("T")[0];
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
      const resHistory = await fetch(`https://api.frankfurter.app/${sevenDaysAgo}..${today}?from=IDR&to=${selectedCurrency}`);
      const dataHistory = await resHistory.json();
      setHistory(dataHistory.rates);

      setLoading(false);
    } catch (e) {
      console.log("Gagal ambil data:", e);
      setLoading(false);
    }
  };

  // FUNGSI PENGAMAN toFixed
  const getSafeFixed = (val: any, decimals: number = 6) => {
    return (val && typeof val === 'number') ? val.toFixed(decimals) : "0.00";
  };

  // LOGIKA KONVERSI
  const calculateConversion = () => {
    const val = parseFloat(amount) || 0;
    const rate = rates ? rates[selectedCurrency] : 0;
    if (!rate) return 0;
    
    return isIdrToForeign ? val * rate : val / rate;
  };

  if (loading) {
    return (
      <View style={styles.loadingCenter}>
        <ActivityIndicator size="large" color="#0D47A1" />
        <Text style={{ marginTop: 10, color: "#666" }}>Menghubungkan ke Pasar Global...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
      <Stack.Screen options={{ headerShown: false }} />

      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={24} color="#0D47A1" />
      </TouchableOpacity>

      <View style={styles.headerSection}>
        <Text style={styles.emoji}>💸</Text>
        <Text style={styles.title}>Kurs Valas</Text>
        <Text style={styles.subtitle}>Edukasi & Konversi Mata Uang Dunia</Text>
      </View>

      {/* 1. PENGERTIAN */}
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Apa itu Kurs (Valas)?</Text>
        <Text style={styles.bodyText}>
          Kurs adalah nilai tukar mata uang satu negara terhadap negara lain. 
          Investasi Valas dilakukan dengan membeli mata uang asing saat murah dan menjualnya saat nilai tukarnya menguat terhadap Rupiah.
        </Text>
      </View>

      {/* 2. DAFTAR KURS */}
      <Text style={styles.sectionTitle}>Pilih Mata Uang</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.rateScroll}>
        {targetCurrencies.map((curr) => (
          <TouchableOpacity
            key={curr}
            style={[styles.rateCard, selectedCurrency === curr && styles.rateCardActive]}
            onPress={() => setSelectedCurrency(curr)}
          >
            <Text style={[styles.currText, selectedCurrency === curr && styles.whiteText]}>{curr}</Text>
            <Text style={[styles.valText, selectedCurrency === curr && styles.whiteText]}>
              {getSafeFixed(rates?.[curr], 4)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 3. KALKULATOR KONVERSI 2 ARAH */}
      <View style={styles.calcCard}>
        <View style={styles.calcHeaderRow}>
            <Text style={styles.calcTitle}>🔄 Kalkulator Konversi</Text>
            <TouchableOpacity onPress={() => setIsIdrToForeign(!isIdrToForeign)} style={styles.swapBtn}>
                <Ionicons name="swap-vertical" size={20} color="#0D47A1" />
            </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{isIdrToForeign ? "Dari Rupiah (IDR):" : `Dari Asing (${selectedCurrency}):`}</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
        </View>

        <View style={styles.resultBox}>
          <Text style={styles.resultLabel}>Estimasi Hasil ({isIdrToForeign ? selectedCurrency : "IDR"}):</Text>
          <Text style={styles.resultValue}>
            {isIdrToForeign ? "" : "Rp "}
            {calculateConversion().toLocaleString("id-ID", { maximumFractionDigits: 2 })}
            {isIdrToForeign ? ` ${selectedCurrency}` : ""}
          </Text>
        </View>
      </View>

      {/* 4. HISTORY */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, {marginTop: 20}]}>Tren 7 Hari (1 IDR ke {selectedCurrency})</Text>
        <View style={styles.historyContainer}>
          {history && Object.keys(history).map((date) => (
            <View key={date} style={styles.historyRow}>
              <Text style={styles.historyDate}>{date}</Text>
              <Text style={styles.historyValue}>{getSafeFixed(history[date][selectedCurrency], 6)}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 5. ANALISIS KEUNTUNGAN & RISIKO */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Analisis Valuta Asing</Text>
        <View style={styles.row}>
          {/* Sisi Keuntungan */}
          <View style={[styles.infoCard, { backgroundColor: "#E3F2FD", borderColor: "#BBDEFB" }]}>
            <Text style={[styles.infoTitle, { color: "#0D47A1" }]}>✅ Keuntungan</Text>
            <Text style={styles.infoBody}>• Lindung nilai (Hedging) kekayaan.</Text>
            <Text style={styles.infoBody}>• Persiapan dana sekolah/wisata LN.</Text>
            <Text style={styles.infoBody}>• Sangat likuid (mudah dicairkan).</Text>
          </View>

          {/* Sisi Risiko */}
          <View style={[styles.infoCard, { backgroundColor: "#FFEBEE", borderColor: "#FFCDD2" }]}>
            <Text style={[styles.infoTitle, { color: "#C62828" }]}>⚠️ Risiko</Text>
            <Text style={styles.infoBody}>• Selisih harga jual-beli (Spread).</Text>
            <Text style={styles.infoBody}>• Perubahan kebijakan politik dunia.</Text>
            <Text style={styles.infoBody}>• Nilai tukar yang sangat fluktuatif.</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA", padding: 20 },
  loadingCenter: { flex: 1, justifyContent: "center", alignItems: "center" },
  backBtn: { marginTop: 40 },
  headerSection: { alignItems: "center", marginVertical: 20 },
  emoji: { fontSize: 50 },
  title: { fontSize: 26, fontWeight: "bold", color: "#0D47A1" },
  subtitle: { fontSize: 13, color: "#666" },
  section: { marginBottom: 25 },
  infoSection: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", color: "#333", marginBottom: 10 },
  bodyText: { fontSize: 13, color: "#666", lineHeight: 20 },
  rateScroll: { marginBottom: 20 },
  rateCard: { backgroundColor: "#FFF", padding: 15, borderRadius: 15, marginRight: 10, width: 100, alignItems: "center", elevation: 2 },
  rateCardActive: { backgroundColor: "#0D47A1" },
  currText: { fontWeight: "bold", color: "#0D47A1" },
  valText: { fontSize: 10, color: "#999", marginTop: 5 },
  whiteText: { color: "#FFF" },
  calcCard: { backgroundColor: "#FFF", padding: 20, borderRadius: 20, elevation: 4 },
  calcHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  calcTitle: { fontSize: 16, fontWeight: "bold", color: "#0D47A1" },
  swapBtn: { backgroundColor: '#E3F2FD', padding: 8, borderRadius: 10 },
  inputGroup: { marginBottom: 15 },
  label: { fontSize: 12, color: "#888" },
  input: { borderBottomWidth: 2, borderBottomColor: "#0D47A1", fontSize: 22, fontWeight: "bold", paddingVertical: 5 },
  resultBox: { backgroundColor: "#E3F2FD", padding: 15, borderRadius: 15 },
  resultLabel: { fontSize: 11, color: "#0D47A1" },
  resultValue: { fontSize: 24, fontWeight: "bold", color: "#0D47A1", marginTop: 5 },
  historyContainer: { backgroundColor: "#FFF", padding: 15, borderRadius: 15, elevation: 2 },
  historyRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#F0F0F0" },
  historyDate: { fontSize: 12, color: "#666" },
  historyValue: { fontSize: 13, fontWeight: "bold", color: "#0D47A1" },
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    marginTop: 5 
  },
  infoCard: { 
    width: '48%', 
    padding: 12, 
    borderRadius: 15, 
    borderWidth: 1,
    elevation: 2 
  },
  infoTitle: { 
    fontWeight: 'bold', 
    fontSize: 12, 
    marginBottom: 8 
  },
  infoBody: { 
    fontSize: 10, 
    color: '#444', 
    lineHeight: 16, 
    marginBottom: 4 
  },
});