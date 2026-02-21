import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "../../components/theme";

const QUOTES = [
  { text: "Jangan menaruh semua telur dalam satu keranjang.", author: "Diversifikasi Aset" },
  { text: "Investasi terbaik adalah investasi pada diri sendiri (ilmu).", author: "Benjamin Franklin" },
  { text: "Risiko datang dari ketidaktahuan Anda tentang apa yang sedang Anda lakukan.", author: "Warren Buffett" },
  { text: "Pasar saham adalah alat untuk mentransfer uang dari yang tidak sabar ke yang sabar.", author: "Warren Buffett" },
  { text: "Masa pensiun dimulai sekarang, bukan nanti saat Anda tua.", author: "Pepatah Finansial" },
  { text: "Bukan berapa banyak uang yang Anda hasilkan, tapi berapa banyak yang Anda simpan.", author: "Robert Kiyosaki" },
];

const MASTER_TIPS = [
  // --- EMAS (Identitas Emas: #D4AF37) ---
  {
    id: "e1",
    kategori: "Emas",
    judul: "Buyback",
    isi: "Harga yang dipatok toko/Antam saat kita menjual kembali emas ke mereka.",
    icon: "medal-outline",
    warna: "#D4AF37",
  },
  {
    id: "e2",
    kategori: "Emas",
    judul: "Spread",
    isi: "Selisih harga antara harga jual (kita beli) dan harga beli (kita jual).",
    icon: "swap-horizontal-outline",
    warna: "#D4AF37",
  },
  {
    id: "e3",
    kategori: "Emas",
    judul: "Karat",
    isi: "Ukuran kemurnian emas. 24 Karat berarti emas murni 99.9%.",
    icon: "color-filter-outline",
    warna: "#D4AF37",
  },
  {
    id: "e4",
    kategori: "Emas",
    judul: "Troy Ounce",
    isi: "Satuan berat emas internasional. 1 Troy Ounce setara 31,1 gram.",
    icon: "scale-outline",
    warna: "#D4AF37",
  },
  {
    id: "e5",
    kategori: "Emas",
    judul: "Pool Account",
    isi: "Saldo emas digital tanpa harus memegang fisik emasnya secara langsung.",
    icon: "cloud-outline",
    warna: "#D4AF37",
  },
  {
    id: "e6",
    kategori: "Emas",
    judul: "Dinar & Dirham",
    isi: "Koin emas (Dinar) dan perak (Dirham) untuk mahar atau simpanan syariah.",
    icon: "cash-outline",
    warna: "#D4AF37",
  },
  {
    id: "e7",
    kategori: "Emas",
    judul: "Lustre",
    isi: "Kilau permukaan emas yang menunjukkan kualitas penyimpanan fisik.",
    icon: "sunny-outline",
    warna: "#D4AF37",
  },
  {
    id: "e8",
    kategori: "Emas",
    judul: "Gramasi",
    isi: "Pilihan berat emas batangan, mulai dari 0.01g hingga 1000g (1kg).",
    icon: "cube-outline",
    warna: "#D4AF37",
  },

  // --- REKSA DANA (Identitas Reksa Dana: #2196F3) ---
  {
    id: "r1",
    kategori: "Reksa Dana",
    judul: "NAV / NAB",
    isi: "Net Asset Value. Harga satuan reksa dana yang dihitung setiap hari bursa.",
    icon: "stats-chart-outline",
    warna: "#2196F3",
  },
  {
    id: "r2",
    kategori: "Reksa Dana",
    judul: "Expense Ratio",
    isi: "Total biaya operasional pengelolaan. Semakin kecil, semakin efisien.",
    icon: "pie-chart-outline",
    warna: "#2196F3",
  },
  {
    id: "r3",
    kategori: "Reksa Dana",
    judul: "Manajer Investasi",
    isi: "Perusahaan profesional yang mengelola dana kolektif di reksa dana.",
    icon: "briefcase-outline",
    warna: "#2196F3",
  },
  {
    id: "r4",
    kategori: "Reksa Dana",
    judul: "Bank Kustodian",
    isi: "Bank yang bertugas menyimpan aset dan administrasi reksa dana secara aman.",
    icon: "business-outline",
    warna: "#2196F3",
  },
  {
    id: "r5",
    kategori: "Reksa Dana",
    judul: "Prospektus",
    isi: "Dokumen profil lengkap mengenai aturan dan strategi produk reksa dana.",
    icon: "document-text-outline",
    warna: "#2196F3",
  },
  {
    id: "r6",
    kategori: "Reksa Dana",
    judul: "Lump Sum",
    isi: "Strategi investasi dengan memasukkan dana besar sekaligus di awal.",
    icon: "wallet-outline",
    warna: "#2196F3",
  },
  {
    id: "r7",
    kategori: "Reksa Dana",
    judul: "AUM",
    isi: "Asset Under Management. Total dana kelolaan yang dipercayakan investor ke MI.",
    icon: "server-outline",
    warna: "#2196F3",
  },
  {
    id: "r8",
    kategori: "Reksa Dana",
    judul: "Switching",
    isi: "Fitur memindahkan saldo antar produk reksa dana tanpa tarik dana ke bank.",
    icon: "repeat-outline",
    warna: "#2196F3",
  },
  {
    id: "r9",
    kategori: "Reksa Dana",
    judul: "Fund Fact Sheet",
    isi: "Laporan bulanan reksa dana yang berisi kinerja dan alokasi aset terbesar.",
    icon: "list-circle-outline",
    warna: "#2196F3",
  },

  // --- SAHAM (Identitas Saham: #4CAF50) ---
  {
    id: "s1",
    kategori: "Saham",
    judul: "Lot",
    isi: "Satuan terkecil jual beli saham di Indonesia. 1 Lot = 100 lembar saham.",
    icon: "layers-outline",
    warna: "#4CAF50",
  },
  {
    id: "s2",
    kategori: "Saham",
    judul: "Dividen",
    isi: "Bagian laba perusahaan yang dibagikan kepada para pemegang saham.",
    icon: "gift-outline",
    warna: "#4CAF50",
  },
  {
    id: "s3",
    kategori: "Saham",
    judul: "Capital Gain",
    isi: "Keuntungan dari selisih harga jual saham yang lebih tinggi dari harga beli.",
    icon: "trending-up-outline",
    warna: "#4CAF50",
  },
  {
    id: "s4",
    kategori: "Saham",
    judul: "Blue Chip",
    isi: "Saham perusahaan besar dengan reputasi tinggi dan laba stabil.",
    icon: "ribbon-outline",
    warna: "#4CAF50",
  },
  {
    id: "s5",
    kategori: "Saham",
    judul: "IPO",
    isi: "Initial Public Offering. Saat perusahaan pertama kali menjual saham ke publik.",
    icon: "rocket-outline",
    warna: "#4CAF50",
  },
  {
    id: "s6",
    kategori: "Saham",
    judul: "Bullish & Bearish",
    isi: "Bullish adalah tren pasar naik, sedangkan Bearish adalah tren pasar turun.",
    icon: "analytics-outline",
    warna: "#4CAF50",
  },
  {
    id: "s7",
    kategori: "Saham",
    judul: "Auto Rejection",
    isi: "Batasan kenaikan (ARA) atau penurunan (ARB) harga saham dalam satu hari.",
    icon: "hand-left-outline",
    warna: "#4CAF50",
  },
  {
    id: "s8",
    kategori: "Saham",
    judul: "GCG",
    isi: "Good Corporate Governance. Tata kelola perusahaan yang transparan dan bersih.",
    icon: "shield-checkmark-outline",
    warna: "#4CAF50",
  },
  {
    id: "s9",
    kategori: "Saham",
    judul: "Stock Split",
    isi: "Pemecahan nilai saham agar harga per lembar menjadi lebih terjangkau.",
    icon: "git-branch-outline",
    warna: "#4CAF50",
  },
  {
    id: "s10",
    kategori: "Saham",
    judul: "Right Issue",
    isi: "Hak memesan efek terlebih dahulu bagi pemegang saham lama untuk beli saham baru.",
    icon: "add-circle-outline",
    warna: "#4CAF50",
  },

  // --- CRYPTO (Identitas Crypto: #F7931A) ---
  {
    id: "c1",
    kategori: "Crypto",
    judul: "HODL",
    isi: "Strategi menyimpan aset jangka panjang meski harga sedang turun drastis.",
    icon: "lock-closed-outline",
    warna: "#F7931A",
  },
  {
    id: "c2",
    kategori: "Crypto",
    judul: "Halving",
    isi: "Pemotongan suplai baru Bitcoin tiap 4 tahun yang memicu kelangkaan.",
    icon: "cut-outline",
    warna: "#F7931A",
  },
  {
    id: "c3",
    kategori: "Crypto",
    judul: "Stablecoin",
    isi: "Aset crypto yang harganya dipatok 1:1 dengan mata uang asli (misal: USDT/USD).",
    icon: "shield-outline",
    warna: "#F7931A",
  },
  {
    id: "c4",
    kategori: "Crypto",
    judul: "Gas Fee",
    isi: "Biaya transaksi yang dibayar untuk memproses data di jaringan blockchain.",
    icon: "flame-outline",
    warna: "#F7931A",
  },
  {
    id: "c5",
    kategori: "Crypto",
    judul: "Whale",
    isi: "Investor bermodal raksasa yang transaksinya bisa menggerakkan harga pasar.",
    icon: "water-outline",
    warna: "#F7931A",
  },
  {
    id: "c6",
    kategori: "Crypto",
    judul: "FOMO",
    isi: "Fear of Missing Out. Rasa takut ketinggalan tren yang memicu pembelian emosional.",
    icon: "alert-circle-outline",
    warna: "#F7931A",
  },
  {
    id: "c7",
    kategori: "Crypto",
    judul: "Cold Wallet",
    isi: "Penyimpanan crypto offline (Hardware) untuk keamanan maksimal.",
    icon: "hardware-chip-outline",
    warna: "#F7931A",
  },
  {
    id: "c8",
    kategori: "Crypto",
    judul: "Staking",
    isi: "Mengunci crypto di jaringan untuk validasi transaksi dan mendapat bunga.",
    icon: "hourglass-outline",
    warna: "#F7931A",
  },
  {
    id: "c9",
    kategori: "Crypto",
    judul: "Altcoin",
    isi: "Mata uang crypto alternatif selain Bitcoin (seperti ETH, SOL, ADA).",
    icon: "diamond-outline",
    warna: "#F7931A",
  },
  {
    id: "c10",
    kategori: "Crypto",
    judul: "Spot Market",
    isi: "Pasar jual beli crypto secara instan dengan harga saat ini (Real-time).",
    icon: "cart-outline",
    warna: "#F7931A",
  },
  {
    id: "c11",
    kategori: "Crypto",
    judul: "Futures Market",
    isi: "Perdagangan kontrak berjangka dengan sistem leverage (bisa profit saat harga turun).",
    icon: "swap-vertical-outline",
    warna: "#F7931A",
  },
  {
    id: "c12",
    kategori: "Crypto",
    judul: "Burn",
    isi: "Proses penghapusan sejumlah koin secara permanen untuk mengurangi suplai.",
    icon: "bonfire-outline",
    warna: "#F7931A",
  },

  // --- KURS (Identitas Kurs: #85bb65) ---
  {
    id: "k1",
    kategori: "Kurs",
    judul: "Kurs Jual & Beli",
    isi: "Kurs Jual: Bank jual ke kita. Kurs Beli: Bank beli dari kita (kita jual).",
    icon: "cash-outline",
    warna: "#85bb65",
  },
  {
    id: "k2",
    kategori: "Kurs",
    judul: "Inflasi",
    isi: "Kenaikan harga barang secara umum yang menyebabkan nilai uang menurun.",
    icon: "trending-down-outline",
    warna: "#85bb65",
  },
  {
    id: "k3",
    kategori: "Kurs",
    judul: "Safe Haven",
    isi: "Aset yang dianggap aman saat ekonomi dunia sedang krisis (misal: USD, Emas).",
    icon: "umbrella-outline",
    warna: "#85bb65",
  },
  {
    id: "k4",
    kategori: "Kurs",
    judul: "Apresiasi",
    isi: "Kenaikan nilai mata uang suatu negara terhadap mata uang asing.",
    icon: "trending-up-outline",
    warna: "#85bb65",
  },
  {
    id: "k5",
    kategori: "Kurs",
    judul: "Volatility",
    isi: "Besarnya fluktuasi harga mata uang dalam periode waktu tertentu.",
    icon: "pulse-outline",
    warna: "#85bb65",
  },
  {
    id: "k6",
    kategori: "Kurs",
    judul: "Pegged Rate",
    isi: "Kebijakan negara mematok nilai tukar mata uangnya dengan mata uang asing.",
    icon: "pin-outline",
    warna: "#85bb65",
  },
  {
    id: "k7",
    kategori: "Kurs",
    judul: "Remitansi",
    isi: "Layanan pengiriman uang antar negara melalui penyedia jasa keuangan.",
    icon: "paper-plane-outline",
    warna: "#85bb65",
  },

  // --- BANK DIGITAL (Identitas Bank Digital: #009688) ---
  {
    id: "b1",
    kategori: "Bank Digital",
    judul: "Cair Harian",
    isi: "Bunga tabungan yang dihitung dan dikreditkan ke saldo setiap hari.",
    icon: "calendar-outline",
    warna: "#009688",
  },
  {
    id: "b2",
    kategori: "Bank Digital",
    judul: "LPS",
    isi: "Lembaga Penjamin Simpanan. Menjamin dana nasabah hingga 2 Miliar Rupiah.",
    icon: "business-outline",
    warna: "#009688",
  },
  {
    id: "b3",
    kategori: "Bank Digital",
    judul: "Sub-Account",
    isi: "Fitur membuat banyak rekening (Kantong) dalam satu aplikasi untuk budget.",
    icon: "wallet-outline",
    warna: "#009688",
  },
  {
    id: "b4",
    kategori: "Bank Digital",
    judul: "Biaya Admin",
    isi: "Keunggulan utama bank digital adalah gratis biaya bulanan dan transfer.",
    icon: "receipt-outline",
    warna: "#009688",
  },
  {
    id: "b5",
    kategori: "Bank Digital",
    judul: "Tenor Deposito",
    isi: "Jangka waktu penguncian uang, mulai dari 7 hari hingga 1 tahun.",
    icon: "time-outline",
    warna: "#009688",
  },
  {
    id: "b6",
    kategori: "Bank Digital",
    judul: "Neo Bank",
    isi: "Bank yang sepenuhnya beroperasi secara digital tanpa kantor cabang fisik.",
    icon: "phone-portrait-outline",
    warna: "#009688",
  },
  {
    id: "b7",
    kategori: "Bank Digital",
    judul: "KYC Digital",
    isi: "Know Your Customer. Proses verifikasi identitas melalui video call atau liveness.",
    icon: "videocam-outline",
    warna: "#009688",
  },
];

