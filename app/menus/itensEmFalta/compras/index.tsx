import { View, Text, ScrollView } from "react-native";
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
          {isEpi ? "🧤 EPI" : "📦 Suprimento"} - {item.nome}
        </Text>
        {isEpi && (
          <Text style={globalStyles.itemDetail}>
            C.A.: {(item as IEpi).certificadoAprovacao}
          </Text>
        )}
        <Text style={globalStyles.itemDetail}>
          Tipo unidade: {item.tipoUnidade.tipo}
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
          {item.quantidade}/{item.quantidadeParaAviso}
        </Text>
        <Text style={{ color: "white", fontSize: 12, marginTop: 4 }}>
          Quantidade
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
          <View style={{ padding: 16, gap: 16 }}>
            {itensFiltrados.length === 0 ? (
              <Text
                style={{ textAlign: "center", color: "#999", marginTop: 20 }}
              >
                Nenhum item em falta no momento.
              </Text>
            ) : (
              itensFiltrados.map((item, index) => (
                <Animatable.View
                  key={`${item.tipo}-${item.id}`}
                  animation="fadeInUp"
                  duration={800}
                  delay={index * 100}
                >
                  <RenderItemEmFalta item={item} globalStyles={globalStyles} />
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
