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

export default function DetailCrypto() {
  const router = useRouter();

  // State Data
  const [coins, setCoins] = useState<any[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState("1000000"); // Modal dalam Rupiah

  // Fetch Harga Crypto Real-time dari CoinGecko
  useEffect(() => {
    const fetchCrypto = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=idr&ids=bitcoin,ethereum,solana,binancecoin&order=market_cap_desc"
        );
        const data = await response.json();
        setCoins(data);
        setSelectedCoin(data[0]); // Default ke Bitcoin
        setLoading(false);
      } catch (e) {
        console.log("Gagal ambil data Crypto:", e);
        setLoading(false);
      }
    };
    fetchCrypto();
  }, []);

  const estimasiKoin = selectedCoin
    ? (parseFloat(amount) || 0) / selectedCoin.current_price
    : 0;

  if (loading) {
    return (
      <View style={styles.loadingCenter}>
        <ActivityIndicator size="large" color="#F7931A" />
        <Text style={{ marginTop: 10, color: "#666" }}>
          Menghubungkan ke Blockchain...
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
        <Ionicons name="arrow-back" size={24} color="#F7931A" />
      </TouchableOpacity>

      <View style={styles.headerSection}>
        <Text style={styles.emoji}>₿</Text>
        <Text style={styles.title}>Crypto Assets</Text>
        <Text style={styles.subtitle}>Mata Uang Digital Masa Depan</Text>
      </View>

      {/* PENGERTIAN CRYPTO */}
      <View style={[styles.section, { paddingHorizontal: 5 }]}>
        <Text style={styles.sectionTitle}>Apa itu Aset Kripto?</Text>
        <Text style={styles.bodyText}>
          Aset digital yang berjalan di atas teknologi Blockchain. Crypto
          bersifat desentralisasi, artinya tidak dikontrol oleh bank sentral.
          Harganya sangat bergantung pada permintaan pasar (Supply & Demand),
          menjadikannya instrumen dengan volatilitas tinggi.
        </Text>
      </View>

      {/* 1. HORIZONTAL COIN SELECTOR */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.coinList}
      >
        {coins.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.coinCard,
              selectedCoin?.id === item.id && styles.coinCardActive,
            ]}
            onPress={() => setSelectedCoin(item)}
          >
            <Text
              style={[
                styles.coinSymbol,
                selectedCoin?.id === item.id && styles.textWhite,
              ]}
            >
              {item.symbol.toUpperCase()}
            </Text>
            <Text
              style={[
                styles.coinPrice,
                selectedCoin?.id === item.id && styles.textWhite,
              ]}
            >
              Rp {item.current_price.toLocaleString("id-ID")}
            </Text>
            <View style={styles.changeRow}>
              <Ionicons
                name={
                  item.price_change_percentage_24h >= 0
                    ? "trending-up"
                    : "trending-down"
                }
                color={
                  item.price_change_percentage_24h >= 0 ? "#4CAF50" : "#FF5252"
                }
                size={12}
              />
              <Text
                style={[
                  styles.changeText,
                  {
                    color:
                      item.price_change_percentage_24h >= 0
                        ? "#4CAF50"
                        : "#FF5252",
                  },
                ]}
              >
                {item.price_change_percentage_24h.toFixed(2)}%
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 2. KALKULATOR CRYPTO */}
      <View style={styles.calcCard}>
        <Text style={styles.calcTitle}>
          🧮 Simulasi Beli {selectedCoin?.name}
        </Text>
        <Text style={styles.label}>Modal Investasi (IDR):</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
        <View style={styles.resultBox}>
          <Text style={styles.resultLabel}>
            Anda akan mendapatkan estimasi:
          </Text>
          <Text style={styles.resultValue}>
            {estimasiKoin.toFixed(8)} {selectedCoin?.symbol.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* 3. KEUNTUNGAN & KERUGIAN (2 KOLOM) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>High Risk, High Return</Text>
        <View style={styles.row}>
          <View style={[styles.infoCard, { backgroundColor: "#E3F2FD" }]}>
            <Text style={styles.infoTitle}>🚀 Keuntungan</Text>
            <Text style={styles.infoBody}>• Desentralisasi (Tanpa Bank)</Text>
            <Text style={styles.infoBody}>• Potensi Kenaikan Fantastis</Text>
            <Text style={styles.infoBody}>• Transaksi 24/7 Nonstop</Text>
          </View>
          <View style={[styles.infoCard, { backgroundColor: "#FFF3E0" }]}>
            <Text style={styles.infoTitle}>⚠️ Kerugian</Text>
            <Text style={styles.infoBody}>• Volatilitas Sangat Tinggi</Text>
            <Text style={styles.infoBody}>• Tidak Ada Jaminan Negara</Text>
            <Text style={styles.infoBody}>• Risiko Keamanan (Hack/Scam)</Text>
          </View>
        </View>
      </View>

      <View style={{ height: 50 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA", padding: 20 },
  loadingCenter: { flex: 1, justifyContent: "center", alignItems: "center" },
  backBtn: { marginTop: 40, marginBottom: 10 },
  headerSection: { alignItems: "center", marginBottom: 25 },
  emoji: { fontSize: 50, color: "#F7931A", fontWeight: "bold" },
  title: { fontSize: 28, fontWeight: "bold", color: "#1A1A1A" },
  subtitle: { fontSize: 14, color: "#666" },
  bodyText: {
    fontSize: 14,
    lineHeight: 22,
    color: "#444",
  },
  coinList: { flexDirection: "row", marginBottom: 25 },
  coinCard: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 15,
    marginRight: 12,
    width: 140,
    borderWidth: 1,
    borderColor: "#EEE",
    elevation: 2,
  },
  coinCardActive: { backgroundColor: "#F7931A", borderColor: "#F7931A" },
  coinSymbol: { fontWeight: "bold", fontSize: 16, color: "#333" },
  coinPrice: { fontSize: 12, color: "#666", marginTop: 5 },
  textWhite: { color: "#FFF" },
  changeRow: { flexDirection: "row", alignItems: "center", marginTop: 5 },
  changeText: { fontSize: 11, fontWeight: "bold", marginLeft: 4 },

  calcCard: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 20,
    elevation: 4,
    marginBottom: 25,
  },
  calcTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 15 },
  label: { fontSize: 12, color: "#888" },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#F7931A",
    fontSize: 20,
    paddingVertical: 8,
    fontWeight: "bold",
    color: "#333",
  },
  resultBox: {
    backgroundColor: "#FFF8E1",
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
  },
  resultLabel: { fontSize: 11, color: "#F7931A" },
  resultValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#F7931A",
    marginTop: 5,
  },

  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  infoCard: { width: "48%", padding: 15, borderRadius: 15 },
  infoTitle: { fontWeight: "bold", fontSize: 13, marginBottom: 8 },
  infoBody: { fontSize: 10, color: "#444", lineHeight: 16 },
});
