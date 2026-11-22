
import { useState } from 'react';
import { useUser } from '../../contexts/UserContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useRouter } from 'expo-router';
import {
    Pressable,
    StyleSheet,
    Switch,
    Text,
    View,
} from 'react-native';

export default function ConfiguracoesScreen() {
  const { modoEscuro, setModoEscuro } = useTheme();
  const { userName, clearUser } = useUser();
  const router = useRouter();

  function sair() {
    clearUser();
    router.replace('/');
  }

  return (
    <View
      style={[
        styles.container,
        modoEscuro && styles.fundoEscuro,
      ]}
    >
      <Text
        style={[
          styles.titulo,
          modoEscuro && styles.textoClaro,
        ]}
      >
        Configurações
      </Text>

      <Text
        style={[
          styles.descricao,
          modoEscuro && styles.textoClaro,
        ]}
      >
        Meu Ambiente
      </Text>

        <View
          style={[styles.card, modoEscuro && { backgroundColor: '#1E293B' },
          ]}
        >
        <Text style={[styles.cardTitulo, modoEscuro && styles.textoClaro]}>
          Sobre o aplicativo
        </Text>

        <Text style={[styles.texto, modoEscuro && styles.textoSecundarioEscuro]}>
          Versão: 1.0.0
        </Text>

        <Text style={[styles.texto, modoEscuro && styles.textoSecundarioEscuro]}>
          Usuário: {userName || 'Não identificado'}
        </Text>

        <Text style={[styles.texto, modoEscuro && styles.textoSecundarioEscuro]}>
          Monitoramento de sensores IoT
        </Text>
      </View>

      <View style={styles.linha}>
        <View style={styles.textos}>
          <Text
            style={[
              styles.opcaoTitulo,
              modoEscuro && styles.textoClaro,
            ]}
          >
            Modo escuro
          </Text>
          <Text
            style={[
              styles.descricao,
              modoEscuro && styles.textoClaro,
            ]}
          >
            Alterar aparência do aplicativo
          </Text>
        </View>

        <Switch
          value={modoEscuro}
          onValueChange={setModoEscuro}
          trackColor={{ false: '#CBD5E1', true: '#2563EB' }}
          thumbColor="#FFFFFF"
        />
      </View>

      <Pressable
        style={styles.botao}
        onPress={sair}
      >
        <Text style={styles.textoBotao}>Sair da conta</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    padding: 24,
  },
  fundoEscuro: {
    backgroundColor: '#0F172A',
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0F172A',
    marginTop: 20,
  },
  textoClaro: {
    color: '#FFFFFF',
  },
  descricao: {
    color: '#64748B',
    fontSize: 14,
    marginTop: 6,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginTop: 28,
    gap: 12,
  },
  cardTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 4,
  },
  texto: {
    fontSize: 14,
    color: '#475569',
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 30,
    marginBottom: 30,
  },
  textos: {
    flex: 1,
    marginRight: 12,
  },
  opcaoTitulo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
  },
  botao: {
    height: 50,
    backgroundColor: '#DC2626',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoBotao: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  textoSecundarioEscuro: {
  color: '#CBD5E1',
},
});
