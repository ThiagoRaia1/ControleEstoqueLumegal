import { router } from "expo-router";
import { createContext, useContext, ReactNode, useState } from "react";
import { nomePaginas } from "../utils/nomePaginas";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTipoAcessoContext } from "./tipoAcessoContext";

interface IAuthContext {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<IAuthContext>({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { tipoAcesso, setTipoAcesso } = useTipoAcessoContext();

  const login = () => {
    setIsAuthenticated(true);
    router.push(nomePaginas.itensEmFalta);
  };

  const logout = async () => {
    setIsAuthenticated(false);
    await AsyncStorage.removeItem("token");
    setTipoAcesso("");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
