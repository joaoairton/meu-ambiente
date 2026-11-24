
import { StyleSheet } from 'react-native';

// ESTILOS DO COMPONENTE DE MÉDIAS

export const styles = StyleSheet.create({
  // Card principal
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    elevation: 2,
  },

  // Fundo do card no modo escuro
  cardEscuro: {
    backgroundColor: '#1E293B',
  },

  // Identificação da variável
  titulo: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
  },

  tituloEscuro: {
    color: '#CBD5E1',
  },

  // Valor da média calculada
  valor: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#0F172A',
  },

  valorEscuro: {
    color: '#F8FAFC',
  },

  // Unidade de medida
  unidade: {
    fontSize: 15,
    color: '#94A3B8',
  },
});