// MENGHAPUS "Semua" dari daftar kategori
const CATEGORIES = [
  "Emas",
  "Reksa Dana",
  "Saham",
  "Crypto",
  "Kurs",
  "Bank Digital",
];

export default function TipsScreen() {
  const { theme, isDark } = useAppTheme();
  // State awal langsung ke "Emas" karena "Semua" sudah dihapus
  const [activeCategory, setActiveCategory] = useState("Emas");
  const [randomQuote, setRandomQuote] = useState(QUOTES[0]);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * QUOTES.length);
    setRandomQuote(QUOTES[randomIndex]);
  }, []);

  const filteredTips = MASTER_TIPS.filter((item) => item.kategori === activeCategory);

  const onShare = async (tip: string) => {
    try {
      await Share.share({ message: tip });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20 }}>
        
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Kamus Investasi</Text>
          <Text style={[styles.headerSub, { color: theme.subText }]}>Pilih kategori untuk mempelajari istilah</Text>
        </View>

        {/* Filter Kategori (Tanpa 'Semua') */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setActiveCategory(cat)}
              style={[
                styles.filterBadge,
                { backgroundColor: theme.card, borderColor: theme.border },
                activeCategory === cat && { backgroundColor: theme.tint, borderColor: theme.tint },
              ]}
            >
              <Text style={[styles.filterText, { color: theme.subText }, activeCategory === cat && styles.filterTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Quote Card */}
        <View style={[styles.quoteCard, isDark && { backgroundColor: "#1e3a3a" }]}>
          <Ionicons name="bulb-outline" size={50} color={isDark ? "#2dd4bf" : "#028090"} style={styles.quoteIcon} />
          <Text style={[styles.quoteText, isDark && { color: "#2dd4bf" }]}>"{randomQuote.text}"</Text>
          <Text style={[styles.quoteAuthor, isDark && { color: "#2dd4bf" }]}>— {randomQuote.author}</Text>
        </View>

        {/* List Kartu Istilah Berdasarkan Filter */}
        {filteredTips.map((item) => (
          <View key={item.id} style={[styles.tipCard, { backgroundColor: theme.card }]}>
            <View style={styles.tipHeader}>
              <View style={[styles.iconBox, { backgroundColor: item.warna + "15" }]}>
                <Ionicons name={item.icon as any} size={22} color={item.warna} />
              </View>
              <View style={[styles.categoryBadge, { backgroundColor: isDark ? theme.background : "#f1f5f9" }]}>
                <Text style={[styles.categoryText, { color: item.warna }]}>{item.kategori}</Text>
              </View>
            </View>

            <Text style={[styles.tipTitle, { color: theme.text }]}>{item.judul}</Text>
            <Text style={[styles.tipDescription, { color: theme.subText }]}>{item.isi}</Text>

            <View style={[styles.cardFooter, { borderTopColor: theme.border }]}>
              <TouchableOpacity style={styles.actionBtn} onPress={() => onShare(`${item.judul}: ${item.isi}`)}>
                <Ionicons name="share-social-outline" size={18} color={theme.subText} />
                <Text style={[styles.actionLabel, { color: theme.subText }]}>Bagikan Istilah</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { marginTop: 10, marginBottom: 15 },
  headerTitle: { fontSize: 26, fontWeight: "900" },
  headerSub: { fontSize: 13, marginTop: 4, opacity: 0.7 },
  filterContainer: { marginBottom: 20, flexDirection: "row" },
  filterBadge: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 14, marginRight: 10, borderWidth: 1 },
  filterText: { fontSize: 13, fontWeight: "600" },
  filterTextActive: { color: "#fff", fontWeight: "bold" },
  quoteCard: { backgroundColor: "#E0F2F1", padding: 22, borderRadius: 24, marginBottom: 25, overflow: "hidden" },
  quoteIcon: { position: "absolute", right: -10, bottom: -10, opacity: 0.1 },
  quoteText: { fontSize: 15, fontStyle: "italic", color: "#028090", fontWeight: "700", lineHeight: 22 },
  quoteAuthor: { fontSize: 11, color: "#028090", marginTop: 8 },
  tipCard: { padding: 18, borderRadius: 22, marginBottom: 15, elevation: 2, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10 },
  tipHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  iconBox: { width: 44, height: 44, borderRadius: 12, justifyContent: "center", alignItems: "center" },
  categoryBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  categoryText: { fontSize: 10, fontWeight: "bold", textTransform: "uppercase" },
  tipTitle: { fontSize: 18, fontWeight: "800", marginBottom: 6 },
  tipDescription: { fontSize: 14, lineHeight: 22, opacity: 0.9 },
  cardFooter: { flexDirection: "row", marginTop: 15, paddingTop: 12, borderTopWidth: 1 },
  actionBtn: { flexDirection: "row", alignItems: "center" },
  actionLabel: { fontSize: 12, marginLeft: 6, fontWeight: "500" },
});