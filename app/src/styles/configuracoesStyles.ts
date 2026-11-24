
import { StyleSheet } from 'react-native';

// ESTILOS DA TELA DE CONFIGURAÇÕES

export const styles = StyleSheet.create({
  // Container principal
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    padding: 24,
  },

  // Fundo do modo escuro
  fundoEscuro: {
    backgroundColor: '#0F172A',
  },

  // Título principal
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

  // Card de informações do aplicativo
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

  // Organização horizontal da configuração de tema
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

  // Botão para encerrar a sessão
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

  // Cor secundária usada no modo escuro
  textoSecundarioEscuro: {
    color: '#CBD5E1',
  },
});