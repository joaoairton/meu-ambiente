
import { useEffect, useRef, useState } from 'react';
import { styles } from '../../styles/homeStyles';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Feather from '@expo/vector-icons/Feather';

import { useUser } from '../../contexts/UserContext';
import { useTheme } from '../../contexts/ThemeContext';
import MediaCard from '../../components/MediaCard';

// CONFIGURAÇÃO DA COMUNICAÇÃO COM O ESP32

// Endereço IP local do dispositivo
const ESP32_IP = '192.168.1.13';

// Endpoint HTTP responsável pelas leituras do DHT11
const API_URL = `http://${ESP32_IP}/api/sensor`;

// Estrutura dos dados recebidos da API do ESP32
type DadosSensor = {
  temperatura: number;
  umidade: number;
  sensor: string;
  status: string;
};

// Estrutura utilizada para armazenar o histórico das leituras
type Leitura = {
  temperatura: number;
  umidade: number;
};

export default function HomeScreen() {
  // CONTEXTOS

  // Recupera o nome informado pelo usuário no login
  const { userName } = useUser();

  // Identifica o tema selecionado nas configurações
  const { modoEscuro } = useTheme();

  // ESTADOS

  // Armazena a leitura mais recente recebida do ESP32
  const [dados, setDados] = useState<DadosSensor | null>(null);

  // Controla o estado da comunicação e o carregamento inicial
  const [conectado, setConectado] = useState(false);
  const [carregando, setCarregando] = useState(true);

  // Registra o horário da última atualização bem-sucedida
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState('');

  // Impede requisições HTTP simultâneas
  const requisicaoEmAndamento = useRef(false);

  // Armazena as últimas 10 leituras válidas do sensor
  const [historico, setHistorico] = useState<Leitura[]>([]);

  // COMUNICAÇÃO HTTP

  // Consulta o endpoint do ESP32 e atualiza os dados da tela
  async function buscarDados() {
    if (requisicaoEmAndamento.current) return;

    requisicaoEmAndamento.current = true;

    try {
      const resposta = await fetch(API_URL, {
        method: 'GET',
      });

      // Verifica se a requisição HTTP foi concluída com sucesso
      if (!resposta.ok) {
        throw new Error('Falha na comunicação com o ESP32');
      }

      // Converte a resposta JSON para a estrutura definida
      const resultado: DadosSensor = await resposta.json();

      setDados(resultado);

      // Valida as medições e mantém somente as 10 mais recentes
      if (
        Number.isFinite(resultado.temperatura) &&
        Number.isFinite(resultado.umidade)
      ) {
        setHistorico((anterior) => [
          ...anterior.slice(-9),
          {
            temperatura: resultado.temperatura,
            umidade: resultado.umidade,
          },
        ]);
      }

      setConectado(true);

      setUltimaAtualizacao(
        new Date().toLocaleTimeString('pt-BR')
      );
    } catch (erro) {
      // Sinaliza a perda de comunicação com o dispositivo
      setConectado(false);
    } finally {
      // Libera o controle da requisição, mesmo em caso de erro
      setCarregando(false);
      requisicaoEmAndamento.current = false;
    }
  }

  // ATUALIZAÇÃO AUTOMÁTICA

  // Realiza a primeira consulta e repete a leitura a cada 2 segundos
  useEffect(() => {
    buscarDados();

    const intervalo = setInterval(() => {
      buscarDados();
    }, 2000);

    // Encerra o intervalo quando o componente é desmontado
    return () => clearInterval(intervalo);
  }, []);

  // CÁLCULO DAS MÉDIAS

  // Calcula a média das temperaturas armazenadas no histórico
  const mediaTemperatura = historico.length
    ? historico.reduce(
        (soma, leitura) => soma + leitura.temperatura,
        0
      ) / historico.length
    : null;

  // Calcula a média das umidades armazenadas no histórico
  const mediaUmidade = historico.length
    ? historico.reduce(
        (soma, leitura) => soma + leitura.umidade,
        0
      ) / historico.length
    : null;

  // INTERFACE DA HOME

  return (
    <ScrollView
      style={[
        styles.container,
        modoEscuro && { backgroundColor: '#0F172A' },
      ]}
      contentContainerStyle={styles.conteudo}
    >
      {/* CABEÇALHO: usuário e status de conexão */}
      <View style={styles.cabecalho}>
        <View>
          <Text
            style={[
              styles.boasVindas,
              modoEscuro && styles.textoClaro,
            ]}
          >
            Olá, {userName || 'Usuário'}!
          </Text>

          <Text
            style={[
              styles.subtitulo,
              modoEscuro && styles.textoSecundarioEscuro,
            ]}
          >
            Acompanhe como está seu ambiente
          </Text>
        </View>

        {/* Indicador visual da comunicação com o ESP32 */}
        <View
          style={[
            styles.status,
            conectado ? styles.statusOnline : styles.statusOffline,
          ]}
        >
          <View
            style={[
              styles.ponto,
              conectado ? styles.pontoOnline : styles.pontoOffline,
            ]}
          />

          <Text style={styles.textoStatus}>
            {conectado ? 'ESP32 ON' : 'ESP32 OFF'}
          </Text>
        </View>
      </View>

      {/* CONDIÇÕES ATUAIS */}
      <Text
        style={[
          styles.tituloSecao,
          modoEscuro && styles.textoClaro,
        ]}
      >
        Condições atuais
      </Text>

      {/* Card da temperatura atual */}
      <View
        style={[
          styles.card,
          modoEscuro && { backgroundColor: '#1E293B' },
        ]}
      >
        <View
          style={[
            styles.iconeContainer,
            modoEscuro && { backgroundColor: '#2a3544' },
          ]}
        >
          <Feather
            name="thermometer"
            size={30}
            color="#2563EB"
          />
        </View>

        <Text
          style={[
            styles.label,
            modoEscuro && styles.textoSecundarioEscuro,
          ]}
        >
          Temperatura
        </Text>

        {dados ? (
          <Text
            style={[
              styles.valor,
              modoEscuro && { color: '#F8FAFC' },
            ]}
          >
            {dados.temperatura}
            <Text
              style={[
                styles.unidade,
                modoEscuro && styles.textoSecundarioEscuro,
              ]}
            >
              {'°C'}
            </Text>
          </Text>
        ) : (
          <Text style={styles.semDados}>-- °C</Text>
        )}

        <Text
          style={[
            styles.descricao,
            modoEscuro && styles.textoSecundarioEscuro,
          ]}
        >
          Temperatura do ambiente
        </Text>
      </View>

      {/* Card da umidade atual */}
      <View
        style={[
          styles.card,
          modoEscuro && { backgroundColor: '#1E293B' },
        ]}
      >
        <View
          style={[
            styles.iconeContainer,
            modoEscuro && { backgroundColor: '#2a3544' },
          ]}
        >
          <Feather
            name="droplet"
            size={30}
            color="#2563EB"
          />
        </View>

        <Text
          style={[
            styles.label,
            modoEscuro && styles.textoSecundarioEscuro,
          ]}
        >
          Umidade do ar
        </Text>

        {dados ? (
          <Text
            style={[
              styles.valor,
              modoEscuro && styles.textoClaro,
            ]}
          >
            {dados.umidade}
            <Text
              style={[
                styles.unidade,
                modoEscuro && styles.textoSecundarioEscuro,
              ]}
            >
              %
            </Text>
          </Text>
        ) : (
          <Text style={styles.semDados}>--%</Text>
        )}

        <Text
          style={[
            styles.descricao,
            modoEscuro && styles.textoSecundarioEscuro,
          ]}
        >
          Umidade relativa do ambiente
        </Text>
      </View>

      {/* MÉDIAS DAS ÚLTIMAS 10 LEITURAS */}
      <Text
        style={[
          styles.tituloSecao,
          { textAlign: 'center' },
          modoEscuro && styles.textoClaro,
        ]}
      >
        Média das últimas 10 leituras
      </Text>

      {/* Reutilização do componente MediaCard */}
      <View
        style={{
          flexDirection: 'row',
          gap: 12,
          marginBottom: 16,
        }}
      >
        <MediaCard
          titulo="Temperatura média"
          valor={mediaTemperatura}
          unidade="°C"
          icone="thermometer"
        />

        <MediaCard
          titulo="Umidade média"
          valor={mediaUmidade}
          unidade="%"
          icone="droplet"
        />
      </View>

      {/* AVISOS DE COMUNICAÇÃO */}
      {!conectado && (
        <Text style={[styles.aviso, modoEscuro && styles.textoClaro]}>
          {carregando
            ? 'Conectando ao ESP32...'
            : 'Não foi possível acessar o ESP32. Verifique a conexão Wi-Fi.'}
        </Text>
      )}

      {/* Indicador exibido durante o carregamento inicial */}
      {carregando && (
        <ActivityIndicator
          size="small"
          color="#2563EB"
          style={{ marginTop: 12 }}
        />
      )}
    </ScrollView>
  );
}