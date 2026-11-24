// ESTILOS DA HOME

import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({

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

  aviso: {
    marginTop: 18,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },

  textoClaro: {
    color: '#F8FAFC',
  },

  textoSecundarioEscuro: {
    color: '#CBD5E1',
  },
});
