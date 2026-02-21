import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, StyleSheet, Platform } from "react-native";
import { useAppTheme } from "../../components/theme";

export default function TabLayout() {
  const { theme, isDark } = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#028090", 
        tabBarInactiveTintColor: theme.subText,
        // Pengaturan label agar lebih rapat ke ikon
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "700",
          marginTop: -5, // Menaikkan label sedikit agar tidak terlalu jauh dari ikon
          marginBottom: Platform.OS === "ios" ? 0 : 10,
        },
        tabBarStyle: {
          height: Platform.OS === "ios" ? 85 : 65, // Tinggi yang lebih slim
          backgroundColor: theme.card,
          borderTopWidth: 1,
          borderTopColor: theme.border,
          elevation: 5,
          paddingTop: 5,
        },
        // Memastikan item berada di tengah secara vertikal
        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Belajar",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.activeIndicator]}>
              <Ionicons 
                name={focused ? "book" : "book-outline"} 
                size={22} 
                color={focused ? "#028090" : color} 
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="perbandingan"
        options={{
          title: "Pasar",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.activeIndicator]}>
              <Ionicons 
                name={focused ? "stats-chart" : "stats-chart-outline"} 
                size={22} 
                color={focused ? "#028090" : color} 
              />
            </View>
          ),
        }}
      />
      
      <Tabs.Screen
        name="quiz"
        options={{
          title: "Kuis",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.activeIndicator]}>
              <Ionicons 
                name={focused ? "checkmark-circle" : "checkmark-circle-outline"} 
                size={22} 
                color={focused ? "#028090" : color} 
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="tips"
        options={{
          title: "Panduan",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.activeIndicator]}>
              <Ionicons 
                name={focused ? "bulb" : "bulb-outline"} 
                size={22} 
                color={focused ? "#028090" : color} 
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="profile" 
        options={{
          title: "Profil",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.activeIndicator]}>
              <Ionicons 
                name={focused ? "person" : "person-outline"} 
                size={22} 
                color={focused ? "#028090" : color} 
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 30, // Tinggi kapsul diperkecil
    width: 50,  // Lebar kapsul diperkecil agar tidak menempel antar menu
    borderRadius: 15,
    marginBottom: 4, // Memberi jarak ke label
  },
  activeIndicator: {
    backgroundColor: "rgba(2, 128, 144, 0.2)", 
  }
});