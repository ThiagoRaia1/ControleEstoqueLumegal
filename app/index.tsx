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
import { nomePaginas } from "../utils/nomePaginas";
import { router } from "expo-router";
import {
  TipoAcessoType,
  useTipoAcessoContext,
} from "../context/tipoAcessoContext";

export default function TelaLogin() {
  const { setTipoAcesso } = useTipoAcessoContext();
  const { theme } = useThemeContext();
  const globalStyles = getGlobalStyles(theme);
  const { login, logout } = useAuth();
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

      setTipoAcesso(tipoAcesso as TipoAcessoType);
      login();
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
          <Feather name="mail" size={20} color="#0033A0" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#ccc"
            onChangeText={(text) => setLoginInput(text)}
            onSubmitEditing={login}
          />
        </View>

        <View style={globalStyles.loginInputContainer}>
          <Feather name="lock" size={20} color="#0033A0" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            placeholderTextColor="#ccc"
            secureTextEntry={!mostrarSenha}
            onChangeText={(text) => setSenha(text)}
            onSubmitEditing={login}
          />
          <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
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
  icon: {
    marginRight: 10,
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
