
import { Stack } from 'expo-router';
import { UserProvider } from '../contexts/UserContext';

export default function RootLayout() {
  return (
    // UserProvider: Login, Home, Dispositivo e Configurações podem acessar o mesmo nome
    <UserProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </UserProvider>
  );
}
