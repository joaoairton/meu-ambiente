
import { useState } from 'react';
import { useRouter } from 'expo-router';

import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useUser } from '../contexts/UserContext';
import { styles } from '../styles/loginStyles';

// TELA DE LOGIN
// Responsável por validar o nome, armazenar o usuário
// e permitir o acesso à tela principal do aplicativo.

export default function LoginScreen() {
  // ESTADOS E NAVEGAÇÃO

  // Armazena o nome digitado no campo de entrada
  const [nome, setNome] = useState('');

  // Controla a navegação entre as telas
  const router = useRouter();

  // Disponibiliza o nome do usuário para as demais telas
  const { setUserName } = useUser();

  // VALIDAÇÃO DO NOME

  function entrar() {
    // Remove espaços nas extremidades e espaços duplicados
    const userName = nome.trim().replace(/\s+/g, ' ');

    // Verifica o tamanho mínimo permitido
    if (userName.length < 4) {
      Alert.alert(
        'Erro',
        'O nome deve ter pelo menos 4 caracteres.'
      );
      return;
    }

    // Verifica o tamanho máximo permitido
    if (userName.length > 50) {
      Alert.alert(
        'Erro',
        'O nome não pode passar de 50 caracteres.'
      );
      return;
    }

    // Permite apenas letras, espaços, apóstrofos e hífens
    const apenasLetrasRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/;

    if (!apenasLetrasRegex.test(userName)) {
      Alert.alert(
        'Erro',
        'O nome não pode conter números ou caracteres especiais.'
      );
      return;
    }

    // Impede três ou mais caracteres iguais consecutivos
    const repeticaoRegex = /(.)\1{2,}/i;

    if (repeticaoRegex.test(userName)) {
      Alert.alert(
        'Erro',
        'Por favor, digite um nome válido.'
      );
      return;
    }

    // Salva o nome validado e navega para a Home
    setUserName(userName);
    router.replace('/(tabs)/home');
  }

  // INTERFACE DO LOGIN

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.card}>
        {/* Imagem ilustrativa do microcontrolador */}
        <Image
          source={require('../../assets/images/microcontroller.png')}
          style={styles.imagem}
          resizeMode="contain"
        />

        {/* Identificação do aplicativo */}
        <Text style={styles.titulo}>
          Meu Ambiente
        </Text>

        <Text style={styles.subtitulo}>
          Monitoramento inteligente e de Temperatura e Umidade
        </Text>

        {/* Campo para identificação do usuário */}
        <Text style={styles.label}>
          Seu nome:
        </Text>

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

        {/* Botão de acesso, desabilitado quando o campo está vazio */}
        <Pressable
          style={({ pressed }) => [
            styles.botao,
            !nome.trim() && styles.botaoDesabilitado,
            pressed && nome.trim() && styles.botaoPressionado,
          ]}
          onPress={entrar}
          disabled={!nome.trim()}
        >
          <Text style={styles.textoBotao}>
            Entrar
          </Text>
        </Pressable>

        {/* Mensagem institucional */}
        <Text style={styles.rodape}>
          Tecnologia conectando você ao ambiente.
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}