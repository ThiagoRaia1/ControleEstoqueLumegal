import { View, Text, ScrollView } from "react-native";
import * as Animatable from "react-native-animatable";
import { useEffect, useState } from "react";
import { useAuth } from "../../../../context/auth";
import { useThemeContext } from "../../../../context/ThemeContext";
import { getGlobalStyles } from "../../../../globalStyles";
import { IEpi } from "../../../../interfaces/epi";
import { getEpisEmFalta } from "../../../../services/epiApi";
import Carregando from "../../../components/Carregando";
import MenuInferior from "../../../components/MenuInferior";
import MenuSuperior from "../../../components/MenuSuperior";

function RenderItemEmFalta({
  epi,
  globalStyles,
}: {
  epi: IEpi;
  globalStyles: any;
}) {
  return (
    <View
      style={{
        backgroundColor: globalStyles.card.backgroundColor,
        borderRadius: 12,
        padding: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      }}
    >
      <View style={{ flex: 1, paddingRight: 12 }}>
        <Text style={globalStyles.itemTitle}>
          {"🧤 EPI"} - {epi.nome}
        </Text>
        <Text style={globalStyles.itemDetail}>
          C.A.: {epi.certificadoAprovacao}
        </Text>

        <Text style={globalStyles.itemDetail}>
          Tipo unidade: {epi.tipoUnidade.tipo}
        </Text>
      </View>

      <View
        style={{
          backgroundColor: "#0033A0",
          borderRadius: 8,
          paddingVertical: 10,
          paddingHorizontal: 14,
          minWidth: 100,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
          {epi.quantidade}/{epi.quantidadeParaAviso}
        </Text>
        <Text style={{ color: "white", fontSize: 12, marginTop: 4 }}>
          Quantidade
        </Text>
      </View>
    </View>
  );
}

export default function itensEmFalta() {
  const { theme } = useThemeContext();
  const { isAuthenticated } = useAuth();
  const globalStyles = getGlobalStyles(theme);
  const [carregando, setCarregando] = useState(false);
  const [episEmFalta, setEpisEmFalta] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
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
    }
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
            {episEmFalta.length === 0 ? (
              <Text
                style={{ textAlign: "center", color: "#999", marginTop: 20 }}
              >
                Nenhum item em falta no momento.
              </Text>
            ) : (
              episEmFalta.map((epi: IEpi, index) => (
                <Animatable.View
                  key={epi.id}
                  animation="fadeInUp"
                  duration={800}
                  delay={index * 100}
                >
                  <RenderItemEmFalta epi={epi} globalStyles={globalStyles} />
                </Animatable.View>
              ))
            )}
          </View>
        </ScrollView>
      </Animatable.View>

      <MenuInferior />
      {carregando && <Carregando />}
    </View>
  );
}
