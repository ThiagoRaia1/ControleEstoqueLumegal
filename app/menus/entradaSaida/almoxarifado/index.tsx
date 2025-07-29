import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { useEffect, useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useThemeContext } from "../../../../context/ThemeContext";
import { getGlobalStyles } from "../../../../globalStyles";
import { IMovimentacaoItem } from "../../../../interfaces/entradaSaida";
import { IEpi } from "../../../../interfaces/epi";
import { entradaSaidaEpiApi } from "../../../../services/entradaSaidaApi";
import { getEpis } from "../../../../services/epiApi";
import Carregando from "../../../components/Carregando";
import MenuInferior from "../../../components/MenuInferior";
import MenuSuperior from "../../../components/MenuSuperior";
import SearchBar from "../../../components/SearchBar";
import { usePathname, router } from "expo-router";
import {
  acessoComprasAdm,
  acessoAlmoxarifadoAdm,
  useTipoAcessoContext,
} from "../../../../context/tipoAcessoContext";
import { nomePaginas } from "../../../../utils/nomePaginas";

function RenderItem({
  globalStyles,
  item,
  setQuantidadeItem,
  quantidadeASerMovida,
}: {
  globalStyles: any;
  item: IEpi;
  setQuantidadeItem: (id: string, novaQuantidade: number) => void;
  quantidadeASerMovida: number;
}) {
  const { theme } = useThemeContext();
  const plusMinusSize = 25;
  return (
    <View
      style={{
        backgroundColor: globalStyles.card.backgroundColor,
        borderRadius: 12,
        padding: 16,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {/* Lado Esquerdo: Info do item */}
      <View style={{ flex: 1, paddingRight: 10 }}>
        <Text style={globalStyles.itemTitle}>
          {"🧤 EPI"} - {item.nome}
        </Text>

        <Text style={globalStyles.itemDetail}>
          C.A.: {item.certificadoAprovacao}
        </Text>

        <Text style={globalStyles.itemDetail}>
          Unidade/Par: {item.tipoUnidade.tipo}
        </Text>

        <Text style={globalStyles.itemDetail}>
          Quantidade atual: {item.quantidade}
        </Text>
        <Text style={globalStyles.itemDetail}>
          Aviso a partir de: {item.quantidadeParaAviso}
        </Text>
      </View>

      {/* Lado Direito: Controles */}
      <View
        style={{
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
        }}
      >
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-evenly",
            gap: 20,
          }}
        >
          <TouchableOpacity
            onPress={() =>
              setQuantidadeItem(item.id.toString(), quantidadeASerMovida + 1)
            }
            style={[
              styles.plusMinusButton,
              {
                backgroundColor: "green",
                borderColor: theme === "light" ? "black" : "white",
              },
            ]}
          >
            <AntDesign name="plus" size={plusMinusSize} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              const novaQuantidade = quantidadeASerMovida - 1;
              const max = item.quantidade ?? 0;
              if (novaQuantidade < 0 && Math.abs(novaQuantidade) > max) {
                setQuantidadeItem(item.id.toString(), -max);
              } else {
                setQuantidadeItem(item.id.toString(), novaQuantidade);
              }
            }}
            style={[
              styles.plusMinusButton,
              {
                backgroundColor: "#b30f02",
                borderColor: theme === "light" ? "black" : "white",
              },
            ]}
          >
            <AntDesign
              name="minus"
              size={plusMinusSize}
              color={theme === "light" ? "#ddd" : "white"}
            />
          </TouchableOpacity>
        </View>

        <TextInput
          style={[
            styles.quantidadeInput,
            { color: theme === "light" ? "black" : "white" },
          ]}
          keyboardType="numeric"
          value={quantidadeASerMovida.toString()}
          onChangeText={(text: string) => {
            const numericValue = text.replace(/(?!^-)-|[^0-9-]/g, "");
            const id = item.id.toString();

            if (numericValue === "" || numericValue === "-") {
              setQuantidadeItem(id, numericValue === "-" ? -0 : 0);
              return;
            }

            let valor = parseInt(numericValue, 10);
            const max = item.quantidade ?? 0;
            if (valor < 0 && Math.abs(valor) > max) {
              valor = -max;
            }

            setQuantidadeItem(id, valor);
          }}
        />
        <Text style={{ fontSize: 12, color: "#888" }}>Quantidade a mover</Text>
      </View>
    </View>
  );
}

