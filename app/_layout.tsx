import { Stack } from "expo-router";
import { View, Text, StyleSheet, Platform, StatusBar as RNStatusBar, TouchableOpacity } from "react-native";
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
    <View style={[
      styles.headerContainer,
      { backgroundColor: isDark ? theme.card : "#028090" },
    ]}>
      <StatusBar style="light" />
      <View style={{ width: 40 }} />
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
        await new Promise(resolve => setTimeout(resolve, 500)); 
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
      <Stack.Screen name="detail/bankDigital" options={{ headerShown: false }} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    height: Platform.OS === "ios" ? 85 : 75,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "android" ? RNStatusBar.currentHeight : 20,
    paddingHorizontal: 15,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});