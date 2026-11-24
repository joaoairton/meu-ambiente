
import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react';

// Define os dados e funções disponíveis no contexto do usuário
type UserContextType = {
  userName: string;
  setUserName: (name: string) => void;
  clearUser: () => void;
};

// Cria o contexto responsável por compartilhar os dados do usuário
const UserContext = createContext<UserContextType | undefined>(
  undefined
);

// Disponibiliza o estado do usuário para as telas do aplicativo
export function UserProvider({
  children,
}: {
  children: ReactNode;
}) {
  // Armazena o nome informado na tela de login
  const [userName, setUserName] = useState('');

  // Limpa o nome armazenado ao sair da conta
  function clearUser() {
    setUserName('');
  }

  return (
    <UserContext.Provider
      value={{ userName, setUserName, clearUser }}
    >
      {children}
    </UserContext.Provider>
  );
}

// Permite acessar os dados do usuário em qualquer componente
// que esteja dentro do UserProvider
export function useUser() {
  const context = useContext(UserContext);

  // Impede o uso do contexto fora do provider
  if (!context) {
    throw new Error('useUser must be used inside UserProvider');
  }

  return context;
}