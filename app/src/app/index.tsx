
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function LoginScreen() {
  const [nome, setNome] = useState('');
  const router = useRouter();

  function entrar() {
    const nomeUsuario = nome.trim();

    if (nomeUsuario.length > 0) {
      router.push({
        pathname: '/home',
        params: { nome: nomeUsuario },
      });
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.card}>
        <Image
          source={require('../../assets/images/microcontroller.png')}
          style={styles.imagem}
          resizeMode="contain"
        />

        <Text style={styles.titulo}>Meu ambiente</Text>

        <Text style={styles.subtitulo}>
          Monitoramento inteligente e de Temperatura e Umidade
        </Text>

        <Text style={styles.label}>Seu nome:</Text>

        <TextInput
          style={styles.input}
          placeholder="Digite seu nome"
          placeholderTextColor="#94A3B8"
          value={nome}
          onChangeText={setNome}
          autoCapitalize="words"
          returnKeyType="go"
          onSubmitEditing={entrar}
        />

        <Pressable
          style={({ pressed }) => [
            styles.botao,
            !nome.trim() && styles.botaoDesabilitado,
            pressed && nome.trim() && styles.botaoPressionado,
          ]}
          onPress={entrar}
          disabled={!nome.trim()}
        >
          <Text style={styles.textoBotao}>Entrar</Text>
        </Pressable>

        <Text style={styles.rodape}>
          Tecnologia conectando você ao ambiente.
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    elevation: 4,
  },
  imagem: {
    width: 90,
    height: 90,
    marginBottom: 12,
  },
  titulo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  subtitulo: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 32,
  },
  label: {
    alignSelf: 'flex-start',
    color: '#334155',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    color: '#0F172A',
    marginBottom: 18,
  },
  botao: {
    width: '100%',
    height: 50,
    backgroundColor: '#2563EB',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botaoDesabilitado: {
    backgroundColor: '#94A3B8',
  },
  botaoPressionado: {
    backgroundColor: '#1D4ED8',
  },
  textoBotao: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  rodape: {
    marginTop: 28,
    color: '#94A3B8',
    fontSize: 12,
    textAlign: 'center',
  },
});
