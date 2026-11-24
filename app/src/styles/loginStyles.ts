
import { StyleSheet } from 'react-native';

// ESTILOS DA TELA DE LOGIN

export const styles = StyleSheet.create({
  // Container principal
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },

  // Card central do login
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    elevation: 4,
  },

  // Imagem do microcontrolador
  imagem: {
    width: 90,
    height: 90,
    marginBottom: 12,
  },

  // Identificação do aplicativo
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

  // Campo de entrada do nome
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

  // Botão de acesso ao aplicativo
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

  // Mensagem exibida no rodapé do card
  rodape: {
    marginTop: 28,
    color: '#94A3B8',
    fontSize: 12,
    textAlign: 'center',
  },
});