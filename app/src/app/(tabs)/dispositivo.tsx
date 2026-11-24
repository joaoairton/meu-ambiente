
import { useEffect, useState } from 'react';
import { Image, Text, View } from 'react-native';

import { useTheme } from '../../contexts/ThemeContext';
import { styles } from '../../styles/dispositivoStyles';

// CONFIGURAÇÃO DA COMUNICAÇÃO COM O ESP32

// Endpoint HTTP responsável pelas informações do dispositivo
const ESP32_IP = '192.168.1.13';
const API_URL = `http://${ESP32_IP}/api/status`;

// Estrutura dos dados retornados pelo endpoint /api/status
type StatusDispositivo = {
  status: string;
  dispositivo: string;
  wifi: string;
  ip: string;
  sinal_wifi: number;
};

export default function DeviceScreen() {
  // CONTEXTO E ESTADOS

  // Identifica o tema selecionado nas configurações
  const { modoEscuro } = useTheme();

  // Define a cor dos textos de acordo com o tema
  const estiloInfo = modoEscuro ? styles.textoClaro : undefined;

  // Armazena as informações recebidas do ESP32
  const [dados, setDados] = useState<StatusDispositivo | null>(null);

  // CONSULTA HTTP

  // Consulta o status do ESP32 a cada 5 segundos
  useEffect(() => {
    async function buscarStatus() {
      try {
        const resposta = await fetch(API_URL);

        // Verifica se a requisição HTTP foi concluída com sucesso
        if (!resposta.ok) {
          throw new Error('Erro na comunicação com o ESP32');
        }

        // Converte a resposta JSON e atualiza as informações
        const resultado: StatusDispositivo = await resposta.json();

        setDados(resultado);
      } catch (erro) {
        // Registra o erro e remove os dados da tela
        console.log('Erro ao consultar dispositivo:', erro);
        setDados(null);
      }
    }

    // Executa a primeira consulta ao abrir a tela
    buscarStatus();

    // Repete a consulta automaticamente a cada 5 segundos
    const intervalo = setInterval(buscarStatus, 5000);

    // Encerra o intervalo quando o componente é desmontado
    return () => clearInterval(intervalo);
  }, []);

  // INTERFACE DO DISPOSITIVO

  return (
    <View
      style={[
        styles.container,
        modoEscuro && styles.containerEscuro,
      ]}
    >
      {/* Título da tela */}
      <Text
        style={[
          styles.title,
          modoEscuro && styles.textoClaro,
        ]}
      >
        Dispositivo
      </Text>

      {/* Imagem ilustrativa do ESP32 */}
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

      {/* Informações recebidas do endpoint /api/status */}
      {dados ? (
        <View
          style={[
            styles.card,
            modoEscuro && styles.cardEscuro,
          ]}
        >
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
        // Mensagem exibida quando não há comunicação com o ESP32
        <Text style={[styles.aviso, estiloInfo]}>
          Não foi possível conectar ao ESP32.
          {'\n'}
          Verifique a conexão Wi-Fi.
        </Text>
      )}
    </View>
  );
}