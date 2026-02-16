import React, { createContext, useContext, useState } from 'react';
import { useColorScheme } from 'react-native';

// 1. Definisikan tipe data untuk warna agar TS tidak bingung
interface ThemeColors {
  background: string;
  card: string;
  text: string;
  subText: string;
  border: string;
  tint: string;
}

export const ThemeData: { light: ThemeColors; dark: ThemeColors } = {
  light: {
    background: '#f8fafc',
    card: '#ffffff',
    text: '#1e293b',
    subText: '#64748b',
    border: '#e2e8f0',
    tint: '#028090',
  },
  dark: {
    background: '#0f172a',
    card: '#1e293b',
    text: '#f8fafc',
    subText: '#94a3b8',
    border: '#334155',
    tint: '#028090',
  }
};

// 2. Definisikan tipe data untuk isi Context
interface ThemeContextType {
  theme: ThemeColors;
  isDark: boolean;
  toggleTheme: () => void;
}

// 3. Buat Context dengan tipe data yang jelas
const ThemeContext = createContext<ThemeContextType>({
  theme: ThemeData.light,
  isDark: false,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemScheme === 'dark');

  const toggleTheme = () => setIsDark((prev) => !prev);
  const theme = isDark ? ThemeData.dark : ThemeData.light;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => useContext(ThemeContext);