import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Data Konfigurasi Lengkap
const DATA_INVESTASI = {
  'Pasar Uang': {
    return: '5',
    color: '#E8EAF6',
    desc: 'Wadah investasi pada instrumen pasar uang (deposito, obligasi < 1thn). Paling stabil.',
    plus: ['Risiko Paling Rendah', 'Bisa Cair Kapan Saja', 'Bebas Pajak'],
    minus: ['Return Relatif Kecil', 'Bukan untuk Kekayaan Cepat', 'Dipengaruhi Suku Bunga BI'],
  },
  'Obligasi Negara': {
    return: '6.5',
    color: '#FFF8E1',
    desc: 'Surat berharga yang diterbitkan negara (ORI, SBR, SR, ST). Modal dijamin 100% oleh UU.',
    plus: ['Dijamin Negara (Tanpa Risiko Gagal Bayar)', 'Kupon/Bunga Tiap Bulan', 'Membangun Negeri'],
    minus: ['Ada Masa Penawaran', 'Modal Terkunci (SBR/ST)', 'Pajak Kupon 10%'],
  },
  'Pendapatan Tetap': {
    return: '8',
    color: '#E1F5FE',
    desc: 'Investasi yang mayoritas dananya ditaruh di surat hutang (obligasi) korporasi atau negara.',
    plus: ['Return Stabil & Rutin', 'Di Atas Inflasi/Deposito', 'Cocok untuk 1-3 Tahun'],
    minus: ['Risiko Gagal Bayar Korporasi', 'Pencairan T+2 Hari', 'Harga Bisa Fluktuasi'],
  },
  'Saham': {
    return: '15',
    color: '#EDE7F6',
    desc: 'Dana dikelola MI untuk dibelikan saham perusahaan di Bursa Efek Indonesia (BEI).',
    plus: ['Potensi Profit Tertinggi', 'Pertumbuhan Jangka Panjang', 'Diversifikasi Banyak Saham'],
    minus: ['Risiko Sangat Tinggi', 'Nilai Bisa Turun Tajam', 'Min. Jangka >5 Tahun'],
  }
};

type JenisInv = 'Pasar Uang' | 'Obligasi Negara' | 'Pendapatan Tetap' | 'Saham';

