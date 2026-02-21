import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const DATA_BANK = {
  SeaBank: {
    tabungan: 3.75,
    deposito: 6.0,
    color: "#FFE0B2",
    desc: "Bahagian daripada Sea Group (Shopee). Terkenal dengan bunga tabungan yang cair setiap hari dan integrasi ekosistem e-commerce yang kuat.",
    plus: [
      "Bunga tabungan cair setiap hari",
      "Transfer percuma tanpa had",
      "Integrasi sangat mudah dengan Shopee",
    ],
    minus: [
      "Tiada kad fizikal",
      "Antara muka (UI) aplikasi agak sesak",
      "Fitur perbankan masih asas",
    ],
  },
  "blu by BCA": {
    tabungan: 3.0,
    deposito: 4.75,
    color: "#E3F2FD",
    desc: "Aplikasi perbankan digital daripada BCA. Menawarkan keselamatan tahap bank konvensional dengan kemudahan digital sepenuhnya.",
    plus: [
      "Keselamatan terjamin (BCA Group)",
      "Boleh tarik tunai tanpa kad di ATM BCA",
      'Fitur bajet "bluSaving" yang kemas',
    ],
    minus: [
      "Bunga tidak setinggi pesaing lain",
      "Minimal deposit agak tinggi",
      "Proses pendaftaran memerlukan video call",
    ],
  },
  "Bank Jago": {
    tabungan: 3.25,
    deposito: 5.25,
    color: "#FFF9C4",
    desc: 'Bank digital yang fokus pada kolaborasi. Sangat unik dengan sistem "Kantong" untuk mengasingkan wang belanja dan simpanan.',
    plus: [
      "Integrasi penuh dengan Gojek/Tokopedia",
      "Tiada denda untuk pencairan deposito awal",
      'Pilihan "Kantong" yang sangat fleksibel',
    ],
    minus: [
      "Bunga tabungan biasa rendah",
      "Perlu baki tinggi untuk akaun tahap elit",
      "Promo sudah mula berkurangan",
    ],
  },
  "NeoBank (BNC)": {
    tabungan: 5.0,
    deposito: 8.0,
    color: "#FCE4EC",
    desc: "Bank Neo Commerce menawarkan bunga tertinggi di pasaran pada masa ini dengan pilihan tenor deposito yang sangat singkat.",
    plus: [
      "Bunga deposito tertinggi (sehingga 8%)",
      "Tenor sangat singkat (mulai 7 hari)",
      "Banyak ganjaran dan hadiah harian",
    ],
    minus: [
      "Aplikasi terasa berat",
      "Banyak iklan dan notifikasi",
      "Sistem pengesahan wajah kadangkala lambat",
    ],
  },
};

type NamaBank = keyof typeof DATA_BANK;

