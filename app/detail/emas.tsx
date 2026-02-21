import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function DetailEmas() {
  const router = useRouter();

  const [hargaEmas, setHargaEmas] = useState(0);
  const [inputGram, setInputGram] = useState("1");
  const [hasilBeli, setHasilBeli] = useState(0);
  const [hasilJual, setHasilJual] = useState(0);

  // Pecahan gram yang ingin ditampilkan
  const pecahanEmas = [0.5, 1, 2, 3, 5, 10];

  useEffect(() => {
    fetch("https://api.coingecko.com/api/v3/simple/price?ids=pax-gold&vs_currencies=idr")
      .then((res) => res.json())
      .then((data) => {
        const hargaDuniaPerGram = data["pax-gold"].idr / 31.1035;
        const estimasiAntam = hargaDuniaPerGram * 1.05; // Base price
        setHargaEmas(estimasiAntam);
        setHasilBeli(estimasiAntam); 
        setHasilJual(estimasiAntam * 0.89);
      })
      .catch(() => setHargaEmas(1400000));
  }, []);

  const hitungSimulasi = (val: string) => {
    setInputGram(val);
    const gram = parseFloat(val) || 0;
    setHasilBeli(gram * hargaEmas);
    setHasilJual(gram * (hargaEmas * 0.89));
  };

  // Fungsi menghitung harga pecahan (Pecahan kecil biasanya lebih mahal per gramnya)
  const getHargaPecahan = (gram: number) => {
    let multiplier = 1;
    if (gram === 0.5) multiplier = 1.08; // Lebih mahal 8% untuk biaya cetak 0.5gr
    else if (gram < 5) multiplier = 1.02;
    return Math.round(hargaEmas * gram * multiplier);
  };

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 80 }}
    >
      <Stack.Screen options={{ headerShown: false }} />

      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={24} color="#B8860B" />
      </TouchableOpacity>

      <View style={styles.headerSection}>
        <Text style={styles.emoji}>🌕</Text>
        <Text style={styles.title}>Emas (Gold)</Text>
        <Text style={styles.subtitle}>Logam Mulia & Safe Haven</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Apa itu Investasi Emas?</Text>
        <Text style={styles.bodyText}>
          Emas adalah aset <Text style={{fontWeight: 'bold'}}>Safe Haven</Text>, artinya nilainya cenderung stabil atau naik saat ekonomi global tidak menentu. 
          Investasi ini cocok untuk jangka panjang (di atas 5 tahun) sebagai pelindung nilai kekayaan dari inflasi.
        </Text>
      </View>

      <View style={styles.priceLiveCard}>
        <Text style={styles.liveLabel}>Estimasi Harga Antam (1 Gram)</Text>
        <Text style={styles.livePrice}>
          {hargaEmas > 0 ? `IDR ${Math.round(hargaEmas).toLocaleString("id-ID")}` : "Memuat..."}
        </Text>
        <Text style={styles.updateNote}>*Harga estimasi termasuk pajak & sertifikat</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>List Harga Pecahan Antam</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCellHeader}>Ukuran</Text>
            <Text style={styles.tableCellHeader}>Harga Estimasi</Text>
            <Text style={styles.tableCellHeader}>Per Gram</Text>
          </View>
          {pecahanEmas.map((gram) => (
            <View key={gram} style={styles.tableRow}>
              <Text style={styles.tableCell}>{gram} Gram</Text>
              <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>
                IDR {getHargaPecahan(gram).toLocaleString("id-ID")}
              </Text>
              <Text style={[styles.tableCell, { fontSize: 10, color: '#999' }]}>
                @{Math.round(getHargaPecahan(gram)/gram).toLocaleString("id-ID")}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.calcCard}>
        <Text style={styles.calcTitle}>🧮 Kalkulator Investasi</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Masukkan Jumlah Gram:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={inputGram}
            onChangeText={hitungSimulasi}
            placeholder="1"
          />
        </View>

        <View style={styles.simulationRow}>
          <View style={[styles.simBox, { borderLeftColor: "#028090" }]}>
            <Text style={styles.simLabel}>Harga Beli:</Text>
            <Text style={styles.simValue}>IDR {Math.round(hasilBeli).toLocaleString("id-ID")}</Text>
          </View>
          <View style={[styles.simBox, { borderLeftColor: "#c62828" }]}>
            <Text style={styles.simLabel}>Harga Jual (Back):</Text>
            <Text style={[styles.simValue, { color: "#c62828" }]}>IDR {Math.round(hasilJual).toLocaleString("id-ID")}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, {marginTop: 20}]}>Analisis Keuntungan & Risiko</Text>
        <View style={styles.row}>
          <View style={[styles.benefitCard, { backgroundColor: "#E8F5E9" }]}>
            <Ionicons name="checkmark-circle" size={18} color="green" />
            <Text style={styles.cardSmallTitle}>Keuntungan</Text>
            <Text style={styles.cardText}>Aman dari inflasi, liquid, dan aset fisik yang bisa digadaikan.</Text>
          </View>
          <View style={[styles.benefitCard, { backgroundColor: "#FFEBEE" }]}>
            <Ionicons name="close-circle" size={18} color="#c62828" />
            <Text style={styles.cardSmallTitle}>Risiko</Text>
            <Text style={styles.cardText}>Risiko kehilangan fisik dan adanya selisih harga (Spread) beli-jual.</Text>
          </View>
        </View>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFDF5", padding: 20 },
  backBtn: { marginTop: 40, marginBottom: 10 },
  headerSection: { alignItems: "center", marginBottom: 25 },
  emoji: { fontSize: 50 },
  title: { fontSize: 28, fontWeight: "bold", color: "#856404" },
  subtitle: { fontSize: 14, color: "#666" },

  priceLiveCard: { backgroundColor: "#D4AF37", padding: 20, borderRadius: 20, marginBottom: 25, elevation: 4 },
  liveLabel: { color: "#FFF", opacity: 0.9, fontSize: 12 },
  livePrice: { color: "#FFF", fontSize: 26, fontWeight: "bold", marginTop: 5 },
  updateNote: { color: "#FFF", fontSize: 10, marginTop: 5, fontStyle: "italic", opacity: 0.8 },

  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 10, color: "#333" },
  bodyText: { fontSize: 14, color: '#666', lineHeight: 22 },
  
  table: { borderWidth: 1, borderColor: "#EEE", borderRadius: 15, overflow: "hidden", backgroundColor: '#FFF' },
  tableRow: { flexDirection: "row", padding: 12, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  tableHeader: { backgroundColor: "#F9F5E8" },
  tableCellHeader: { flex: 1, fontWeight: "bold", fontSize: 12, color: "#856404" },
  tableCell: { flex: 1, fontSize: 12, color: "#555" },

  calcCard: { backgroundColor: "#FFF", padding: 20, borderRadius: 20, elevation: 3 },
  calcTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 15, color: "#856404" },
  label: { fontSize: 12, color: "#888", marginBottom: 5 },
  input: { borderBottomWidth: 1, borderBottomColor: "#D4AF37", fontSize: 20, fontWeight: "bold", paddingVertical: 5 },
  inputContainer: { marginBottom: 20 },
  
  simulationRow: { flexDirection: "row", justifyContent: "space-between", gap: 10 },
  simBox: { flex: 1, padding: 12, borderRadius: 10, borderLeftWidth: 4, borderWidth: 1, borderColor: "#F1F1F1" },
  simLabel: { fontSize: 10, color: "#666", fontWeight: "bold" },
  simValue: { fontSize: 14, fontWeight: "bold", color: "#D4AF37", marginVertical: 4 },

  row: { flexDirection: "row", justifyContent: "space-between" },
  benefitCard: { width: "48%", padding: 15, borderRadius: 15 },
  cardSmallTitle: { fontWeight: "bold", marginTop: 5, fontSize: 12, color: '#333' },
  cardText: { fontSize: 10, color: "#555", marginTop: 5, lineHeight: 14 },
});