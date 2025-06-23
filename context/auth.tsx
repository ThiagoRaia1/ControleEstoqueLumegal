// context/auth.tsx
import React, { createContext, useContext, useState } from "react";
import AuthService from "../services/AuthService";

export interface IUsuario {
  login: string;
  senha: string;
  tipoAcesso: string;
}

interface IAuthContext {
  usuario: IUsuario;
  setUsuario: (usuario: IUsuario) => void;
  handleLogin: (senha: string) => Promise<void>;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [usuario, setUsuario] = useState<IUsuario>({
    login: "",
    senha: "",
    tipoAcesso: "",
  });

  async function handleLogin(senha: string) {
    try {
      const user = await AuthService.login(usuario.login, senha);
      if (user) {
        setUsuario(user);
      }
    } catch (erro: any) {
      const mensagem = erro.message || "";

      if (mensagem === "Erro ao autenticar usuario") {
        alert("Login ou senha inválidos");
      } else if (mensagem === "Erro ao buscar dados do usuario") {
        alert("Erro ao buscar dados do usuario");
      } else {
        alert("Erro inesperado ao fazer login" + mensagem);
      }
    }
  }

  return (
    <AuthContext.Provider value={{ usuario, handleLogin, setUsuario }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}
