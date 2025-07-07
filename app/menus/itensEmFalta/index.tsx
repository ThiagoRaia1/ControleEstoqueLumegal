import { View, StyleSheet, Text, ScrollView } from "react-native";
import * as Animatable from "react-native-animatable";
import MenuSuperior from "../../components/MenuSuperior";
import MenuInferior from "../../components/MenuInferior";
import Carregando from "../../components/Carregando";
import { useThemeContext } from "../../../context/ThemeContext";
import { useEffect, useState } from "react";
import { getEpisEmFalta } from "../../../services/epiApi";
import { IEpi } from "../../../interfaces/epi";
import { getGlobalStyles } from "../../../globalStyles";

function RenderItemEmFalta({
  epi,
  globalStyles,
}: {
  epi: IEpi;
  globalStyles: any;
}) {
  return (
    <View
      style={[
        globalStyles.item,
        {
          height: 110,
        },
      ]}
    >
      <View style={globalStyles.leftSide}>
        <ScrollView
          contentContainerStyle={{ paddingRight: 10, borderRadius: 20 }}
        >
          <Text style={globalStyles.dadosEpiText}>Nome: {epi.nome}</Text>
          <Text style={globalStyles.dadosEpiText}>
            C.A.: {epi.certificadoAprovacao}
          </Text>
          <Text style={[globalStyles.dadosEpiText, { marginBottom: 0 }]}>
            Unidade/Par: {epi.tipoUnidade.tipo}
          </Text>
        </ScrollView>
      </View>

      <View
        style={[
          globalStyles.rightSide,
          {
            justifyContent: "center",
            alignSelf: "center",
            backgroundColor: "#0033A0",
            borderRadius: 10,
          },
        ]}
      >
        <Text
          style={[
            globalStyles.dadosEpiText,
            {
              textAlign: "center",
              color: "white",
              fontSize: 18,
              marginBottom: 0,
            },
          ]}
        >
          Quantidade:{"\n"}
          {epi.quantidade}/{epi.quantidadeParaAviso}
        </Text>
      </View>
    </View>
  );
}

export default function itensEmFalta() {
  const { theme } = useThemeContext();
  const globalStyles = getGlobalStyles(theme);
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
    <View style={globalStyles.background}>
      <MenuSuperior />
      <Text style={globalStyles.title}>ITENS EM FALTA</Text>
      <Animatable.View
        animation="fadeInUp"
        duration={1000}
        style={globalStyles.mainContent}
      >
        <ScrollView
          style={globalStyles.itensScroll}
          contentContainerStyle={globalStyles.scrollContent}
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
                  <RenderItemEmFalta epi={epi} globalStyles={globalStyles} />
                </View>
              </Animatable.View>
            ))}
          </View>
        </ScrollView>
      </Animatable.View>

      <MenuInferior />
      {carregando && <Carregando />}
    </View>
  );
}

const styles = StyleSheet.create({
  dadosEpiText: {
    textAlign: "left",
    fontSize: 14,
    color: "black",
    fontWeight: "500",
    marginBottom: 10,
  },
});
