
import { StyleSheet } from 'react-native';

// ESTILOS DA TELA DE DISPOSITIVO

export const styles = StyleSheet.create({
  // Container principal
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    padding: 24,
  },

  // Fundo utilizado no modo escuro
  containerEscuro: {
    backgroundColor: '#0F172A',
  },

  // Título da tela
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0F172A',
  },

  // Subtítulo
  description: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 12,
    textAlign: 'center',
  },

  // Cores dos textos no modo escuro
  textoClaro: {
    color: '#F8FAFC',
  },

  textoSecundarioEscuro: {
    color: '#CBD5E1',
  },

  // Card com as informações do ESP32
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    gap: 8,
  },

  cardEscuro: {
    backgroundColor: '#1E293B',
  },

  // Mensagem apresentada quando o ESP32 está inacessível
  aviso: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginTop: 16,
  },
});