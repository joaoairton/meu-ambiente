
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

export default function DeviceScreen() {
  const { modoEscuro } = useTheme();

  return (
    <View
      style={[
        styles.container,
        modoEscuro && styles.containerEscuro,
      ]}
    >
      <Text
        style={[
          styles.title,
          modoEscuro && styles.textoClaro,
        ]}
      >
        Dispositivo
      </Text>

      <Text
        style={[
          styles.description,
          modoEscuro && styles.textoSecundarioEscuro,
        ]}
      >
        Informações do ESP32 e do sensor DHT11.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    padding: 24,
  },

  containerEscuro: {
    backgroundColor: '#0F172A',
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0F172A',
  },

  description: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 12,
    textAlign: 'center',
  },

  textoClaro: {
    color: '#F8FAFC',
  },

  textoSecundarioEscuro: {
    color: '#CBD5E1',
  },
});
