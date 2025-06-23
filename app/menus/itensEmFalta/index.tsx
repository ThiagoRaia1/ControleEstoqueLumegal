import { useState, useEffect } from "react";
import { View, Image, StyleSheet, Text } from "react-native";
import * as Animatable from "react-native-animatable";
import { useAuth } from "../../../context/auth";
import MenuInferior from "../../components/MenuInferior";
import BotaoLogout from "../../components/BotaoLogout";

export default function Inicio() {
  const { usuario } = useAuth();
  const [mensagemErro, setMensagemErro] = useState("");


  return (
    <View style={{ flex: 1 }}>
      <View style={styles.content}>
        <BotaoLogout />
        {/* <Image
          source={require("../../../assets/fundoInicio.png")}
          style={styles.backgroundImage}
          resizeMode="stretch"
        /> */}

        <Animatable.View
          animation="fadeInUp"
          duration={1000}
          style={styles.mainContent}
        >
          <Text style={styles.welcomeText}>
            {/* Mostra só o primeiro nome */}
            Bem vindo
          </Text>

          <View style={styles.proxAulaMainView}>
            <Text style={{ fontSize: 20, marginBottom: 10 }}>
              Sua próxima aula é:
            </Text>

            <View style={styles.proxAulaSubView}>
              <Text style={styles.proxAulaSubText}>
                teste
              </Text>
            </View>
          </View>
        </Animatable.View>

      </View>
      <MenuInferior />
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  mainContent: {
    width: "100%",
    maxWidth: 700,
    alignSelf: "center",
    gap: 5,
    padding: 20,
  },
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
    textShadowColor: "black", // Cor da borda
    textShadowOffset: { width: 1, height: 1 }, // Espessura da sombra
    textShadowRadius: 10, // Suaviza a borda
  },
  proxAulaMainView: {
    backgroundColor: "white",
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "#ccc",
    height: 250,
    padding: 10,
  },
  proxAulaSubView: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    width: "100%",
    height: "80%",
  },
  proxAulaSubText: {
    textAlign: "center",
    color: "#4B366D",
    fontSize: 24,
  },
});
