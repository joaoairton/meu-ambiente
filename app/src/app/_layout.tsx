
import { Stack } from 'expo-router';

import { UserProvider } from '../contexts/UserContext';
import { ThemeProvider } from '../contexts/ThemeContext';

// Layout principal do aplicativo
// Configura a navegação e disponibiliza os contextos globais
export default function RootLayout() {
  return (
    // Compartilha os dados do usuário entre as telas
    <UserProvider>
      {/* Compartilha as configurações de tema claro e escuro */}
      <ThemeProvider>
        {/* Define a navegação principal sem cabeçalhos */}
        <Stack screenOptions={{ headerShown: false }}>
          {/* Tela inicial de login */}
          <Stack.Screen name="index" />

          {/* Grupo de telas com navegação por abas */}
          <Stack.Screen name="(tabs)" />
        </Stack>
      </ThemeProvider>
    </UserProvider>
  );
}