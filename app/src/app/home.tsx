
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

// IP do ESP32
const ESP32_IP = '192.168.1.8';

const API_URL = `http://${ESP32_IP}/api/sensor`;

type DadosSensor = {
  temperatura: number;
  umidade: number;
  sensor: string;
  status: string;
};

export default function HomeScreen() {
  const { nome } = useLocalSearchParams<{ nome: string }>();
  const router = useRouter();

  const [dados, setDados] = useState<DadosSensor | null>(null);
  const [conectado, setConectado] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState('');

  const requisicaoEmAndamento = useRef(false);

  async function buscarDados() {
    if (requisicaoEmAndamento.current) return;

    requisicaoEmAndamento.current = true;

    try {
      const resposta = await fetch(API_URL, {
        method: 'GET',
      });

      if (!resposta.ok) {
        throw new Error('Falha na comunicação com o ESP32');
      }

      const resultado: DadosSensor = await resposta.json();

      setDados(resultado);
      setConectado(true);
      setUltimaAtualizacao(
        new Date().toLocaleTimeString('pt-BR')
      );
    } catch (erro) {
      setConectado(false);
    } finally {
      setCarregando(false);
      requisicaoEmAndamento.current = false;
    }
  }

  useEffect(() => {
    buscarDados();

    const intervalo = setInterval(() => {
      buscarDados();
    }, 2000);

    return () => clearInterval(intervalo);
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.conteudo}
    >
      <View style={styles.cabecalho}>
        <View>
          <Text style={styles.marca}>AmbiSense</Text>
          <Text style={styles.boasVindas}>
            Olá, {nome || 'Usuário'}!
          </Text>
          <Text style={styles.subtitulo}>
            Monitoramento do ambiente
          </Text>
        </View>

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
            {conectado ? 'Online' : 'Offline'}
          </Text>
        </View>
      </View>

      <Text style={styles.tituloSecao}>
        Condições atuais
      </Text>

      <View style={styles.card}>
        <Text style={styles.icone}>🌡️</Text>
        <Text style={styles.label}>Temperatura</Text>

        {dados ? (
          <Text style={styles.valor}>
            {dados.temperatura}
            <Text style={styles.unidade}> °C</Text>
          </Text>
        ) : (
          <Text style={styles.semDados}>-- °C</Text>
        )}

        <Text style={styles.descricao}>
          Temperatura do ambiente
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.icone}>💧</Text>
        <Text style={styles.label}>Umidade do ar</Text>

        {dados ? (
          <Text style={styles.valor}>
            {dados.umidade}
            <Text style={styles.unidade}>%</Text>
          </Text>
        ) : (
          <Text style={styles.semDados}>--%</Text>
        )}

        <Text style={styles.descricao}>
          Umidade relativa do ambiente
        </Text>
      </View>

      <View style={styles.cardConexao}>
        <Text style={styles.tituloConexao}>
          Dispositivo conectado
        </Text>

        <Text style={styles.info}>
          Sensor: DHT11
        </Text>

        <Text style={styles.info}>
          Comunicação: HTTP / REST
        </Text>

        <Text style={styles.info}>
          Atualização: a cada 2 segundos
        </Text>

        <Text style={styles.info}>
          Última leitura: {ultimaAtualizacao || '--'}
        </Text>

        {!conectado && (
          <Text style={styles.aviso}>
            {carregando
              ? 'Conectando ao ESP32...'
              : 'Não foi possível acessar o ESP32. Verifique a conexão Wi-Fi.'}
          </Text>
        )}

        {carregando && (
          <ActivityIndicator
            size="small"
            color="#2563EB"
            style={{ marginTop: 12 }}
          />
        )}
      </View>

      <Pressable
        style={styles.botaoAtualizar}
        onPress={buscarDados}
      >
        <Text style={styles.textoBotao}>
          Atualizar agora
        </Text>
      </Pressable>

      <Pressable
        style={styles.botaoSair}
        onPress={() => router.replace('/')}
      >
        <Text style={styles.textoSair}>
          Sair da conta
        </Text>
      </Pressable>

      <Text style={styles.rodape}>
        AmbiSense · Tecnologia conectando você ao ambiente.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  conteudo: {
    padding: 24,
    paddingTop: 55,
    paddingBottom: 40,
  },
  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  marca: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  boasVindas: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#0F172A',
    marginTop: 8,
  },
  subtitulo: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 5,
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusOnline: {
    backgroundColor: '#DCFCE7',
  },
  statusOffline: {
    backgroundColor: '#FEE2E2',
  },
  ponto: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  pontoOnline: {
    backgroundColor: '#16A34A',
  },
  pontoOffline: {
    backgroundColor: '#DC2626',
  },
  textoStatus: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#334155',
  },
  tituloSecao: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    elevation: 3,
  },
  icone: {
    fontSize: 30,
    marginBottom: 12,
  },
  label: {
    fontSize: 15,
    color: '#64748B',
  },
  valor: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#0F172A',
    marginTop: 8,
  },
  unidade: {
    fontSize: 24,
    fontWeight: '500',
    color: '#64748B',
  },
  semDados: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#94A3B8',
    marginTop: 8,
  },
  descricao: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 8,
  },
  cardConexao: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 22,
    marginTop: 4,
  },
  tituloConexao: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 14,
  },
  info: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 9,
  },
  aviso: {
    color: '#DC2626',
    fontSize: 13,
    marginTop: 12,
  },
  botaoAtualizar: {
    backgroundColor: '#2563EB',
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 22,
  },
  textoBotao: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  botaoSair: {
    alignItems: 'center',
    padding: 16,
    marginTop: 8,
  },
  textoSair: {
    color: '#64748B',
    fontSize: 14,
  },
  rodape: {
    textAlign: 'center',
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 12,
  },
});
