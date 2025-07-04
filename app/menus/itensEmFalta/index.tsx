import { View, StyleSheet, Text, ScrollView } from "react-native";
import * as Animatable from "react-native-animatable";
import MenuSuperior from "../../components/MenuSuperior";
import MenuInferior from "../../components/MenuInferior";
import Carregando from "../../components/Carregando";
import { useThemeContext } from "../../../context/ThemeContext";
import { useEffect, useState } from "react";
import { getEpisEmFalta } from "../../../services/epiApi";
import { IEpi } from "../../../interfaces/epi";
import { ITipoUnidade } from "../../../interfaces/tipoUnidade";

function renderItemEmFalta(
  theme: string,
  nome: string,
  ca: string,
  tipoUnidade: ITipoUnidade,
  quantidade: number,
  quantidadeParaAviso: number
) {
  return (
    <View
      style={[
        styles.itemEmFalta,
        theme === "light"
          ? { backgroundColor: "white" }
          : { backgroundColor: "#c7c7c7" },
      ]}
    >
      <View style={styles.leftSide}>
        <ScrollView
          contentContainerStyle={{ paddingRight: 10, borderRadius: 20 }}
        >
          <Text style={styles.dadosEpiText}>Nome: {nome}</Text>
          <Text style={styles.dadosEpiText}>C.A.: {ca}</Text>
          <Text style={[styles.dadosEpiText, { marginBottom: 0 }]}>
            Unidade/Par: {tipoUnidade.tipo}
          </Text>
        </ScrollView>
      </View>

      <View style={styles.rightSide}>
        <Text
          style={[
            styles.dadosEpiText,
            {
              textAlign: "center",
              color: "white",
              fontSize: 18,
              marginBottom: 0,
            },
          ]}
        >
          Quantidade:{"\n"}
          {quantidade}/{quantidadeParaAviso}
        </Text>
      </View>
    </View>
  );
}

export default function itensEmFalta() {
  const { theme } = useThemeContext();
  const [carregando, setCarregando] = useState(false);
  const [episEmFalta, setEpisEmFalta] = useState([]);

  useEffect(() => {
    const carregarEpisEmFalta = async () => {
      try {
        setCarregando(true);
        setEpisEmFalta(await getEpisEmFalta());
      } catch (erro: any) {
        alert(erro.message);
      } finally {
        setCarregando(false);
      }
    };

    carregarEpisEmFalta();
  }, []);

  return (
    <View
      style={[
        styles.background,
        theme === "light"
          ? {
              backgroundColor: "#f0f3fa",
            }
          : { backgroundColor: "#1c1c1c" },
      ]}
    >
      <MenuSuperior />
      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            theme === "light" ? { color: "black" } : { color: "white" },
          ]}
        >
          ITENS EM FALTA
        </Text>
        <Animatable.View
          animation="fadeInUp"
          duration={1000}
          style={styles.mainContent}
        >
          <ScrollView
            style={[
              styles.itensEmFaltaScroll,
              theme === "light"
                ? { borderColor: "#ccc" }
                : { borderColor: "black" },
            ]}
            contentContainerStyle={[
              styles.scrollContent,
              theme === "light"
                ? { backgroundColor: "white" }
                : { backgroundColor: "#5e5e5e" },
            ]}
            persistentScrollbar={true}
          >
            <View style={{ padding: 20, gap: 20 }}>
              {episEmFalta.map((epi: IEpi, index: number) => (
                <Animatable.View
                  key={epi.id}
                  animation="fadeInUp"
                  duration={1000}
                  delay={index * 150}
                >
                  <View key={epi.id}>
                    {renderItemEmFalta(
                      theme,
                      epi.nome || "",
                      epi.certificadoAprovacao || "",
                      epi.tipoUnidade,
                      epi.quantidade || 0,
                      epi.quantidadeParaAviso || 0
                    )}
                  </View>
                </Animatable.View>
              ))}
            </View>
          </ScrollView>
        </Animatable.View>
      </View>
      <MenuInferior />
      {carregando && <Carregando />}
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  content: {
    flex: 1,
    alignItems: "center",
  },
  mainContent: {
    flex: 1,
    width: "100%",
    maxWidth: 800,
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    textAlign: "center",
  },
  itensEmFaltaScroll: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 3,
    alignSelf: "center",
    width: "100%",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "flex-start",
  },
  leftSide: {
    flex: 1,
    justifyContent: "space-between",
    height: "100%",
    paddingVertical: 5,
    gap: 5,
  },
  rightSide: {
    flex: 1,
    height: "100%",
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "#0033A0",
    borderRadius: 10,
  },
  itemEmFalta: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    gap: 10,
    backgroundColor: "white",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 20,
    width: "100%",
    height: 110,
  },
  dadosEpiText: {
    textAlign: "left",
    fontSize: 14,
    color: "black",
    fontWeight: "500",
    marginBottom: 10,
  },
});
