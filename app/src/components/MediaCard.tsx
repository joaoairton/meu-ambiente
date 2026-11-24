
import { View, Text } from 'react-native';
import Feather from '@expo/vector-icons/Feather';

import { useTheme } from '../contexts/ThemeContext';
import { styles } from '../styles/mediaCardStyles';

// Propriedades utilizadas para reutilizar o componente
// na exibição das médias de temperatura e umidade.
type MediaCardProps = {
  titulo: string;
  valor: number | null;
  unidade: string;
  icone: 'thermometer' | 'droplet';
};

export default function MediaCard({
  titulo,
  valor,
  unidade,
  icone,
}: MediaCardProps) {
  // Identifica o tema selecionado no aplicativo
  const { modoEscuro } = useTheme();

  return (
    <View
      style={[
        styles.card,
        modoEscuro && styles.cardEscuro,
      ]}
    >
      {/* Ícone correspondente à variável monitorada */}
      <Feather
        name={icone}
        size={24}
        color="#2563EB"
      />

      {/* Identificação da média exibida */}
      <Text
        style={[
          styles.titulo,
          modoEscuro && styles.tituloEscuro,
        ]}
      >
        {titulo}
      </Text>

      {/* Exibe a média com uma casa decimal ou '--' quando não há dados */}
      <Text
        style={[
          styles.valor,
          modoEscuro && styles.valorEscuro,
        ]}
      >
        {valor !== null ? valor.toFixed(1) : '--'}
        <Text style={styles.unidade}>
          {unidade}
        </Text>
      </Text>
    </View>
  );
}