
import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from 'react';

type ThemeContextType = {
  modoEscuro: boolean;
  setModoEscuro: (value: boolean) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

export function ThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [modoEscuro, setModoEscuro] = useState(false);

  return (
    <ThemeContext.Provider value={{ modoEscuro, setModoEscuro }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme deve ser usado dentro do ThemeProvider');
  }

  return context;
}
