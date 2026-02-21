import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "../../components/theme";

export default function HargaScreen() {
  const { theme, isDark } = useAppTheme();
  const [marketData, setMarketData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const coingeckoRes = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,pax-gold&vs_currencies=idr&include_24hr_change=true"
      ).catch(() => null);
      const cryptoData = coingeckoRes ? await coingeckoRes.json() : null;

      const usdRes = await fetch(
        "https://api.exchangerate-api.com/v4/latest/USD"
      ).catch(() => null);
      const usdData = usdRes ? await usdRes.json() : null;

      // Filter: Hanya Emas, Saham, USD, Bitcoin
      const formattedData = [
        {
          id: "1",
          nama: "Emas Antam (Gram)",
          harga: cryptoData
            ? (cryptoData["pax-gold"].idr / 31.1035) * 1.05
            : 1250000,
          perubahan: cryptoData?.["pax-gold"].idr_24h_change || 0.25,
          warna: "#D4AF37",
          icon: "medal-outline",
        },
        {
          id: "2",
          nama: "Saham IHSG",
          harga: 7350.12,
          perubahan: 0.15,
          warna: "#4CAF50",
          icon: "trending-up-outline",
        },
        {
          id: "3",
          nama: "US Dollar (Kurs)",
          harga: usdData ? usdData.rates.IDR : 15750,
          perubahan: -0.12,
          warna: "#85bb65",
          icon: "cash-outline",
        },
        {
          id: "4",
          nama: "Bitcoin (Crypto)",
          harga: cryptoData ? cryptoData.bitcoin.idr : 950000000,
          perubahan: cryptoData?.bitcoin.idr_24h_change || 1.5,
          warna: "#F7931A",
          icon: "logo-bitcoin",
        },
      ];

      setMarketData(formattedData);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.tint} />
      </View>
    );
  }

  return (
    <View style={[styles.mainWrapper, { backgroundColor: theme.background }]}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.header, { color: theme.text }]}>
          Ringkasan Pasar
        </Text>
        <Text style={[styles.subHeader, { color: theme.subText }]}>
          Estimasi harga aset saat ini
        </Text>

        {marketData.map((item) => (
          <View
            key={item.id}
            style={[styles.priceCard, { backgroundColor: theme.card }]}
          >
            <View style={styles.cardInfo}>
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: item.warna + "15" },
                ]}
              >
                <Ionicons
                  name={item.icon as any}
                  size={22}
                  color={item.warna}
                />
              </View>
              <View>
                <Text style={[styles.assetName, { color: theme.subText }]}>
                  {item.nama}
                </Text>
                <Text style={[styles.price, { color: theme.text }]}>
                  IDR {item.harga.toLocaleString("id-ID")}
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.badge,
                {
                  backgroundColor:
                    item.perubahan >= 0 ? "#4CAF5020" : "#F4433620",
                },
              ]}
            >
              <Text
                style={[
                  styles.changeText,
                  { color: item.perubahan >= 0 ? "#4CAF50" : "#F44336" },
                ]}
              >
                {item.perubahan >= 0 ? "▲" : "▼"}{" "}
                {Math.abs(item.perubahan).toFixed(2)}%
              </Text>
            </View>
          </View>
        ))}

        {/* TABEL PERBANDINGAN STRATEGIS */}
        <View style={styles.eduContainer}>
          <Text style={[styles.eduTitle, { color: theme.text }]}>
            📊 Perbandingan Strategis
          </Text>
          <View
            style={[
              styles.modernTable,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            {/* Header */}
            <View
              style={[
                styles.tableHeader,
                { backgroundColor: isDark ? "#1e293b" : "#f8fafc" },
              ]}
            >
              <Text
                style={[styles.col1, styles.headText, { color: theme.subText }]}
              >
                Aset
              </Text>
              <Text
                style={[styles.col2, styles.headText, { color: theme.subText }]}
              >
                Risiko
              </Text>
              <Text
                style={[styles.col3, styles.headText, { color: theme.subText }]}
              >
                Jangka Ideal
              </Text>
            </View>

            {/* Rows */}
            {[
              { n: "Emas", r: "Rendah", t: "> 5 Tahun", c: "#D4AF37" },
              { n: "Saham", r: "Tinggi", t: "> 5 Tahun", c: "#4CAF50" },
              { n: "R. Dana", r: "S - R", t: "1 - 3 Tahun", c: "#2196F3" },
              { n: "Crypto", r: "S. Tinggi", t: "Spekulatif", c: "#F7931A" },
              { n: "Kurs", r: "Sedang", t: "Pendek", c: "#85bb65" },
              { n: "Bank Dig.", r: "S. Rendah", t: "Fleksibel", c: "#009688" }, // Penambahan Bank Digital
            ].map((row, i) => (
              <View
                key={i}
                style={[styles.tableRow, { borderTopColor: theme.border }]}
              >
                <View style={styles.col1}>
                  <Text style={[styles.cellTextBold, { color: theme.text }]}>
                    {row.n}
                  </Text>
                </View>
                <View style={styles.col2}>
                  <Text
                    style={[
                      styles.riskLabel,
                      { color: row.c, backgroundColor: row.c + "15" },
                    ]}
                  >
                    {row.r}
                  </Text>
                </View>
                <View style={styles.col3}>
                  <Text style={[styles.cellText, { color: theme.subText }]}>
                    {row.t}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <Text style={[styles.footerNote, { color: theme.subText }]}>
          Data diperbarui secara berkala. Estimasi harga menggunakan nilai
          referensi pasar global.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 80 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { fontSize: 26, fontWeight: "bold" },
  subHeader: { fontSize: 14, marginBottom: 25, opacity: 0.7 },

  priceCard: {
    padding: 18,
    borderRadius: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardInfo: { flexDirection: "row", alignItems: "center" },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  assetName: {
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  price: { fontSize: 17, fontWeight: "800", marginTop: 2 },
  badge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  changeText: { fontSize: 12, fontWeight: "bold" },

  eduContainer: { marginTop: 30 },
  eduTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
  modernTable: { borderRadius: 24, borderWidth: 1, overflow: "hidden" },
  tableHeader: { flexDirection: "row", padding: 15 },
  tableRow: {
    flexDirection: "row",
    padding: 15,
    alignItems: "center",
    borderTopWidth: 1,
  },
  headText: { fontSize: 12, fontWeight: "bold", textTransform: "uppercase" },
  cellTextBold: { fontSize: 14, fontWeight: "bold" },
  cellText: { fontSize: 12, fontWeight: "500" },
  riskLabel: {
    fontSize: 10,
    fontWeight: "bold",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    textAlign: "center",
    alignSelf: "flex-start",
  },

  col1: { flex: 1 },
  col2: { flex: 1 },
  col3: { flex: 1.2 },

  footerNote: {
    textAlign: "center",
    fontSize: 11,
    marginTop: 30,
    lineHeight: 18,
    opacity: 0.6,
  },
});
