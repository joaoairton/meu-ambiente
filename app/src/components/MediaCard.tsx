
import { View, Text, StyleSheet } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { useTheme } from '../contexts/ThemeContext';

// Propriedades que permitem reutilizar o card para diferentes variáveis
type MediaCardProps = {
  titulo: string;
  valor: number | null;
  unidade: string;
  icone: 'thermometer' | 'droplet';
};

// Exibe a média calculada com suporte aos modos claro e escuro
export default function MediaCard({
  titulo,
  valor,
  unidade,
  icone,
}: MediaCardProps) {
  const { modoEscuro } = useTheme();

  return (
    <View
      style={[
        styles.card,
        modoEscuro && { backgroundColor: '#1E293B' },
      ]}
    >
      <Feather name={icone} size={24} color="#2563EB" />

      <Text
        style={[
          styles.titulo,
          modoEscuro && { color: '#CBD5E1' },
        ]}
      >
        {titulo}
      </Text>

      <Text
        style={[
          styles.valor,
          modoEscuro && { color: '#F8FAFC' },
        ]}
      >
        {valor !== null ? valor.toFixed(1) : '--'}
        <Text style={styles.unidade}>{unidade}</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    elevation: 2,
  },
  titulo: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
  },
  valor: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  unidade: {
    fontSize: 15,
    color: '#94A3B8',
  },
});