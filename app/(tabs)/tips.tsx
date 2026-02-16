import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../components/theme'; 

const QUOTES = [
    { text: "Jangan menaruh semua telur dalam satu keranjang.", author: "Diversifikasi Aset" },
    { text: "Investasi terbaik adalah investasi pada diri sendiri (ilmu).", author: "Benjamin Franklin" },
    { text: "Risiko datang dari ketidaktahuan Anda tentang apa yang sedang Anda lakukan.", author: "Warren Buffett" },
    { text: "Pasar saham adalah alat untuk mentransfer uang dari yang tidak sabar ke yang sabar.", author: "Warren Buffett" },
    { text: "Masa pensiun dimulai sekarang, bukan nanti saat Anda tua.", author: "Pepatah Finansial" },
    { text: "Bukan berapa banyak uang yang Anda hasilkan, tapi berapa banyak yang Anda simpan.", author: "Robert Kiyosaki" }
  ];

const MASTER_TIPS = [
    { id: 'e1', kategori: 'Emas', judul: 'Buyback', isi: 'Harga yang dipatok toko/Antam saat kita menjual kembali emas ke mereka.', icon: 'medal-outline', warna: '#D4AF37' },
    { id: 'e2', kategori: 'Emas', judul: 'Spread', isi: 'Selisih harga antara harga jual (kita beli) dan harga beli (kita jual).', icon: 'swap-horizontal-outline', warna: '#D4AF37' },
    { id: 'e3', kategori: 'Emas', judul: 'Karat', isi: 'Ukuran kemurnian emas. 24 Karat berarti emas murni 99.9%.', icon: 'color-filter-outline', warna: '#D4AF37' },
    { id: 'e4', kategori: 'Emas', judul: 'Troy Ounce', isi: 'Satuan berat emas internasional. 1 Troy Ounce setara 31,1 gram.', icon: 'scale-outline', warna: '#D4AF37' },
    { id: 'e5', kategori: 'Emas', judul: 'Pool Account', isi: 'Saldo emas digital tanpa harus memegang fisik emasnya secara langsung.', icon: 'cloud-outline', warna: '#D4AF37' },
    { id: 'r1', kategori: 'Reksa Dana', judul: 'NAV / NAB', isi: 'Net Asset Value. Harga satuan reksa dana yang dihitung setiap hari bursa.', icon: 'stats-chart-outline', warna: '#2196F3' },
    { id: 'r2', kategori: 'Reksa Dana', judul: 'Expense Ratio', isi: 'Total biaya operasional pengelolaan. Semakin kecil, semakin efisien reksa dana tersebut.', icon: 'pie-chart-outline', warna: '#2196F3' },
    { id: 'r3', kategori: 'Reksa Dana', judul: 'Manajer Investasi', isi: 'Perusahaan profesional yang mengelola dana kolektif di reksa dana.', icon: 'briefcase-outline', warna: '#2196F3' },
    { id: 'r4', kategori: 'Reksa Dana', judul: 'Bank Kustodian', isi: 'Bank yang bertugas menyimpan aset dan administrasi reksa dana secara aman.', icon: 'business-outline', warna: '#2196F3' },
    { id: 'r5', kategori: 'Reksa Dana', judul: 'Prospektus', isi: 'Dokumen profil lengkap mengenai aturan dan strategi produk reksa dana.', icon: 'document-text-outline', warna: '#2196F3' },
    { id: 'r6', kategori: 'Reksa Dana', judul: 'Lump Sum', isi: 'Strategi investasi dengan memasukkan dana besar sekaligus di awal.', icon: 'wallet-outline', warna: '#2196F3' },
    { id: 's1', kategori: 'Saham', judul: 'Lot', isi: 'Satuan terkecil jual beli saham di Indonesia. 1 Lot = 100 lembar saham.', icon: 'layers-outline', warna: '#4CAF50' },
    { id: 's2', kategori: 'Saham', judul: 'Dividen', isi: 'Bagian laba perusahaan yang dibagikan kepada para pemegang saham.', icon: 'gift-outline', warna: '#4CAF50' },
    { id: 's3', kategori: 'Saham', judul: 'Capital Gain', isi: 'Keuntungan dari selisih harga jual saham yang lebih tinggi dari harga beli.', icon: 'trending-up-outline', warna: '#4CAF50' },
    { id: 's4', kategori: 'Saham', judul: 'Blue Chip', isi: 'Saham perusahaan besar dengan reputasi tinggi dan laba stabil.', icon: 'ribbon-outline', warna: '#4CAF50' },
    { id: 's5', kategori: 'Saham', judul: 'IPO', isi: 'Initial Public Offering. Saat perusahaan pertama kali menjual saham ke publik.', icon: 'rocket-outline', warna: '#4CAF50' },
    { id: 's6', kategori: 'Saham', judul: 'Bullish & Bearish', isi: 'Bullish adalah tren pasar naik, sedangkan Bearish adalah tren pasar turun.', icon: 'analytics-outline', warna: '#4CAF50' },
    { id: 'c1', kategori: 'Crypto', judul: 'HODL', isi: 'Strategi menyimpan aset jangka panjang meski harga sedang turun drastis.', icon: 'lock-closed-outline', warna: '#F7931A' },
    { id: 'c2', kategori: 'Crypto', judul: 'Halving', isi: 'Pemotongan suplai baru Bitcoin setiap 4 tahun yang memicu kenaikan harga.', icon: 'cut-outline', warna: '#F7931A' },
    { id: 'c3', kategori: 'Crypto', judul: 'Stablecoin', isi: 'Aset crypto yang harganya dipatok 1:1 dengan mata uang asli seperti Dollar.', icon: 'shield-outline', warna: '#F7931A' },
    { id: 'c4', kategori: 'Crypto', judul: 'Gas Fee', isi: 'Biaya transaksi yang harus dibayar saat mengirim atau memproses aset crypto.', icon: 'flame-outline', warna: '#F7931A' },
    { id: 'c5', kategori: 'Crypto', judul: 'Whale', isi: 'Investor dengan modal raksasa yang transaksinya bisa menggerakkan harga pasar.', icon: 'water-outline', warna: '#F7931A' },
    { id: 'k1', kategori: 'Kurs', judul: 'Kurs Jual & Beli', isi: 'Kurs Jual: Bank jual ke kita. Kurs Beli: Bank beli dari kita (kita jual).', icon: 'cash-outline', warna: '#85bb65' },
    { id: 'k2', kategori: 'Kurs', judul: 'Inflasi', isi: 'Kenaikan harga barang secara umum yang menyebabkan nilai uang menurun.', icon: 'trending-down-outline', warna: '#85bb65' },
    { id: 'k3', kategori: 'Kurs', judul: 'Safe Haven', isi: 'Mata uang atau aset yang dianggap aman saat ekonomi dunia sedang krisis.', icon: 'umbrella-outline', warna: '#85bb65' },
    { id: 'k4', kategori: 'Kurs', judul: 'Apresiasi', isi: 'Kenaikan nilai mata uang suatu negara terhadap mata uang asing.', icon: 'trending-up-outline', warna: '#85bb65' },
  ];

