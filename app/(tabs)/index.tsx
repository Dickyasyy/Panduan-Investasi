import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppTheme } from "../../components/theme";

export default function EdukasiScreen() {
  const router = useRouter();
  const { theme } = useAppTheme(); 

  const menuItems = [
    { id: 'emas', title: 'Emas', icon: 'medal', color: '#D4AF37', route: '/detail/emas' },
    { id: 'saham', title: 'Saham', icon: 'trending-up', color: '#4CAF50', route: '/detail/saham' },
    { id: 'reksadana', title: 'Reksa Dana', icon: 'stats-chart', color: '#2196F3', route: '/detail/reksaDana' },
    { id: 'crypto', title: 'Crypto', icon: 'logo-bitcoin', color: '#F7931A', route: '/detail/crypto' },
    { id: 'kurs', title: 'Kurs/Forex', icon: 'cash', color: '#85bb65', route: '/detail/kurs' },
  ];

  return (
    <View style={[styles.mainWrapper, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Mulai Belajar</Text>
          <Text style={[styles.headerSub, { color: theme.subText }]}>Pilih instrumen untuk memahami risikonya</Text>
        </View>

        <View style={styles.menuGrid}>
          {menuItems.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={[styles.menuCard, { backgroundColor: theme.card }]} 
              onPress={() => router.push(item.route as any)}
            >
              <View style={[styles.iconBox, { backgroundColor: item.color + '15' }]}>
                <Ionicons name={item.icon as any} size={30} color={item.color} />
              </View>
              <Text style={[styles.menuText, { color: theme.text }]}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 40 },
  header: { marginTop: 10, marginBottom: 20 },
  headerTitle: { fontSize: 26, fontWeight: 'bold' },
  headerSub: { fontSize: 14, marginTop: 4 },
  menuGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  menuCard: {
    width: '48%',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  iconBox: { width: 60, height: 60, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  menuText: { fontSize: 14, fontWeight: 'bold' }
});