export default function EntradaSaida() {
  const { tipoAcesso } = useTipoAcessoContext();
  const { theme } = useThemeContext();
  const globalStyles = getGlobalStyles(theme);
  const [carregando, setCarregando] = useState(false);
  const [epis, setEpis] = useState<IEpi[]>([]);
  const [quantidadeASerMovida, setQuantidadeASerMovida] = useState<{
    [key: string]: number;
  }>({});
  const [pesquisa, setPesquisa] = useState("");

  const pathname = usePathname();

  useEffect(() => {
    if (
      tipoAcesso === acessoComprasAdm &&
      pathname !== nomePaginas.entradaSaida.compras
    ) {
      router.replace(nomePaginas.entradaSaida.compras);
    }

    if (
      tipoAcesso === acessoAlmoxarifadoAdm &&
      pathname !== nomePaginas.entradaSaida.almoxarifado
    ) {
      router.replace(nomePaginas.entradaSaida.almoxarifado);
    }
  }, [tipoAcesso, pathname]);

  const normalizar = (texto: string) =>
    texto
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  const carregarEpis = async () => {
    try {
      setEpis(await getEpis());
    } catch (erro: any) {
      alert(erro.message);
    }
  };

  useEffect(() => {
    try {
      setCarregando(true);
      carregarEpis();
    } catch (erro: any) {
      alert(erro.message);
    } finally {
      setCarregando(false);
    }
  }, []);

  const setQuantidadeItem = (id: string, novaQuantidade: number) => {
    const chave = `epi-${id}`;
    setQuantidadeASerMovida((prev) => ({
      ...prev,
      [chave]: novaQuantidade,
    }));
  };

  const handleConfirmarMovimentacoes = async () => {
    const movimentacoesEpi: IMovimentacaoItem[] = [];
    const resumoMovimentacoes: { nome: string; quantidade: number }[] = [];

    for (const [chave, quantidade] of Object.entries(quantidadeASerMovida)) {
      if (quantidade === 0) continue;

      const [, id] = chave.split("-");
      const item = epis.find((i) => String(i.id) === id);

      if (!item) continue;

      resumoMovimentacoes.push({
        nome: item.nome,
        quantidade,
      });

      movimentacoesEpi.push({ id, quantidade });
    }

    if (resumoMovimentacoes.length === 0) {
      alert("Nenhuma movimentação selecionada.");
      return;
    }

    try {
      setCarregando(true);
      await entradaSaidaEpiApi(movimentacoesEpi);

      alert(
        "Movimentações confirmadas:\n" +
          resumoMovimentacoes
            .sort((a, b) =>
              a.nome.localeCompare(b.nome, "pt", { sensitivity: "base" })
            )
            .map((m) => `${m.nome}: ${m.quantidade}`)
            .join("\n")
      );

      setQuantidadeASerMovida({});
      await carregarEpis();
    } catch (erro: any) {
      alert(erro.message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <View style={globalStyles.background}>
      <MenuSuperior />
      <Animatable.View
        animation="fadeInUp"
        duration={1000}
        style={globalStyles.mainContent}
      >
        <SearchBar
          value={pesquisa}
          onChangeText={setPesquisa}
          placeholder="Pesquisar por nome ou C.A."
        />

        <View style={globalStyles.itensScroll}>
          <ScrollView
            contentContainerStyle={globalStyles.scrollContent}
            persistentScrollbar={true}
          >
            <View style={{ padding: 20, gap: 20 }}>
              {epis
                .slice()
                .sort((a, b) =>
                  (a.nome || "").localeCompare(b.nome || "", "pt-BR", {
                    sensitivity: "base",
                  })
                )
                .filter((item) => {
                  const termo = normalizar(pesquisa);
                  const nome = normalizar(item.nome || "");
                  const ca = normalizar(
                    typeof item.certificadoAprovacao === "string"
                      ? item.certificadoAprovacao
                      : ""
                  );

                  return nome.startsWith(termo) || ca.startsWith(termo);
                })
                .map((item, index: number) => {
                  const uniqueKey = `epi-${item.id}`;
                  return (
                    <Animatable.View
                      key={uniqueKey}
                      animation="fadeInUp"
                      duration={1000}
                      delay={index * 150}
                    >
                      <RenderItem
                        globalStyles={globalStyles}
                        item={item}
                        setQuantidadeItem={(id, novaQuantidade) =>
                          setQuantidadeItem(id, novaQuantidade)
                        }
                        quantidadeASerMovida={
                          quantidadeASerMovida[`epi-${item.id}`] || 0
                        }
                      />
                    </Animatable.View>
                  );
                })}
            </View>
          </ScrollView>
        </View>
        <TouchableOpacity
          onPress={handleConfirmarMovimentacoes}
          style={globalStyles.button}
        >
          <Text style={globalStyles.buttonText}>Confirmar movimentações</Text>
        </TouchableOpacity>
      </Animatable.View>

      <MenuInferior />
      {carregando && <Carregando />}
    </View>
  );
}

const styles = StyleSheet.create({
  plusMinusButton: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    height: 45,
    width: 45,
    borderWidth: 3,
  },
  quantidadeInput: {
    width: "100%",
    textAlign: "center",
    color: "black",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontWeight: 500,
    borderColor: "#888",
    outlineStyle: "none" as any,
  },
});
