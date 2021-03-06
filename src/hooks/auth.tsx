import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../services/api';

interface AuthState {
  token: string;
  user: string;
}

// variaveis vindas do usuario
interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  user: string;
  loading: boolean;
  signIn(credentials: SignInCredentials): Promise<void>; // definindo que signIn vai receber as credenciais do usuario
  signOut(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData); // {} as auth -> força o contexto a iniciar vazio

const AuthProvider: React.FC = ({children}) => {
  const [data, setData] = useState<AuthState>({} as AuthState);
  const [loading, setLoading] = useState(true);

  // vai lá no storage e busca os valores do data para preencher no estado
  useEffect(() => {
    async function loadStorageData(): Promise<void> {
      const [token, user] = await AsyncStorage.multiGet([
        '@GoBarber:token',
        '@GoBarber:user',
      ]);
      // 0 contem a chave 1 o conteudo
      if (token[1] && user[1]) {
        setData({token: token[1], user: JSON.parse(user[1])});
      }
      setLoading(false);
    }

    loadStorageData();
  }, []);
  // função para autenticação do usuario
  const signIn = useCallback(async ({email, password}) => {
    const response = await api.post('/sessions', {
      email,
      password,
    });

    const {token, user} = response.data;
    // armazenando dados no AsyncStorage
    await AsyncStorage.multiSet([
      ['@Gobarber:token', token],
      ['@Gobarber:user', JSON.stringify(user)],
    ]);
    setData({token, user});
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.multiRemove(['@GoBarber:token', '@GoBarber:user']);

    setData({} as AuthState);
  }, []);
  return (
    <AuthContext.Provider value={{user: data.user, loading, signIn, signOut}}>
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export {AuthProvider, useAuth};