const CATEGORIES = ['Semua', 'Emas', 'Reksa Dana', 'Saham', 'Crypto', 'Kurs'];

export default function TipsScreen() {
  const { theme, isDark } = useAppTheme(); // Menggunakan Global Theme
  const [activeCategory, setActiveCategory] = useState('Semua');

  const [randomQuote, setRandomQuote] = useState(QUOTES[0]);
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * QUOTES.length);
    setRandomQuote(QUOTES[randomIndex]);
  }, []);

  const filteredTips = activeCategory === 'Semua' 
    ? MASTER_TIPS 
    : MASTER_TIPS.filter(item => item.kategori === activeCategory);

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
          <Text style={[styles.headerSub, { color: theme.subText }]}>Klik kategori untuk memfilter istilah</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity 
              key={cat} 
              onPress={() => setActiveCategory(cat)}
              style={[
                styles.filterBadge, 
                { backgroundColor: theme.card, borderColor: theme.border },
                activeCategory === cat && { backgroundColor: theme.tint, borderColor: theme.tint }
              ]}
            >
              <Text style={[
                styles.filterText, 
                { color: theme.subText },
                activeCategory === cat && styles.filterTextActive
              ]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={[styles.quoteCard, isDark && { backgroundColor: '#1e3a3a' }]}>
          <Ionicons name={"bulb-outline" as any} size={50} color={isDark ? "#2dd4bf" : "#028090"} style={styles.quoteIcon} />
          <Text style={[styles.quoteText, isDark && { color: '#2dd4bf' }]}>"{randomQuote.text}"</Text>
          <Text style={[styles.quoteAuthor, isDark && { color: '#2dd4bf' }]}>— {randomQuote.author}</Text>
        </View>

        {filteredTips.map((item) => (
          <View key={item.id} style={[styles.tipCard, { backgroundColor: theme.card }]}>
            <View style={styles.tipHeader}>
              <View style={[styles.iconBox, { backgroundColor: item.warna + '15' }]}>
                <Ionicons name={item.icon as any} size={22} color={item.warna} />
              </View>
              <View style={[styles.categoryBadge, { backgroundColor: isDark ? theme.background : '#f1f5f9' }]}>
                <Text style={[styles.categoryText, { color: item.warna }]}>{item.kategori}</Text>
              </View>
            </View>

            <Text style={[styles.tipTitle, { color: theme.text }]}>{item.judul}</Text>
            <Text style={[styles.tipDescription, { color: theme.subText }]}>{item.isi}</Text>

            <View style={[styles.cardFooter, { borderTopColor: theme.border }]}>
              <TouchableOpacity style={styles.actionBtn} onPress={() => onShare(`${item.judul}: ${item.isi}`)}>
                <Ionicons name={"share-social-outline" as any} size={18} color={theme.subText} />
                <Text style={[styles.actionLabel, { color: theme.subText }]}>Bagikan</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn}>
                <Ionicons name={"bookmark-outline" as any} size={18} color={theme.subText} />
                <Text style={[styles.actionLabel, { color: theme.subText }]}>Simpan</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
        
        {filteredTips.length === 0 && (
            <Text style={{textAlign: 'center', color: theme.subText, marginTop: 20}}>Belum ada data untuk kategori ini.</Text>
        )}

        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    marginTop: 10, 
    marginBottom: 10,
    paddingHorizontal: 0,
  },
  headerTitle: { 
    fontSize: 24,
    fontWeight: 'bold', 
  },
  filterContainer: { 
    marginBottom: 15,
    flexDirection: 'row' 
  },
  headerSub: { fontSize: 13, marginTop: 4 },
  filterBadge: { 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    borderRadius: 12, 
    marginRight: 10,
    borderWidth: 1,
  },
  filterText: { fontSize: 13, fontWeight: '500' },
  filterTextActive: { color: '#fff', fontWeight: 'bold' },

  quoteCard: { backgroundColor: '#E0F2F1', padding: 20, borderRadius: 20, marginBottom: 25, overflow: 'hidden' },
  quoteIcon: { position: 'absolute', right: -10, bottom: -10, opacity: 0.1 },
  quoteText: { fontSize: 15, fontStyle: 'italic', color: '#028090', fontWeight: '600', lineHeight: 22 },
  quoteAuthor: { fontSize: 11, color: '#028090', marginTop: 8 },

  tipCard: { padding: 18, borderRadius: 20, marginBottom: 15, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 },
  tipHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  iconBox: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  categoryBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  categoryText: { fontSize: 9, fontWeight: 'bold' },
  
  tipTitle: { fontSize: 17, fontWeight: 'bold', marginBottom: 6 },
  tipDescription: { fontSize: 13, lineHeight: 20 },

  cardFooter: { flexDirection: 'row', marginTop: 15, paddingTop: 12, borderTopWidth: 1, gap: 20 },
  actionBtn: { flexDirection: 'row', alignItems: 'center' },
  actionLabel: { fontSize: 11, marginLeft: 5 }
});