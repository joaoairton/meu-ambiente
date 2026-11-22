
import { Stack } from 'expo-router';
import { UserProvider } from '../contexts/UserContext';
import { ThemeProvider } from '../contexts/ThemeContext';

export default function RootLayout() {
  return (
    <UserProvider>
      <ThemeProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </ThemeProvider>
    </UserProvider>
  );
}