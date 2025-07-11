import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

// Tipos de acesso
export const acessoCompras = "Compras";
export const acessoComprasAdm = "ComprasAdm";
export const acessoAlmoxarifado = "Almoxarifado";
export const acessoAlmoxarifadoAdm = "AlmoxarifadoAdm";

// Tipo de acesso possível
export type TipoAcessoType =
  | ""
  | "Compras"
  | "ComprasAdm"
  | "Almoxarifado"
  | "AlmoxarifadoAdm";

// Interface do payload do token
interface TokenPayload {
  id: number;
  login: string;
  tipoAcesso: TipoAcessoType;
}

// Interface do contexto
interface TipoAcessoProps {
  tipoAcesso: TipoAcessoType;
  setTipoAcesso: React.Dispatch<React.SetStateAction<TipoAcessoType>>;
}

// Criação do contexto
const TipoAcessoContext = createContext<TipoAcessoProps>({
  tipoAcesso: "",
  setTipoAcesso: () => {},
});

// Provider
export const TipoAcessoProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [tipoAcesso, setTipoAcesso] = useState<TipoAcessoType>("");

  useEffect(() => {
    const carregarTipoAcessoDoToken = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          const decoded = jwtDecode<TokenPayload>(token);
          setTipoAcesso(decoded.tipoAcesso);
        }
      } catch (error) {
        console.warn("Erro ao decodificar token:", error);
        setTipoAcesso(""); // Evita valor incorreto
      }
    };

    carregarTipoAcessoDoToken();
  }, []);

  return (
    <TipoAcessoContext.Provider value={{ tipoAcesso, setTipoAcesso }}>
      {children}
    </TipoAcessoContext.Provider>
  );
};

// Hook para consumir o contexto
export const useTipoAcessoContext = () => useContext(TipoAcessoContext);
