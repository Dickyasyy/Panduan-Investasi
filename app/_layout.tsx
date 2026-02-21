import { Stack } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  StatusBar as RNStatusBar,
  TouchableOpacity,
} from "react-native";
import { ThemeProvider, useAppTheme } from "../components/theme";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";

// Tahan Splash Screen
SplashScreen.preventAutoHideAsync();

function CustomHeader() {
  const { theme, isDark, toggleTheme } = useAppTheme();

  return (
    <View
      style={[
        styles.headerContainer,
        { backgroundColor: isDark ? theme.card : "#028090" },
      ]}
    >
      <StatusBar style="light" />

      {/* Label Created by di pojok kiri */}
      <View style={styles.authorBadge}>
        <Text style={styles.authorText}>Created by</Text>
        <Text style={styles.authorName}>Dickyasyy</Text>
      </View>

      <Text style={styles.headerTitle}>Paham Investasi</Text>

      <TouchableOpacity onPress={toggleTheme} style={styles.iconButton}>
        <Ionicons name={isDark ? "sunny" : "moon"} size={22} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Simulasi loading singkat agar transisi tidak terlalu kasar
    const prepare = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
      } finally {
        setIsReady(true);
      }
    };
    prepare();
  }, []);

  useEffect(() => {
    if (isReady) {
      // Sembunyikan splash screen hanya setelah aplikasi siap
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  if (!isReady) return null;

  return (
    <ThemeProvider>
      <MainStack />
    </ThemeProvider>
  );
}

function MainStack() {
  return (
    <Stack screenOptions={{ headerShadowVisible: false }}>
      <Stack.Screen
        name="(tabs)"
        options={{
          header: () => <CustomHeader />,
          headerShown: true,
        }}
      />
      <Stack.Screen name="detail/emas" options={{ headerShown: false }} />
      <Stack.Screen name="detail/saham" options={{ headerShown: false }} />
      <Stack.Screen name="detail/crypto" options={{ headerShown: false }} />
      <Stack.Screen name="detail/reksaDana" options={{ headerShown: false }} />
      <Stack.Screen name="detail/kurs" options={{ headerShown: false }} />
      <Stack.Screen
        name="detail/bankDigital"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    height: Platform.OS === "ios" ? 100 : 85, // Sedikit ditambah tingginya agar lega
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "android" ? RNStatusBar.currentHeight : 30,
    paddingHorizontal: 15,
    elevation: 4, // shadow untuk android
    shadowColor: "#000", // shadow untuk ios
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
  authorBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignItems: "flex-start",
  },
  authorText: {
    color: "#E0F2F1",
    fontSize: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontWeight: "600",
  },
  authorName: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "900",
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "900",
    letterSpacing: 0.5,
    // Agar judul tetap di tengah meski ada badge di kiri
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
    zIndex: -1,
    paddingTop: Platform.OS === "android" ? RNStatusBar.currentHeight : 30,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
  },
});
