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
  return (
    <View style={globalStyles.item}>
      <View style={globalStyles.leftSide}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "space-between",
            paddingRight: 10,
          }}
        >
          <Text style={globalStyles.dadosEpiText}>Nome: {item.nome}</Text>
          <Text style={globalStyles.dadosEpiText}>
            C.A.: {item.certificadoAprovacao}
          </Text>
          <Text style={globalStyles.dadosEpiText}>
            Unidade/Par: {item.tipoUnidade.tipo}
          </Text>
          <Text style={globalStyles.dadosEpiText}>
            Quantidade: {item.quantidade}
          </Text>
          <Text style={[globalStyles.dadosEpiText, { marginBottom: 0 }]}>
            Quantidade para aviso: {item.quantidadeParaAviso}
          </Text>
        </ScrollView>
      </View>

      <View
        style={[
          globalStyles.rightSide,
          {
            justifyContent: "center",
            alignSelf: "center",
            height: "100%",
            borderWidth: 1,
            borderRadius: 20,
            borderColor: "#888",
            padding: 10,
          },
        ]}
      >
        <View style={styles.plusMinusButtonContainer}>
          <TouchableOpacity
            style={[styles.plusMinusButton, { backgroundColor: "green" }]}
            onPress={() => {
              setQuantidadeItem(item.id.toString(), quantidadeASerMovida + 1);
            }}
          >
            <AntDesign name="pluscircleo" size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.plusMinusButton, { backgroundColor: "#b30f02" }]}
            onPress={() => {
              const novaQuantidade = quantidadeASerMovida - 1;
              const max = item.quantidade ?? 0;

              if (novaQuantidade < 0 && Math.abs(novaQuantidade) > max) {
                setQuantidadeItem(item.id.toString(), -max);
              } else {
                setQuantidadeItem(item.id.toString(), novaQuantidade);
              }
            }}
          >
            <AntDesign name="minuscircleo" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            gap: 5,
          }}
        >
          <Text style={[globalStyles.dadosEpiText, { textAlign: "center" }]}>
            Quantidade a ser movida:
          </Text>
          <TextInput
            style={styles.quantidadeInput}
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
        </View>
      </View>
    </View>
  );
}

export default function EntradaSaida() {
  const { theme } = useThemeContext();
  const globalStyles = getGlobalStyles(theme);
  const [carregando, setCarregando] = useState(false);
  const [epis, setEpis] = useState<IEpi[]>([]);
  const [quantidadeASerMovida, setQuantidadeASerMovida] = useState<{
    [key: string]: number;
  }>({});
  const [pesquisa, setPesquisa] = useState("");

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
      <Text style={globalStyles.title}>ENTRADA/SAÍDA</Text>
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

        <ScrollView
          style={globalStyles.itensScroll}
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
  plusMinusButtonContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    gap: 10,
  },
  plusMinusButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
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
