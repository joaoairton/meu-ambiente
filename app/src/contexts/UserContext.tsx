
import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react';

type UserContextType = {
  userName: string;
  setUserName: (name: string) => void;
  clearUser: () => void;
};

const UserContext = createContext<UserContextType | undefined>(
  undefined
);

// Disponibiliza o nome para as telas
export function UserProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [userName, setUserName] = useState('');

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

export function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUser must be used inside UserProvider');
  }

  return context;
}