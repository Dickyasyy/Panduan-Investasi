import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppTheme } from "../../components/theme";

export default function EdukasiScreen() {
  const router = useRouter();
  const { theme, isDark } = useAppTheme();

  const menuItems = [
    { id: 'emas', title: 'Emas', desc: 'Aset Aman', icon: 'medal', color: '#FFD700', route: '/detail/emas' }, // Gold yang lebih berkilau
    { id: 'saham', title: 'Saham', desc: 'Ekuitas Bisnis', icon: 'trending-up', color: '#10B981', route: '/detail/saham' }, // Emerald green (bullish market)
    { id: 'reksadana', title: 'Reksa Dana', desc: 'Dana Kolektif', icon: 'stats-chart', color: '#3B82F6', route: '/detail/reksaDana' }, // Blue profesional
    { id: 'crypto', title: 'Crypto', desc: 'Aset Digital', icon: 'logo-bitcoin', color: '#F7931A', route: '/detail/crypto' }, // Bitcoin Orange original
    { id: 'kurs', title: 'Kurs/Forex', desc: 'Valas Dunia', icon: 'cash', color: '#059669', route: '/detail/kurs' }, // Deep Forest Green (money identity)
    { id: 'bankdigital', title: 'Bank Digital', desc: 'Tabungan Baru', icon: 'business', color: '#008080', route: '/detail/bankDigital' }, // Teal perbankan modern
  ];

  return (
    <View style={[styles.mainWrapper, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* BANNER UTAMA (Dulu Header + Highlight) */}
        <TouchableOpacity 
          activeOpacity={0.9}
          style={[styles.highlightCard, { backgroundColor: isDark ? '#1e293b' : '#028090' }]}
          onPress={() => router.push('/tips' as any)}
        >
          <View style={styles.highlightTextContent}>
            <Text style={styles.highlightTitle}>Kamus Investasi</Text>
            <Text style={styles.highlightDesc}>
              Pelajari istilah teknis dan perdalam pengetahuan sebelum mulai berinvestasi.
            </Text>
            <View style={styles.badgeKamus}>
              <Text style={styles.badgeText}>Buka Kamus</Text>
              <Ionicons name="arrow-forward" size={12} color="#fff" />
            </View>
          </View>
          <View style={styles.highlightIconBg}>
            <Ionicons name="library" size={38} color="#fff" />
          </View>
        </TouchableOpacity>

        {/* SECTION TITLE */}
        <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Instrumen Investasi</Text>
            <Ionicons name={"options-outline" as any} size={20} color={theme.subText} />
        </View>

        {/* MENU GRID */}
        <View style={styles.menuGrid}>
          {menuItems.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              activeOpacity={0.7}
              style={[styles.menuCard, { backgroundColor: theme.card, borderColor: theme.border }]} 
              onPress={() => router.push(item.route as any)}
            >
              <View style={[styles.iconBox, { backgroundColor: item.color + '15' }]}>
                <Ionicons name={item.icon as any} size={28} color={item.color} />
              </View>
              <View style={styles.textContainer}>
                <Text style={[styles.menuText, { color: theme.text }]}>{item.title}</Text>
                <Text style={[styles.menuDesc, { color: theme.subText }]}>{item.desc}</Text>
              </View>
              <View style={[styles.arrowCircle, { backgroundColor: isDark ? '#334155' : '#f1f5f9' }]}>
                <Ionicons name="chevron-forward" size={12} color={item.color} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 25, paddingBottom: 40 },
  
  highlightCard: {
    flexDirection: 'row',
    padding: 24,
    borderRadius: 28,
    marginBottom: 35,
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 6 }
  },
  highlightTextContent: { flex: 1, marginRight: 15 },
  highlightTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 6 },
  highlightDesc: { color: 'rgba(255,255,255,0.8)', fontSize: 13, lineHeight: 19, marginBottom: 12 },
  badgeKamus: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'rgba(255,255,255,0.2)', 
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 5
  },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  highlightIconBg: { width: 65, height: 65, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, justifyContent: 'center', alignItems: 'center' },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, paddingHorizontal: 5 },
  sectionTitle: { fontSize: 19, fontWeight: 'bold' },
  
  menuGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  menuCard: {
    width: '48%',
    padding: 18,
    borderRadius: 26,
    marginBottom: 16,
    borderWidth: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  iconBox: { width: 50, height: 50, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 14 },
  textContainer: { width: '100%' },
  menuText: { fontSize: 15, fontWeight: 'bold' },
  menuDesc: { fontSize: 11, marginTop: 3, fontWeight: '500', opacity: 0.6 },
  arrowCircle: { position: 'absolute', top: 18, right: 18, width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center' }
});