
import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react';

// Define os dados e funções disponíveis no contexto do tema
type ThemeContextType = {
  modoEscuro: boolean;
  setModoEscuro: (value: boolean) => void;
};

// Cria o contexto responsável por compartilhar o tema
const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

// Disponibiliza o estado do tema para as telas do aplicativo
export function ThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  // Armazena o tema atual, iniciando no modo claro
  const [modoEscuro, setModoEscuro] = useState(false);

  return (
    <ThemeContext.Provider value={{ modoEscuro, setModoEscuro }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Permite acessar e alterar o tema em qualquer componente
// que esteja dentro do ThemeProvider
export function useTheme() {
  const context = useContext(ThemeContext);

  // Impede o uso do contexto fora do provider
  if (!context) {
    throw new Error('useTheme deve ser usado dentro do ThemeProvider');
  }

  return context;
}