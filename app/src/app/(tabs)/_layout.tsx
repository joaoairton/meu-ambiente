
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../contexts/ThemeContext';

// Configura a navegação inferior entre as telas do aplicativo
export default function TabsLayout() {
  // Recupera o tema atual para personalizar a navegação
  const { modoEscuro } = useTheme();

  return (
    <Tabs
      screenOptions={{
        // Oculta o cabeçalho padrão das telas
        headerShown: false,

        // Define as cores dos ícones ativos e inativos
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#94A3B8',

        // Personaliza a barra inferior conforme o tema
        tabBarStyle: {
          backgroundColor: modoEscuro ? '#1E293B' : '#FFFFFF',
          borderTopColor: modoEscuro ? '#334155' : '#E2E8F0',
        },

        // Define a cor de fundo das telas conforme o tema
        sceneStyle: {
          backgroundColor: modoEscuro ? '#0F172A' : '#F1F5F9',
        },
      }}
    >
      {/* Aba principal: monitoramento dos sensores */}
      <Tabs.Screen
        name="home"
        options={{
          title: 'Início',
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="home-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* Aba de informações e conectividade do ESP32 */}
      <Tabs.Screen
        name="dispositivo"
        options={{
          title: 'Dispositivo',
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="hardware-chip-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* Aba de configurações e gerenciamento da sessão */}
      <Tabs.Screen
        name="configuracoes"
        options={{
          title: 'Configurações',
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="settings-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}