import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import * as Animatable from "react-native-animatable";
import { useEffect, useState } from "react";
import { useAuth } from "../../../../context/auth";
import { useThemeContext } from "../../../../context/ThemeContext";
import { getGlobalStyles } from "../../../../globalStyles";
import { IEpi } from "../../../../interfaces/epi";
import { ISuprimento } from "../../../../interfaces/suprimento";
import { getEpisEmFalta } from "../../../../services/epiApi";
import { getSuprimentosEmFalta } from "../../../../services/suprimentoApi";
import Carregando from "../../../components/Carregando";
import MenuInferior from "../../../components/MenuInferior";
import MenuSuperior from "../../../components/MenuSuperior";
import FiltroTipoItem from "../../../components/FiltroTipoItem";

type ItemUnificado = (IEpi | ISuprimento) & {
  tipo: "epi" | "suprimento";
};

function RenderItemEmFalta({
  item,
  globalStyles,
}: {
  item: ItemUnificado;
  globalStyles: any;
}) {
  const isEpi = item.tipo === "epi";

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
        <ScrollView contentContainerStyle={{ paddingRight: 10 }}>
          <Text style={globalStyles.dadosEpiText}>Nome: {item.nome}</Text>

          {isEpi ? (
            <>
              <Text style={globalStyles.dadosEpiText}>
                C.A.: {(item as IEpi).certificadoAprovacao}
              </Text>
              <Text style={[globalStyles.dadosEpiText, { marginBottom: 0 }]}>
                Tipo unidade: {(item as IEpi).tipoUnidade.tipo}
              </Text>
            </>
          ) : (
            <Text style={[globalStyles.dadosEpiText, { marginBottom: 0 }]}>
              Tipo unidade: {(item as ISuprimento).tipoUnidade.tipo}
            </Text>
          )}
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
          {item.quantidade}/{item.quantidadeParaAviso}
        </Text>
      </View>
    </View>
  );
}

export default function ItensEmFalta() {
  const { theme } = useThemeContext();
  const { isAuthenticated } = useAuth();
  const globalStyles = getGlobalStyles(theme);
  const [carregando, setCarregando] = useState(false);
  const [itensEmFalta, setItensEmFalta] = useState<ItemUnificado[]>([]);
  const [filtro, setFiltro] = useState<"todos" | "epi" | "suprimento">("todos");

  useEffect(() => {
    if (isAuthenticated) {
      const carregarItensEmFalta = async () => {
        try {
          setCarregando(true);
          const [epis, suprimentos] = await Promise.all([
            getEpisEmFalta(),
            getSuprimentosEmFalta(),
          ]);

          const itensUnificados: ItemUnificado[] = [
            ...epis.map((e: IEpi) => ({ ...e, tipo: "epi" })),
            ...suprimentos.map((s: ISuprimento) => ({
              ...s,
              tipo: "suprimento",
            })),
          ];

          setItensEmFalta(itensUnificados);
        } catch (erro: any) {
          alert(erro.message);
        } finally {
          setCarregando(false);
        }
      };

      carregarItensEmFalta();
    }
  }, []);

  const itensFiltrados = itensEmFalta.filter((item) => {
    if (filtro === "todos") return true;
    return item.tipo === filtro;
  });

  return (
    <View style={globalStyles.background}>
      <MenuSuperior />

      <Text style={globalStyles.title}>ITENS EM FALTA</Text>

      <Animatable.View
        animation="fadeInUp"
        duration={1000}
        style={globalStyles.mainContent}
      >
        <FiltroTipoItem valorSelecionado={filtro} onSelecionar={setFiltro} />
        <ScrollView
          style={globalStyles.itensScroll}
          contentContainerStyle={globalStyles.scrollContent}
          persistentScrollbar={true}
        >
          <View style={{ padding: 20, gap: 20 }}>
            {itensFiltrados.map((item, index) => (
              <Animatable.View
                key={`${item.tipo}-${item.id}`}
                animation="fadeInUp"
                duration={1000}
                delay={index * 150}
              >
                <RenderItemEmFalta item={item} globalStyles={globalStyles} />
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
