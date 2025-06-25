import React, { useState } from "react";
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

export default function TelaLogin() {
  const { usuario, handleLogin, setUsuario } = useAuth();
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const login = async () => {
    setCarregando(true);
    try {
      await handleLogin(senha);
    } catch (erro: any) {
      console.log("Erro: ", erro.message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <>
      <View style={{ flex: 1 }}>
        <View style={styles.background} />
        <View style={styles.content}>
          <Text
            style={{
              fontSize: 25,
              fontWeight: 600,
              textAlign: "center",
              marginBottom: 20,
            }}
          >
            Controle de estoque Lumegal
          </Text>
          <View style={styles.inputContainer}>
            <Feather
              name="mail"
              size={20}
              color="#0033A0"
              style={styles.icon}
            />
            <TextInput
              style={[styles.input, { outline: "none" } as any]}
              placeholder="Email"
              placeholderTextColor="#ccc"
              onChangeText={(text) => setUsuario({ ...usuario, login: text })}
              onSubmitEditing={login}
            />
          </View>

          <View style={styles.inputContainer}>
            <Feather
              name="lock"
              size={20}
              color="#0033A0"
              style={styles.icon}
            />
            <TextInput
              style={[styles.input, { outline: "none" } as any]}
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

          <TouchableOpacity style={styles.button} onPress={login}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
      {carregando && <Carregando />}
    </>
  );
}

const styles = StyleSheet.create({
  background: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "#edf3ff",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignSelf: "center",
    paddingHorizontal: 30,
    width: "100%",
    maxWidth: 600,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    elevation: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    width: "100%",
    borderWidth: 1,
    borderColor: "#0033A0",
    borderRadius: 20,
    justifyContent: "space-between",
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: "black",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#0033A0",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 100,
    marginTop: 10,
    width: "50%",
    alignItems: "center",
    alignSelf: "center",
    elevation: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
  },
  link: {
    color: "black",
    marginTop: 20,
    textDecorationLine: "underline",
  },
  registerLink: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
});
