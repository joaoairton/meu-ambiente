
import { useEffect, useRef, useState } from 'react';
import { useUser } from '../../contexts/UserContext';
import Feather from '@expo/vector-icons/Feather';
import { useTheme } from '../../contexts/ThemeContext';

import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

// IP do ESP32
const ESP32_IP = '192.168.1.9';

const API_URL = `http://${ESP32_IP}/api/sensor`;

type DadosSensor = {
  temperatura: number;
  umidade: number;
  sensor: string;
  status: string;
};

export default function HomeScreen() {
  const { userName } = useUser();
  const { modoEscuro } = useTheme();

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
      style={[
        styles.container,
        modoEscuro && { backgroundColor: '#0F172A' },
      ]}
      contentContainerStyle={styles.conteudo}
    >
      <View style={styles.cabecalho}>
        <View>
          <Text style={[styles.boasVindas, modoEscuro && styles.textoClaro]}>
            Olá, {userName || 'Usuário'}!
          </Text>
          <Text
            style={[styles.subtitulo, modoEscuro && styles.textoSecundarioEscuro,
            ]}
          >
            Acompanhe como está seu ambiente
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
            {conectado ? 'SENSOR ON' : 'SENSOR OFF'}
          </Text>
        </View>
      </View>

      <Text style={[styles.tituloSecao, modoEscuro && styles.textoClaro]}>
        Condições atuais
      </Text>

      <View
        style={[styles.card, modoEscuro && { backgroundColor: '#1E293B' },
        ]}
      >
        <View
          style={[styles.iconeContainer, modoEscuro && { backgroundColor: '#2a3544' },
          ]}
        >
          <Feather name="thermometer" size={30} color="#2563EB" />
        </View>
        <Text
          style={[styles.label, modoEscuro && styles.textoSecundarioEscuro,]}
        >
        Temperatura
        </Text>

        {dados ? (
          <Text
            style={[styles.valor, modoEscuro && { color: '#F8FAFC' },
          ]}
>
            {dados.temperatura}
            <Text
              style={[styles.unidade, modoEscuro && styles.textoSecundarioEscuro,]}
            >
              {'°C'}
            </Text>
          </Text>
        ) : (
          <Text style={styles.semDados}>-- °C</Text>
        )}

        <Text
          style={[styles.descricao, modoEscuro && styles.textoSecundarioEscuro,
          ]}
        >
          Temperatura do ambiente
        </Text>
      </View>
        
      <View
        style={[styles.card, modoEscuro && { backgroundColor: '#1E293B' },
        ]}
      >
        <View
          style={[styles.iconeContainer, modoEscuro && { backgroundColor: '#2a3544' },
          ]}
        >
          <Feather name="droplet" size={30} color="#2563EB" />
        </View>
        <Text style={[styles.label, modoEscuro && styles.textoSecundarioEscuro,]}>
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
          style={[styles.descricao, modoEscuro && styles.textoSecundarioEscuro,
          ]}
        >
          Umidade relativa do ambiente
        </Text>
      </View>

      <View
        style={[
          styles.cardConexao,
          modoEscuro && { backgroundColor: '#1E293B' },
        ]}
      >
       <Text style={[styles.tituloConexao, modoEscuro && styles.textoClaro]}>
          Dispositivo conectado
        </Text>

        <Text
          style={[styles.info, modoEscuro && styles.textoSecundarioEscuro,
          ]}
        >
          Sensor: DHT11
        </Text>

        <Text style={[styles.info, modoEscuro && styles.textoClaro]}>
          Comunicação: HTTP / REST
        </Text>

        <Text
          style={[styles.info, modoEscuro && styles.textoSecundarioEscuro,
          ]}
        >
          Atualização: a cada 2 segundos
        </Text>

        <Text
          style={[styles.info, modoEscuro && styles.textoSecundarioEscuro,
          ]}
        >
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


      <Text
        style={[styles.rodape, modoEscuro && styles.textoSecundarioEscuro,
        ]}
      >
        Meu Ambiente · PDM 2026.2 (Uniavan)
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
    borderRadius: 10,
  },
  statusOnline: {
    backgroundColor: '#6ccf8f',
  },
  statusOffline: {
    backgroundColor: '#e29999',
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
    borderRadius: 18,
    padding: 20,
    marginBottom: 12,
    elevation: 2,
    alignItems: 'center',
  },
  iconeContainer: {
  width: 44,
  height: 44,
  borderRadius: 12,
  backgroundColor: '#EFF6FF',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 12,
},
  label: {
    fontSize: 15,
    color: '#64748B',
  },
  valor: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#0F172A',
    marginTop: 5,
  },
  unidade: {
    fontSize: 21,
    fontWeight: '600',
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
    marginTop: 5,
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
  rodape: {
    textAlign: 'center',
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 12,
  },
  textoClaro: {
  color: '#F8FAFC',
},
textoSecundarioEscuro: {
  color: '#CBD5E1',
},
});
