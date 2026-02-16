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
  const { theme, isDark } = useAppTheme(); // Gunakan global theme
  const [marketData, setMarketData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,pax-gold&vs_currencies=idr&include_24hr_change=true"
      );
      const data = await response.json();

      const ihsgRes = await fetch(
        "https://query1.finance.yahoo.com/v8/finance/chart/^JKSE?interval=1d"
      );
      const ihsgData = await ihsgRes.json();
      const ihsgPrice = ihsgData.chart.result[0].meta.regularMarketPrice;
      const ihsgPrev = ihsgData.chart.result[0].meta.previousClose;
      const ihsgChange = ((ihsgPrice - ihsgPrev) / ihsgPrev) * 100;

      const usdResponse = await fetch(
        "https://api.exchangerate-api.com/v4/latest/USD"
      );
      const usdData = await usdResponse.json();

      const formattedData = [
        {
          id: "1",
          nama: "Emas Antam (Gram)",
          harga: (data["pax-gold"].idr / 31.1035) * 1.05,
          perubahan: data["pax-gold"].idr_24h_change,
          risiko: "Rendah",
          warnaRisiko: "#4CAF50",
          icon: "medal-outline",
        },
        {
          id: "2",
          nama: "IHSG (Saham)",
          harga: ihsgPrice,
          perubahan: ihsgChange,
          risiko: "Tinggi",
          warnaRisiko: "#C62828",
          icon: "trending-up-outline",
        },
        {
          id: "3",
          nama: "Reksa Dana",
          harga: 1540.25,
          perubahan: 0.45,
          risiko: "Sedang",
          warnaRisiko: "#2196F3",
          icon: "business-outline",
        },
        {
          id: "4",
          nama: "Bitcoin (Crypto)",
          harga: data.bitcoin.idr,
          perubahan: data.bitcoin.idr_24h_change,
          risiko: "Tinggi",
          warnaRisiko: "#C62828",
          icon: "logo-bitcoin",
        },
        {
          id: "5",
          nama: "US Dollar (USD/IDR)",
          harga: usdData.rates.IDR,
          perubahan: 0.05,
          risiko: "Tinggi",
          warnaRisiko: "#C62828",
          icon: "cash-outline",
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
        <Text style={{ marginTop: 10, color: theme.subText }}>Menghubungkan ke Bursa...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.mainWrapper, { backgroundColor: theme.background }]}>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.tint} />
        }
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 10,
          paddingBottom: 60,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.header, { color: theme.text }]}>Ringkasan Pasar</Text>
        <Text style={[styles.subHeader, { color: theme.subText }]}>
          Pantauan instrumen investasi terpopuler
        </Text>

        {marketData.map((item) => (
          <View key={item.id} style={[styles.priceCard, { backgroundColor: theme.card }]}>
            <View style={styles.cardInfo}>
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: item.warnaRisiko + "15" },
                ]}
              >
                <Ionicons
                  name={item.icon as any}
                  size={20}
                  color={item.warnaRisiko}
                />
              </View>
              <View>
                <Text style={[styles.assetName, { color: theme.subText }]}>{item.nama}</Text>
                <Text style={[styles.price, { color: theme.text }]}>
                  {item.id === "2" ? "" : "IDR "}
                  {item.harga.toLocaleString("id-ID", {
                    maximumFractionDigits: 2,
                  })}
                </Text>
                <View
                  style={[
                    styles.riskTag,
                    { backgroundColor: item.warnaRisiko + "20" },
                  ]}
                >
                  <Text style={[styles.riskText, { color: item.warnaRisiko }]}>
                    Risiko: {item.risiko}
                  </Text>
                </View>
              </View>
            </View>

            <View
              style={[
                styles.badge,
                {
                  backgroundColor: item.perubahan >= 0 ? (isDark ? "#064e3b" : "#e8f5e9") : (isDark ? "#450a0a" : "#ffebee"),
                },
              ]}
            >
              <Text
                style={[
                  styles.changeText,
                  { color: item.perubahan >= 0 ? (isDark ? "#4ade80" : "#2e7d32") : (isDark ? "#fca5a5" : "#c62828") },
                ]}
              >
                {item.perubahan >= 0 ? "▲" : "▼"}{" "}
                {Math.abs(item.perubahan).toFixed(2)}%
              </Text>
            </View>
          </View>
        ))}

        {/* TABEL PERBANDINGAN STRATEGIS */}
        <View style={[styles.eduSection, { backgroundColor: theme.card }]}>
          <Text style={[styles.eduTitle, { color: theme.text }]}>📊 Tabel Perbandingan Aset</Text>
          <View style={[styles.table, { borderColor: theme.border }]}>
            <View style={[styles.tableRow, { backgroundColor: isDark ? theme.background : "#F0F4F8", borderBottomColor: theme.border }]}>
              <Text style={[styles.tableHead, { color: theme.subText }]}>Aset</Text>
              <Text style={[styles.tableHead, { color: theme.subText }]}>Likuiditas</Text>
              <Text style={[styles.tableHead, { color: theme.subText }]}>Jangka Waktu</Text>
            </View>
            {[
              { a: "Emas", b: "Tinggi", c: "> 2 Thn" },
              { a: "Saham", b: "Sedang", c: "> 5 Thn" },
              { a: "Reksa Dana", b: "Tinggi", c: "1-3 Thn" },
              { a: "Crypto", b: "S. Tinggi", c: "Pendek" },
            ].map((row, index) => (
              <View key={index} style={[styles.tableRow, { borderBottomColor: theme.border }]}>
                <Text style={[styles.tableCell, { color: theme.text }]}>{row.a}</Text>
                <Text style={[styles.tableCell, { color: theme.text }]}>{row.b}</Text>
                <Text style={[styles.tableCell, { color: theme.text }]}>{row.c}</Text>
              </View>
            ))}
          </View>
        </View>

        <Text style={[styles.footerNote, { color: theme.subText }]}>
          Tarik ke bawah untuk memperbarui harga terbaru.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: { flex: 1 },
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  subHeader: {
    fontSize: 13,
    marginBottom: 20,
  },

  priceCard: {
    padding: 16,
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  cardInfo: { flexDirection: "row", alignItems: "center" },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  assetName: {
    fontSize: 11,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 2,
  },

  riskTag: {
    alignSelf: "flex-start",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 2,
  },
  riskText: { fontSize: 9, fontWeight: "bold" },

  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  changeText: { fontSize: 11, fontWeight: "bold" },

  eduSection: {
    marginTop: 10,
    padding: 15,
    borderRadius: 20,
    elevation: 2,
  },
  eduTitle: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 12,
  },
  table: {
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  tableHead: {
    flex: 1,
    textAlign: "center",
    fontSize: 10,
    fontWeight: "bold",
  },
  tableCell: { flex: 1, textAlign: "center", fontSize: 10 },

  footerNote: {
    textAlign: "center",
    fontSize: 10,
    marginTop: 20,
    marginBottom: 20,
  },
});