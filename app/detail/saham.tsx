import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Data Dummy Saham Indonesia (Update Berkala Manual)
const DAFTAR_SAHAM = [
  {
    ticker: "BBCA",
    nama: "Bank Central Asia",
    harga: 10250,
    per: 24.5,
    pbv: 4.8,
  },
  {
    ticker: "BBRI",
    nama: "Bank Rakyat Indonesia",
    harga: 4800,
    per: 11.2,
    pbv: 2.1,
  },
  {
    ticker: "TLKM",
    nama: "Telkom Indonesia",
    harga: 2850,
    per: 14.8,
    pbv: 2.5,
  },
  {
    ticker: "ASII",
    nama: "Astra International",
    harga: 5100,
    per: 7.5,
    pbv: 1.1,
  },
];

export default function DetailSaham() {
  const router = useRouter();

  // State Data
  const [ihsg, setIhsg] = useState({ price: 0, change: 0 });
  const [loadingIHSG, setLoadingIHSG] = useState(true);
  const [sahamTerpilih, setSahamTerpilih] = useState(DAFTAR_SAHAM[0]);
  const [lot, setLot] = useState("1");

  // Fetch IHSG dari Yahoo Finance (Free Endpoint)
  useEffect(() => {
    const fetchIHSG = async () => {
      try {
        // Menggunakan query ke Yahoo Finance Chart API (tanpa API Key)
        const response = await fetch(
          "https://query1.finance.yahoo.com/v8/finance/chart/^JKSE?interval=1d"
        );
        const json = await response.json();
        const result = json.chart.result[0];
        const price = result.meta.regularMarketPrice;
        const prevClose = result.meta.previousClose;
        const change = ((price - prevClose) / prevClose) * 100;

        setIhsg({ price, change });
        setLoadingIHSG(false);
      } catch (e) {
        console.log("Gagal ambil IHSG:", e);
        // Fallback jika API Yahoo gagal
        setIhsg({ price: 7250.45, change: 0.15 });
        setLoadingIHSG(false);
      }
    };
    fetchIHSG();
  }, []);

  const totalModal = (parseInt(lot) || 0) * 100 * sahamTerpilih.harga;

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 60 }}
    >
      <Stack.Screen options={{ headerShown: false }} />

      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={24} color="#2E7D32" />
      </TouchableOpacity>

      <View style={styles.headerSection}>
        <Text style={styles.emoji}>📈</Text>
        <Text style={styles.title}>Bursa Saham IDX</Text>
        <Text style={styles.subtitle}>Edukasi Investasi Saham Indonesia</Text>
      </View>

      {/* 1. IHSG LIVE CARD (Yahoo Finance Data) */}
      <View style={styles.ihsgCard}>
        <View>
          <Text style={styles.ihsgLabel}>IHSG (Indeks Gabungan)</Text>
          {loadingIHSG ? (
            <ActivityIndicator size="small" color="#2E7D32" />
          ) : (
            <Text style={styles.ihsgValue}>
              {ihsg.price.toLocaleString("id-ID")}
            </Text>
          )}
        </View>
        <View
          style={[
            styles.ihsgChangeBox,
            { backgroundColor: ihsg.change >= 0 ? "#E8F5E9" : "#FFEBEE" },
          ]}
        >
          <Ionicons
            name={ihsg.change >= 0 ? "caret-up" : "caret-down"}
            size={16}
            color={ihsg.change >= 0 ? "#4CAF50" : "#C62828"}
          />
          <Text
            style={[
              styles.ihsgChangeText,
              { color: ihsg.change >= 0 ? "#4CAF50" : "#C62828" },
            ]}
          >
            {Math.abs(ihsg.change).toFixed(2)}%
          </Text>
        </View>
      </View>

      {/* PENGERTIAN SAHAM */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Apa itu Saham?</Text>
        <Text style={styles.bodyText}>
          Saham adalah bukti kepemilikan nilai sebuah perusahaan. Dengan membeli
          saham, Anda menjadi "pemilik" perusahaan tersebut dan berhak
          mendapatkan bagi hasil (Dividen) serta keuntungan dari kenaikan harga
          (Capital Gain).
        </Text>
      </View>

      {/* 2. PILIH SAHAM (Dummy List) */}
      <Text style={styles.sectionTitle}>Pilih Saham Simulasi</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.selectorScroll}
      >
        {DAFTAR_SAHAM.map((item) => (
          <TouchableOpacity
            key={item.ticker}
            style={[
              styles.badge,
              sahamTerpilih.ticker === item.ticker && styles.badgeActive,
            ]}
            onPress={() => setSahamTerpilih(item)}
          >
            <Text
              style={[
                styles.badgeText,
                sahamTerpilih.ticker === item.ticker && styles.badgeTextActive,
              ]}
            >
              {item.ticker}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 3. FUNDAMENTAL SAHAM */}
      <View style={styles.fundamentalRow}>
        <View style={styles.funBox}>
          <Text style={styles.funLabel}>PER (Price/Earnings)</Text>
          <Text style={styles.funValue}>{sahamTerpilih.per}x</Text>
          <Text style={styles.funNote}>
            {sahamTerpilih.per > 15 ? "Cukup Premium" : "Value Stock"}
          </Text>
        </View>
        <View style={styles.funBox}>
          <Text style={styles.funLabel}>PBV (Price/Book)</Text>
          <Text style={styles.funValue}>{sahamTerpilih.pbv}x</Text>
          <Text style={styles.funNote}>
            {sahamTerpilih.pbv > 3 ? "Harga Tinggi" : "Wajar"}
          </Text>
        </View>
      </View>

      {/* 4. KALKULATOR LOT */}
      <View style={styles.calcCard}>
        <Text style={styles.calcTitle}>
          🧮 Simulasi Modal {sahamTerpilih.ticker}
        </Text>
        <Text style={styles.stockPrice}>
          Harga per Lembar: Rp {sahamTerpilih.harga.toLocaleString("id-ID")}
        </Text>

        {/* PINDAHAN EDUKASI KE DALAM CARD */}
        <Text style={[styles.label, { marginTop: 15 }]}>
          Jumlah Lot (1 Lot = 100 lbr):
        </Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={lot}
          onChangeText={setLot}
          placeholder="0"
        />

        <View style={styles.resultBox}>
          <Text style={styles.resultLabel}>Estimasi Modal Dibutuhkan:</Text>
          <Text style={styles.resultValue}>
            Rp {totalModal.toLocaleString("id-ID")}
          </Text>
        </View>

        <View style={styles.miniEduBox}>
          <Ionicons name="analytics-outline" size={14} color="#0277BD" />
          <Text style={styles.miniEduText}>
            PER ({sahamTerpilih.per}x) & PBV ({sahamTerpilih.pbv}x) menunjukkan
            saham ini sedang {sahamTerpilih.per > 15 ? "Premium" : "Diskon"}.
          </Text>
        </View>
      </View>

      {/* 5. KEUNTUNGAN & KERUGIAN */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Analisis Risiko & Potensi</Text>
        <View style={styles.row}>
          {/* Sisi Keuntungan */}
          <View style={[styles.benefitCard, { backgroundColor: "#E8F5E9" }]}>
            <View style={styles.cardHeader}>
              <Ionicons name="trending-up" size={18} color="#2E7D32" />
              <Text style={[styles.cardTitle, { color: "#1B5E20" }]}>
                Potensi Cuan
              </Text>
            </View>
            <Text style={styles.cardBody}>• Dividen (Bagi Hasil Labas)</Text>
            <Text style={styles.cardBody}>• Capital Gain (Harga Naik)</Text>
            <Text style={styles.cardBody}>• Hak Suara dalam RUPS</Text>
          </View>

          {/* Sisi Kerugian */}
          <View style={[styles.benefitCard, { backgroundColor: "#FFEBEE" }]}>
            <View style={styles.cardHeader}>
              <Ionicons name="trending-down" size={18} color="#C62828" />
              <Text style={[styles.cardTitle, { color: "#B71C1C" }]}>
                Risiko Rugi
              </Text>
            </View>
            <Text style={styles.cardBody}>• Capital Loss (Harga Turun)</Text>
            <Text style={styles.cardBody}>• Suspend (Saham Dibekukan)</Text>
            <Text style={styles.cardBody}>
              • Likuidasi (Perusahaan Bangkrut)
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F1F8E9", padding: 20 },
  emoji: { fontSize: 50, marginBottom: 10 },
  backBtn: { marginTop: 40, marginBottom: 10 },
  headerSection: { alignItems: "center", marginBottom: 25 },
  title: { fontSize: 26, fontWeight: "bold", color: "#1B5E20" },
  subtitle: { fontSize: 13, color: "#666" },
  bodyText: { fontSize: 14, lineHeight: 20, color: "#444", marginBottom: 15 },

  ihsgCard: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 3,
  },
  ihsgLabel: { fontSize: 11, color: "#888" },
  ihsgValue: { fontSize: 24, fontWeight: "bold", color: "#333", marginTop: 5 },
  ihsgChangeBox: {
    padding: 8,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  ihsgChangeText: { fontWeight: "bold", fontSize: 12, marginLeft: 4 },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  selectorScroll: { flexDirection: "row", marginBottom: 20 },
  badge: {
    backgroundColor: "#FFF",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#DDD",
  },
  badgeActive: { backgroundColor: "#2E7D32", borderColor: "#2E7D32" },
  badgeText: { color: "#666", fontWeight: "bold" },
  badgeTextActive: { color: "#FFF" },

  fundamentalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  funBox: {
    width: "48%",
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 15,
    elevation: 2,
  },
  funLabel: { fontSize: 10, color: "#888" },
  funValue: { fontSize: 18, fontWeight: "bold", color: "#333", marginTop: 5 },
  funNote: { fontSize: 10, color: "#2E7D32", fontWeight: "bold", marginTop: 2 },

  calcCard: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 20,
    elevation: 4,
  },
  calcTitle: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#2E7D32",
  },
  stockPrice: { fontSize: 13, color: "#666" },
  label: { fontSize: 12, color: "#888" },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#2E7D32",
    fontSize: 20,
    paddingVertical: 5,
    fontWeight: "bold",
  },
  resultBox: {
    backgroundColor: "#E8F5E9",
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
  },
  resultLabel: { fontSize: 11, color: "#2E7D32" },
  resultValue: { fontSize: 22, fontWeight: "bold", color: "#1B5E20" },
  eduText: { flex: 1, fontSize: 11, color: "#0277BD", marginLeft: 10 },

  miniEduBox: {
    flexDirection: "row",
    backgroundColor: "#E1F5FE",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
    borderLeftWidth: 3,
    borderLeftColor: "#0277BD",
  },
  miniEduText: {
    fontSize: 11,
    color: "#01579B",
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
  },

  section: { marginTop: 25 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  cardTitle: { fontWeight: "bold", fontSize: 13, marginLeft: 5 },
  benefitCard: { width: "48%", padding: 12, borderRadius: 15, elevation: 1 },
  cardBody: { fontSize: 10, color: "#444", lineHeight: 16, marginBottom: 2 },
});
