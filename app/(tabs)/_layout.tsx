import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "../../components/theme"; // Import hook tema

export default function TabLayout() {
  const { theme, isDark } = useAppTheme(); // Ambil data tema

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#028090", // Warna saat icon aktif
        tabBarInactiveTintColor: theme.subText, // Warna saat icon tidak aktif
        tabBarStyle: { 
          height: 60, 
          paddingBottom: 8,
          borderTopWidth: 1, 
          // Border atas disesuaikan agar tidak terlalu mencolok di dark mode
          borderTopColor: theme.border, 
          backgroundColor: theme.card, // Warna background tab bar
          elevation: 10,
          shadowColor: "#000",
          shadowOpacity: 0.1,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Edukasi",
          tabBarIcon: ({ color }) => (
            <Ionicons name="book" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="perbandingan"
        options={{
          title: "Perbandingan",
          tabBarIcon: ({ color }) => (
            <Ionicons name="bar-chart" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tips"
        options={{
          title: "Tips Panduan",
          tabBarIcon: ({ color }) => (
            <Ionicons name="bulb" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}