import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "../context/auth";
import Carregando from "./components/Carregando";
import { useThemeContext } from "../context/ThemeContext";
import { getGlobalStyles } from "../globalStyles";
import { login as loginApi } from "../services/AuthService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  acessoAlmoxarifado,
  acessoAlmoxarifadoAdm,
  acessoCompras,
  acessoComprasAdm,
  TipoAcessoType,
  TokenPayload,
  useTipoAcessoContext,
} from "../context/tipoAcessoContext";
import { router } from "expo-router";
import { nomePaginas } from "../utils/nomePaginas";
import { jwtDecode } from "jwt-decode";

export default function TelaLogin() {
  const { login, logout } = useAuth();
  const { setTipoAcesso } = useTipoAcessoContext();
  const { theme } = useThemeContext();
  const globalStyles = getGlobalStyles(theme);
  const [loginInput, setLoginInput] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const handleLogin = async () => {
    try {
      setCarregando(true);
      const { token, tipoAcesso } = await loginApi({
        login: loginInput,
        senha,
      });
      if (!token) {
        throw new Error("Token não encontrado");
      }
      await AsyncStorage.setItem("token", token);
      login();
      if (token) {
        const decoded = jwtDecode<TokenPayload>(token);
        setTipoAcesso(decoded.tipoAcesso);
        // Redirecionamento direto para a rota correta
        if (
          decoded.tipoAcesso === acessoCompras ||
          decoded.tipoAcesso === acessoComprasAdm
        ) {
          router.push(nomePaginas.itensEmFalta.compras);
        } else if (
          decoded.tipoAcesso === acessoAlmoxarifado ||
          decoded.tipoAcesso === acessoAlmoxarifadoAdm
        ) {
          router.push(nomePaginas.itensEmFalta.almoxarifado);
        } else {
          alert("Tipo de acesso inválido");
        }
      }
    } catch (erro: any) {
      alert(erro.message);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    logout();
  }, []);

  return (
    <View style={globalStyles.background}>
      <View style={globalStyles.mainContent}>
        <Text
          style={{
            fontSize: 35,
            fontWeight: 600,
            textAlign: "center",
            marginBottom: 20,
            color: theme === "light" ? "black" : "white",
          }}
        >
          Controle de estoque Lumegal
        </Text>
        <View style={globalStyles.loginInputContainer}>
          <Feather
            name="mail"
            size={20}
            color="#0033A0"
            style={styles.iconSpace}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#ccc"
            onChangeText={(text) => setLoginInput(text)}
            onSubmitEditing={login}
          />
          <View style={styles.iconSpace}></View>
        </View>

        <View style={globalStyles.loginInputContainer}>
          <Feather name="lock" size={20} color="#0033A0" />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            placeholderTextColor="#ccc"
            secureTextEntry={!mostrarSenha}
            onChangeText={(text) => setSenha(text)}
            onSubmitEditing={login}
          />
          <TouchableOpacity
            onPress={() => setMostrarSenha(!mostrarSenha)}
            style={[styles.iconSpace, { alignItems: "flex-end" }]}
          >
            <Feather
              name={mostrarSenha ? "eye-off" : "eye"}
              size={20}
              color="#0033A0"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[globalStyles.button, { maxWidth: 300 }]}
          onPress={handleLogin}
        >
          <Text style={globalStyles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
      {carregando && <Carregando />}
    </View>
  );
}

const styles = StyleSheet.create({
  iconSpace: {
    width: 20,
  },
  input: {
    flex: 1,
    height: 50,
    color: "black",
    fontSize: 16,
    fontWeight: 600,
    outlineStyle: "none" as any,
  },
});
