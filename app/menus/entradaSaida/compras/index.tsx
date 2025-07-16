import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { useThemeContext } from "../../../../context/ThemeContext";
import {
  useTipoAcessoContext,
  acessoCompras,
  acessoComprasAdm,
} from "../../../../context/tipoAcessoContext";
import { getGlobalStyles } from "../../../../globalStyles";
import { IMovimentacaoItem } from "../../../../interfaces/entradaSaida";
import { IEpi } from "../../../../interfaces/epi";
import { ISuprimento } from "../../../../interfaces/suprimento";
import {
  entradaSaidaEpiApi,
  entradaSaidaSuprimentoApi,
} from "../../../../services/entradaSaidaApi";
import { getEpis } from "../../../../services/epiApi";
import { getSuprimentos } from "../../../../services/suprimentoApi";
import Carregando from "../../../components/Carregando";
import MenuInferior from "../../../components/MenuInferior";
import MenuSuperior from "../../../components/MenuSuperior";
import SearchBar from "../../../components/SearchBar";
import AntDesign from "@expo/vector-icons/AntDesign";
import FiltroTipoItem from "../../../components/FiltroTipoItem";

type ItemUnificado = (IEpi | ISuprimento) & { tipo: "epi" | "suprimento" };

function RenderItem({
  globalStyles,
  item,
  setQuantidadeItem,
  quantidadeASerMovida,
}: {
  globalStyles: any;
  item: ItemUnificado;
  setQuantidadeItem: (id: string, novaQuantidade: number) => void;
  quantidadeASerMovida: number;
}) {
  const isEpi = item.tipo === "epi";

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
          {isEpi && (
            <>
              <Text style={globalStyles.dadosEpiText}>
                C.A.: {(item as IEpi).certificadoAprovacao}
              </Text>
              <Text style={globalStyles.dadosEpiText}>
                Unidade/Par: {(item as IEpi).tipoUnidade.tipo}
              </Text>
              <Text style={globalStyles.dadosEpiText}>
                Quantidade: {item.quantidade}
              </Text>
              <Text style={[globalStyles.dadosEpiText, { marginBottom: 0 }]}>
                Quantidade para aviso: {(item as IEpi).quantidadeParaAviso}
              </Text>
            </>
          )}
          {!isEpi && (
            <>
              <Text style={globalStyles.dadosEpiText}>
                Unidade: {(item as ISuprimento).tipoUnidade.tipo}
              </Text>
              <Text style={globalStyles.dadosEpiText}>
                Quantidade: {item.quantidade}
              </Text>
              <Text style={[globalStyles.dadosEpiText, { marginBottom: 0 }]}>
                Quantidade para aviso:{" "}
                {(item as ISuprimento).quantidadeParaAviso}
              </Text>
            </>
          )}
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

              // Impede ultrapassar o limite de entrega
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
  const { tipoAcesso } = useTipoAcessoContext();
  const { theme } = useThemeContext();
  const globalStyles = getGlobalStyles(theme);
  const [carregando, setCarregando] = useState(false);
  const [epis, setEpis] = useState<IEpi[]>([]);
  const [suprimentos, setSuprimentos] = useState<ISuprimento[]>([]);
  const [quantidadeASerMovida, setQuantidadeASerMovida] = useState<{
    [key: string]: number;
  }>({});
  const [pesquisa, setPesquisa] = useState("");
  const [filtro, setFiltro] = useState<"todos" | "epi" | "suprimento">("todos");

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

  const carregarSuprimentos = async () => {
    try {
      setSuprimentos(await getSuprimentos());
    } catch (erro: any) {
      alert(erro.message);
    }
  };

  useEffect(() => {
    try {
      setCarregando(true);
      carregarEpis();
      if ([acessoCompras, acessoComprasAdm].includes(tipoAcesso)) {
        carregarSuprimentos();
      }
    } catch (erro: any) {
      alert(erro.message);
    } finally {
      setCarregando(false);
    }
  }, []);

  const listaUnificada: ItemUnificado[] = [
    ...epis.map((item) => ({ ...item, tipo: "epi" as const })),
    ...([acessoCompras, acessoComprasAdm].includes(tipoAcesso)
      ? suprimentos.map((item) => ({ ...item, tipo: "suprimento" as const }))
      : []),
  ];

  const setQuantidadeItem = (
    id: string,
    tipo: "epi" | "suprimento",
    novaQuantidade: number
  ) => {
    const chave = `${tipo}-${id}`;
    setQuantidadeASerMovida((prev) => ({
      ...prev,
      [chave]: novaQuantidade,
    }));
  };

  const handleConfirmarMovimentacoes = async () => {
    const movimentacoesEpi: IMovimentacaoItem[] = [];
    const movimentacoesSuprimento: IMovimentacaoItem[] = [];

    const resumoMovimentacoes: { nome: string; quantidade: number }[] = [];

    for (const [chave, quantidade] of Object.entries(quantidadeASerMovida)) {
      if (quantidade === 0) continue;

      const [tipo, id] = chave.split("-");
      const item = listaUnificada.find(
        (i) => String(i.id) === id && i.tipo === tipo
      );

      if (!item) continue;

      resumoMovimentacoes.push({
        nome: item.nome,
        quantidade,
      });

      const movimentacao: IMovimentacaoItem = {
        id,
        quantidade,
      };

      if (tipo === "epi") {
        movimentacoesEpi.push(movimentacao);
      } else if (tipo === "suprimento") {
        movimentacoesSuprimento.push(movimentacao);
      }
    }

    if (resumoMovimentacoes.length === 0) {
      alert("Nenhuma movimentação selecionada.");
      return;
    }

    try {
      setCarregando(true);

      // Envia separadamente para o backend
      if (movimentacoesEpi.length > 0) {
        await entradaSaidaEpiApi(movimentacoesEpi);
      }

      if (movimentacoesSuprimento.length > 0) {
        await entradaSaidaSuprimentoApi(movimentacoesSuprimento);
      }

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
      await carregarSuprimentos();
    } catch (erro: any) {
      alert(erro.message);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarEpis();
  }, []);

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

        <FiltroTipoItem valorSelecionado={filtro} onSelecionar={setFiltro} />

        <ScrollView
          style={globalStyles.itensScroll}
          contentContainerStyle={globalStyles.scrollContent}
          persistentScrollbar={true}
        >
          <View style={{ padding: 20, gap: 20 }}>
            {listaUnificada
              .slice()
              .sort((a, b) =>
                (a.nome || "").localeCompare(b.nome || "", "pt-BR", {
                  sensitivity: "base",
                })
              )
              .filter((item) => {
                if (filtro !== "todos" && item.tipo !== filtro) return false;

                const termo = normalizar(pesquisa);
                const nome = normalizar(item.nome || "");
                const ca = normalizar(
                  "certificadoAprovacao" in item &&
                    typeof item.certificadoAprovacao === "string"
                    ? item.certificadoAprovacao
                    : ""
                );

                return nome.startsWith(termo) || ca.startsWith(termo);
              })

              .map((item: ItemUnificado, index: number) => {
                const uniqueKey = `${item.tipo}-${item.id}`;
                return (
                  <Animatable.View
                    key={uniqueKey}
                    animation="fadeInUp"
                    duration={1000}
                    delay={index * 150}
                  >
                    <View key={uniqueKey}>
                      <RenderItem
                        globalStyles={globalStyles}
                        item={item}
                        setQuantidadeItem={(id, novaQuantidade) =>
                          setQuantidadeItem(id, item.tipo, novaQuantidade)
                        }
                        quantidadeASerMovida={
                          quantidadeASerMovida[`${item.tipo}-${item.id}`] || 0
                        }
                      />
                    </View>
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
