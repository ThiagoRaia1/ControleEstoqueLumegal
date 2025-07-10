import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "../context/auth";
import Carregando from "./components/Carregando";
import { useThemeContext } from "../context/ThemeContext";
import { getGlobalStyles } from "../globalStyles";
import MenuSuperior from "./components/MenuSuperior";

export default function TelaLogin() {
  const { theme } = useThemeContext();
  const globalStyles = getGlobalStyles(theme);
  const { usuario, handleLogin, setUsuario } = useAuth();
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const login = async () => {
    setCarregando(true);
    try {
      await handleLogin(senha);
    } catch (erro: any) {
      alert(erro.message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <View style={globalStyles.background}>
      <MenuSuperior />
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
        <View style={styles.inputContainer}>
          <Feather name="mail" size={20} color="#0033A0" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#ccc"
            onChangeText={(text) => setUsuario({ ...usuario, login: text })}
            onSubmitEditing={login}
          />
        </View>

        <View style={styles.inputContainer}>
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
          onPress={login}
        >
          <Text style={globalStyles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
      {carregando && <Carregando />}
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    elevation: 20,
    paddingHorizontal: 15,
    marginBottom: 20,
    width: "100%",
    borderWidth: 1,
    borderColor: "#0033A0",
    borderRadius: 10,
    justifyContent: "space-between",
    // Sombra na Web
    ...(Platform.OS === "web"
      ? {
          boxShadow: "0px 10px 10px rgba(0, 0, 0, 0.6)",
        }
      : {}),
  },
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