export default function DetailReksaDana() {
  const router = useRouter();

  const [selectedType, setSelectedType] = useState<JenisInv>('Pasar Uang');
  const [setoran, setSetoran] = useState('1000000');
  const [tenor, setTenor] = useState('5');
  const [returnExpectation, setReturnExpectation] = useState(DATA_INVESTASI['Pasar Uang'].return);

  const handleTypeChange = (type: JenisInv) => {
    setSelectedType(type);
    setReturnExpectation(DATA_INVESTASI[type].return);
  };

  const calculateInvestment = () => {
    const P = parseFloat(setoran) || 0;
    const r = (parseFloat(returnExpectation) || 0) / 100;
    const t = parseFloat(tenor) || 0;
    return P * Math.pow((1 + r), t);
  };

  const hasilSimulasi = calculateInvestment();

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 80 }}
    >
      <Stack.Screen options={{ headerShown: false }} />

      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={24} color="#3F51B5" />
      </TouchableOpacity>

      <View style={styles.headerSection}>
      <Text style={styles.emoji}>🏦</Text>
        <Text style={styles.title}>Reksa Dana</Text>
        <Text style={styles.subtitle}>Investasi Kolektif Dikelola Profesional</Text>
      </View>

      {/* 1. PENGERTIAN DINAMIS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Apa itu {selectedType}?</Text>
        <Text style={styles.bodyText}>
          {DATA_INVESTASI[selectedType].desc} 
          {selectedType === 'Obligasi Negara' && " Produk ini meliputi ORI (Obligasi Negara Ritel), SBR (Savings Bond Ritel), SR (Sukuk Ritel), dan ST (Sukuk Tabungan)."}
        </Text>
      </View>

      {/* 2. PILIH JENIS */}
      <Text style={styles.sectionTitle}>Pilih Jenis Instrumen</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeScroll}>
        {(Object.keys(DATA_INVESTASI) as JenisInv[]).map((type) => (
          <TouchableOpacity 
            key={type}
            style={[
              styles.typeCard, 
              { backgroundColor: DATA_INVESTASI[type].color },
              selectedType === type && styles.typeCardActive
            ]}
            onPress={() => handleTypeChange(type)}
          >
            <Text style={styles.typeTitle}>{type}</Text>
            <Text style={styles.typeDesc}>Est: {DATA_INVESTASI[type].return}%/thn</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 3. SIMULASI */}
      <View style={styles.calcCard}>
        <Text style={styles.calcTitle}>📈 Simulasi Pertumbuhan</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Modal Awal (IDR):</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={setoran}
            onChangeText={setSetoran}
          />
        </View>

        <View style={styles.row}>
          <View style={{ width: '45%' }}>
            <Text style={styles.label}>Tahun:</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={tenor}
              onChangeText={setTenor}
            />
          </View>
          <View style={{ width: '45%' }}>
            <Text style={styles.label}>Estimasi Return (%):</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={returnExpectation}
              onChangeText={setReturnExpectation}
            />
          </View>
        </View>

        <View style={styles.resultBox}>
          <Text style={styles.resultLabel}>Proyeksi Nilai Akhir:</Text>
          <Text style={styles.resultValue}>
            Rp {hasilSimulasi.toLocaleString('id-ID', { maximumFractionDigits: 0 })}
          </Text>
        </View>
      </View>

      {/* 4. PLUS MINUS DINAMIS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Plus & Minus {selectedType}</Text>
        <View style={styles.row}>
          <View style={[styles.infoCard, { backgroundColor: '#E8F5E9' }]}>
            <Text style={[styles.infoTitle, { color: '#2E7D32' }]}>✅ Kelebihan</Text>
            {DATA_INVESTASI[selectedType].plus.map((txt, i) => (
              <Text key={i} style={styles.infoBody}>• {txt}</Text>
            ))}
          </View>
          <View style={[styles.infoCard, { backgroundColor: '#FFEBEE' }]}>
            <Text style={[styles.infoTitle, { color: '#C62828' }]}>⚠️ Risiko</Text>
            {DATA_INVESTASI[selectedType].minus.map((txt, i) => (
              <Text key={i} style={styles.infoBody}>• {txt}</Text>
            ))}
          </View>
        </View>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFF', padding: 20 },
  backBtn: { marginTop: 40, marginBottom: 10 },
  headerSection: { alignItems: 'center', marginBottom: 25 },
  emoji: { fontSize: 50, marginBottom: 5 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#3F51B5' },
  subtitle: { fontSize: 13, color: '#666' },

  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  bodyText: { fontSize: 14, lineHeight: 22, color: '#555', marginBottom: 10 },

  typeScroll: { flexDirection: 'row', marginBottom: 20 },
  typeCard: { padding: 15, borderRadius: 15, marginRight: 12, width: 145, borderWidth: 2, borderColor: 'transparent' },
  typeCardActive: { borderColor: '#3F51B5' },
  typeTitle: { fontWeight: 'bold', fontSize: 12, color: '#3F51B5', marginBottom: 5 },
  typeDesc: { fontSize: 10, color: '#666' },

  calcCard: { backgroundColor: '#FFF', padding: 20, borderRadius: 20, elevation: 4, marginBottom: 25 },
  calcTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 20, color: '#3F51B5' },
  inputGroup: { marginBottom: 15 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  label: { fontSize: 11, color: '#888', marginBottom: 5 },
  input: { borderBottomWidth: 2, borderBottomColor: '#3F51B5', fontSize: 18, fontWeight: 'bold', color: '#333', paddingVertical: 5 },
  
  resultBox: { backgroundColor: '#E8EAF6', padding: 15, borderRadius: 15, marginTop: 10 },
  resultLabel: { fontSize: 11, color: '#3F51B5', fontWeight: 'bold' },
  resultValue: { fontSize: 22, fontWeight: 'bold', color: '#1A237E', marginTop: 5 },

  infoCard: { width: '48%', padding: 12, borderRadius: 15, elevation: 1 },
  infoTitle: { fontWeight: 'bold', fontSize: 12, marginBottom: 8 },
  infoBody: { fontSize: 10, color: '#444', lineHeight: 15, marginBottom: 4 },
});