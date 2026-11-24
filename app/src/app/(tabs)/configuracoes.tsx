
import { useRouter } from 'expo-router';
import {
  Pressable,
  Switch,
  Text,
  View,
} from 'react-native';

import { useUser } from '../../contexts/UserContext';
import { useTheme } from '../../contexts/ThemeContext';
import { styles } from '../../styles/configuracoesStyles.ts';

export default function ConfiguracoesScreen() {
  // CONTEXTOS E NAVEGAÇÃO

  // Recupera o tema atual e a função para alterná-lo
  const { modoEscuro, setModoEscuro } = useTheme();

  // Recupera o usuário autenticado e a função para limpar seus dados
  const { userName, clearUser } = useUser();

  // Permite realizar a navegação entre as telas
  const router = useRouter();

  // ENCERRAMENTO DA SESSÃO

  // Limpa os dados do usuário e retorna à tela de login
  function sair() {
    clearUser();
    router.replace('/');
  }

  // INTERFACE DE CONFIGURAÇÕES

  return (
    <View
      style={[
        styles.container,
        modoEscuro && styles.fundoEscuro,
      ]}
    >
      {/* TÍTULO DA TELA */}
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

      {/* INFORMAÇÕES DO APLICATIVO */}
      <View
        style={[
          styles.card,
          modoEscuro && { backgroundColor: '#1E293B' },
        ]}
      >
        <Text
          style={[
            styles.cardTitulo,
            modoEscuro && styles.textoClaro,
          ]}
        >
          Sobre o aplicativo
        </Text>

        <Text
          style={[
            styles.texto,
            modoEscuro && styles.textoSecundarioEscuro,
          ]}
        >
          Versão: 1.0.0
        </Text>

        <Text
          style={[
            styles.texto,
            modoEscuro && styles.textoSecundarioEscuro,
          ]}
        >
          Usuário: {userName || 'Não identificado'}
        </Text>

        <Text
          style={[
            styles.texto,
            modoEscuro && styles.textoSecundarioEscuro,
          ]}
        >
          Monitoramento de sensores IoT
        </Text>
      </View>

      {/* CONFIGURAÇÃO DO TEMA */}
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

        {/* Alterna entre os modos claro e escuro */}
        <Switch
          value={modoEscuro}
          onValueChange={setModoEscuro}
          trackColor={{
            false: '#CBD5E1',
            true: '#2563EB',
          }}
          thumbColor="#FFFFFF"
        />
      </View>

      {/* BOTÃO DE SAÍDA */}
      <Pressable
        style={styles.botao}
        onPress={sair}
      >
        <Text style={styles.textoBotao}>
          Sair da conta
        </Text>
      </Pressable>
    </View>
  );
}