export default function DetailBankDigital() {
  const router = useRouter();
  const [selectedBank, setSelectedBank] = useState<NamaBank>("SeaBank");
  const [mode, setMode] = useState<"tabungan" | "deposito">("tabungan");
  const [setoran, setSetoran] = useState("1000000");
  const [tenor, setTenor] = useState("1");

  const currentRate = DATA_BANK[selectedBank][mode];

  const calculateInvestment = () => {
    const P = parseFloat(setoran.replace(/[^0-9]/g, "")) || 0;
    const r = currentRate / 100;
    const t = parseFloat(tenor) || 0;

    const hasilBruto = P * Math.pow(1 + r, t);
    const bungaDapat = hasilBruto - P;
    const pajak = bungaDapat * 0.2; // Cukai Bunga Bank 20%
    return hasilBruto - pajak;
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: "#E0F2F1" }]} // Warna Mint/Toska Muda
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 80 }}
    >
      <Stack.Screen options={{ headerShown: false }} />

      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={24} color="#00796B" />
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.emoji}>📱</Text>
        <Text style={styles.title}>Bank Digital</Text>
        <Text style={styles.subtitle}>Edukasi Simpanan Masa Kini</Text>
      </View>

      {/* 1. PENGERTIAN DINAMIK */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mengenal {selectedBank}</Text>
        <Text style={styles.bodyText}>{DATA_BANK[selectedBank].desc}</Text>
      </View>

      {/* 2. PILIH BANK */}
      <Text style={styles.sectionTitle}>Pilih Institusi</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.bankScroll}
      >
        {(Object.keys(DATA_BANK) as NamaBank[]).map((bank) => (
          <TouchableOpacity
            key={bank}
            onPress={() => setSelectedBank(bank)}
            style={[
              styles.bankCard,
              { backgroundColor: DATA_BANK[bank].color },
              selectedBank === bank && styles.activeCard,
            ]}
          >
            <Text style={styles.bankName}>{bank}</Text>
            <Text style={{ fontSize: 9, color: "#666" }}>
              Bunga {DATA_BANK[bank].deposito}%
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 3. TOGGLE TABUNGAN/DEPOSITO */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleBtn, mode === "tabungan" && styles.toggleActive]}
          onPress={() => setMode("tabungan")}
        >
          <Text
            style={[styles.toggleText, mode === "tabungan" && styles.textWhite]}
          >
            Tabungan
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleBtn, mode === "deposito" && styles.toggleActive]}
          onPress={() => setMode("deposito")}
        >
          <Text
            style={[styles.toggleText, mode === "deposito" && styles.textWhite]}
          >
            Deposito
          </Text>
        </TouchableOpacity>
      </View>

      {/* 4. SIMULASI */}
      <View style={styles.calcCard}>
        <Text style={styles.calcTitle}>
          📈 Simulasi {mode === "tabungan" ? "Tabungan" : "Deposito"}
        </Text>
        <Text style={styles.label}>Modal Simpanan (IDR)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={setoran}
          onChangeText={setSetoran}
        />
        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text style={styles.label}>Jangka Waktu (Tahun)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={tenor}
              onChangeText={setTenor}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Bunga (% p.a)</Text>
            <TextInput
              style={styles.input}
              editable={false}
              value={currentRate.toString()}
            />
          </View>
        </View>

        <View style={styles.resultBox}>
          <Text style={styles.resLabel}>Estimasi Diterima (Netto):</Text>
          <Text style={styles.resValue}>
            Rp{" "}
            {calculateInvestment().toLocaleString("id-ID", {
              maximumFractionDigits: 0,
            })}
          </Text>
          <Text style={styles.resSub}>
            *Sudah dipotong cukai bunga 20% (PPh)
          </Text>
        </View>
      </View>

      {/* 5. KELEBIHAN & KEKURANGAN DINAMIK */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Analisis {selectedBank}</Text>
        <View style={styles.row}>
          <View style={[styles.infoCard, { backgroundColor: "#E8F5E9" }]}>
            <Text style={[styles.infoTitle, { color: "#2E7D32" }]}>
              ✅ Kelebihan
            </Text>
            {DATA_BANK[selectedBank].plus.map((txt, i) => (
              <Text key={i} style={styles.infoBody}>
                • {txt}
              </Text>
            ))}
          </View>
          <View style={[styles.infoCard, { backgroundColor: "#FFEBEE" }]}>
            <Text style={[styles.infoTitle, { color: "#C62828" }]}>
              ⚠️ Kekurangan
            </Text>
            {DATA_BANK[selectedBank].minus.map((txt, i) => (
              <Text key={i} style={styles.infoBody}>
                • {txt}
              </Text>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  backBtn: { marginTop: 40, marginBottom: 10 },
  header: { alignItems: "center", marginBottom: 20 },
  calcCard: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 20,
    borderRadius: 20,
    elevation: 4,
    marginBottom: 30,
  },
  emoji: { fontSize: 50 },
  title: { fontSize: 26, fontWeight: "bold", color: "#00796B" },
  subtitle: { fontSize: 13, color: "#666" },
  section: { marginBottom: 25 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  bodyText: { fontSize: 14, color: "#666", lineHeight: 22 },
  bankScroll: { marginBottom: 20 },
  bankCard: {
    padding: 15,
    borderRadius: 15,
    marginRight: 10,
    width: 130,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  activeCard: { borderColor: "#00796B" },
  bankName: { fontWeight: "bold", fontSize: 12, marginBottom: 5 },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#eee",
    borderRadius: 12,
    padding: 5,
    marginBottom: 25,
  },
  toggleBtn: { flex: 1, padding: 12, alignItems: "center", borderRadius: 10 },
  toggleActive: { backgroundColor: "#00796B" },
  toggleText: { fontWeight: "bold", color: "#555", fontSize: 14 },
  textWhite: { color: "#fff" },
  calcTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  label: { fontSize: 11, color: "#999", marginTop: 10 },
  input: {
    borderBottomWidth: 2,
    borderBottomColor: "#00796B",
    paddingVertical: 5,
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  row: { flexDirection: "row", justifyContent: "space-between" },
  resultBox: {
    backgroundColor: "#00796B",
    padding: 15,
    borderRadius: 15,
    marginTop: 20,
  },
  resLabel: { color: "#B2DFDB", fontSize: 11, fontWeight: "bold" },
  resValue: { color: "#fff", fontSize: 24, fontWeight: "bold", marginTop: 5 },
  resSub: { color: "#B2DFDB", fontSize: 9, fontStyle: "italic", marginTop: 5 },
  infoCard: { flex: 1, padding: 12, borderRadius: 15, marginHorizontal: 4 },
  infoTitle: { fontWeight: "bold", fontSize: 12, marginBottom: 8 },
  infoBody: { fontSize: 10, color: "#444", lineHeight: 16, marginBottom: 4 },
});
