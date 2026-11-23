
import { Image, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useEffect, useState } from 'react';

const API_URL = 'http://192.168.1.9/api/status';

type StatusDispositivo = {
  status: string;
  dispositivo: string;
  wifi: string;
  ip: string;
  sinal_wifi: number;
};

export default function DeviceScreen() {
  const { modoEscuro } = useTheme();
  const estiloInfo = modoEscuro ? styles.textoClaro : undefined;

const [dados, setDados] = useState<StatusDispositivo | null>(null);

// consulta o ESP32 a cada 5 segundos e armazena os dados recebidos no estado dados
useEffect(() => {
  async function buscarStatus() {
    try {
      const resposta = await fetch(API_URL);

      if (!resposta.ok) {
        throw new Error('Erro na comunicação com o ESP32');
      }

      const resultado: StatusDispositivo = await resposta.json();
      setDados(resultado);
    } catch (erro) {
      console.log('Erro ao consultar dispositivo:', erro);
      setDados(null);
    }
  }

  buscarStatus();

  const intervalo = setInterval(buscarStatus, 5000);

  return () => clearInterval(intervalo);
}, []);

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

      <Image
        source={require('../../../assets/images/esp32.png')}
        style={{ width: 180, height: 180 }}
        resizeMode="contain"
      />

      <Text
        style={[
          styles.description,
          modoEscuro && styles.textoSecundarioEscuro,
        ]}
      >
        Status
      </Text>
      {dados ? (
        <View style={[styles.card, modoEscuro && styles.cardEscuro]}>
          <Text style={estiloInfo}>
            Modelo: {dados.dispositivo}
          </Text>
          <Text style={estiloInfo}>
            Status: {dados.status}
          </Text>
          <Text style={estiloInfo}>
            Wi-Fi: {dados.wifi}
          </Text>
          <Text style={estiloInfo}>
            IP: {dados.ip}
          </Text>
          <Text style={estiloInfo}>
            Sinal Wi-Fi: {dados.sinal_wifi} dBm
          </Text>
        </View>
      ) : (
  <Text style={[styles.aviso, estiloInfo]}>
    Não foi possível conectar ao ESP32.
    {'\n'}
    Verifique a conexão Wi-Fi.
  </Text>
)}

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
aviso: {
  fontSize: 15,
  lineHeight: 22,
  textAlign: 'center',
  marginTop: 16,
},
});
