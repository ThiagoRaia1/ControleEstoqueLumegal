import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { useThemeContext } from "../../../context/ThemeContext";
import BotaoLogout from "../../components/BotaoLogout";
import MenuInferior from "../../components/MenuInferior";
import { useEffect, useState } from "react";
import Carregando from "../../components/Carregando";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  entradaSaidaApi,
} from "../../../services/entradaSaidaApi";
import { IEpi } from "../../../interfaces/epi";
import { getEpis } from "../../../services/epiApi";
import { IMovimentacaoEpi } from "../../../interfaces/entradaSaida";

function renderItem(
  theme: string,
  id: string,
  nome: string,
  ca: string,
  tipoUnidade: string,
  quantidade: number,
  quantidadeParaAviso: number,
  quantidadeASerMovida: number,
  setQuantidadeItem: (id: string, novaQuantidade: number) => void
) {
  console.log(tipoUnidade)
  return (
    <View
      style={[
        styles.item,
        theme === "light"
          ? { backgroundColor: "white", borderColor: "#ccc" }
          : { backgroundColor: "#c7c7c7", borderColor: "black" },
      ]}
    >
      <View style={styles.leftSide}>
        <ScrollView
          contentContainerStyle={{ paddingRight: 10, borderRadius: 20 }}
        >
          <Text style={styles.dadosEpiText}>Nome: {nome}</Text>
          <Text style={styles.dadosEpiText}>C.A.: {ca}</Text>
          <Text style={styles.dadosEpiText}>Unidade/Par: {tipoUnidade}</Text>
          <Text style={styles.dadosEpiText}>Quantidade: {quantidade}</Text>
          <Text style={[styles.dadosEpiText, { marginBottom: 0 }]}>
            Quantidade para aviso: {quantidadeParaAviso}
          </Text>
        </ScrollView>
      </View>

      <View
        style={[
          styles.rightSide,
          theme === "light"
            ? { borderColor: "#ccc" }
            : { borderColor: "black" },
        ]}
      >
        <View style={styles.plusMinusButtonContainer}>
          <TouchableOpacity
            style={[styles.plusMinusButton, { backgroundColor: "green" }]}
            onPress={() => setQuantidadeItem(id, quantidadeASerMovida + 1)}
          >
            <AntDesign name="pluscircleo" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.plusMinusButton, { backgroundColor: "#b30f02" }]}
            onPress={() => setQuantidadeItem(id, quantidadeASerMovida - 1)}
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
          <Text
            style={[
              styles.dadosEpiText,
              { textAlign: "center", marginBottom: 0 },
            ]}
          >
            Quantidade a ser movida:
          </Text>
          <TextInput
            style={[
              {
                width: "100%",
                textAlign: "center",
                color: "black",
                borderWidth: 1,
                borderRadius: 20,
                paddingHorizontal: 10,
                paddingVertical: 5,
                fontWeight: 500,
              },
              theme === "light"
                ? { borderColor: "#ccc" }
                : { borderColor: "black" },
              { outlineStyle: "none" } as any,
            ]}
            keyboardType="numeric"
            value={quantidadeASerMovida.toString()}
            onChangeText={(text: string) => {
              // Permite apenas "-" no início e números
              const numericValue = text.replace(/(?!^-)-|[^0-9-]/g, "");

              // Trata campo vazio ou apenas "-"
              if (numericValue === "" || numericValue === "-") {
                setQuantidadeItem(id, numericValue === "-" ? -0 : 0);
                return;
              }

              let valor = parseInt(numericValue, 10);

              // Se for negativo e o valor absoluto for maior que a quantidade, limita
              if (valor < 0 && Math.abs(valor) > quantidade) {
                valor = -quantidade;
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
  const [carregando, setCarregando] = useState(false);
  const [epis, setEpis] = useState<IEpi[]>([]);
  const [quantidadeASerMovida, setQuantidadeASerMovida] = useState<{
    [key: string]: number;
  }>({});

  const carregarEpis = async () => {
    try {
      setCarregando(true);
      setEpis(await getEpis());
    } catch (erro: any) {
      alert(erro.message);
    } finally {
      setCarregando(false);
    }
  };

  const setQuantidadeItem = (id: string, novaQuantidade: number) => {
    setQuantidadeASerMovida((prev) => ({
      ...prev,
      [id]: novaQuantidade,
    }));
  };

  const handleConfirmarMovimentacoes = async () => {
    const mov = Object.entries(quantidadeASerMovida)
      .filter(([_, quantidade]) => quantidade !== 0)
      .map(([id, quantidade]) => {
        const epi = epis.find((e) => String(e.id) === String(id));
        return {
          id,
          nome: epi?.nome ?? "[EPI não encontrado]",
          quantidade,
        };
      });

    if (mov.length === 0) {
      alert("Nenhuma movimentação selecionada.");
      return;
    }

    const movimentacoes: IMovimentacaoEpi[] = Object.entries(
      quantidadeASerMovida
    )
      .filter(([_, quantidade]) => quantidade !== 0)
      .map(([id, quantidade]) => ({
        id: id,
        quantidade,
      }));

    try {
      setCarregando(true);
      await entradaSaidaApi(movimentacoes);
      alert(
        "Movimentações confirmadas:\n" +
          mov.map((m) => `${m.nome}: ${m.quantidade}`).join("\n")
      );
      setQuantidadeASerMovida({}); // limpa estado
      await carregarEpis(); // atualiza a lista com dados atualizados
    } catch (erro: any) {
      console.log(erro.message);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarEpis();
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
      <BotaoLogout />
      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            theme === "light" ? { color: "black" } : { color: "white" },
          ]}
        >
          Entrada/Saída
        </Text>
        <Animatable.View
          animation="fadeInUp"
          duration={1000}
          style={styles.mainContent}
        >
          <ScrollView
            style={[
              styles.itensScroll,
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
              {epis.map((epi: IEpi, index: number) => (
                <Animatable.View
                  key={epi.id}
                  animation="fadeInUp"
                  duration={1000}
                  delay={index * 150}
                >
                  <View key={epi.id}>
                    {renderItem(
                      theme,
                      epi.id,
                      epi.nome || "",
                      epi.certificadoAprovacao || "",
                      `${epi.tipoUnidade.tipo}`,
                      epi.quantidade || 0,
                      epi.quantidadeParaAviso || 0,
                      quantidadeASerMovida[epi.id] || 0,
                      setQuantidadeItem
                    )}
                  </View>
                </Animatable.View>
              ))}
            </View>
          </ScrollView>
          <TouchableOpacity
            onPress={handleConfirmarMovimentacoes}
            style={{
              backgroundColor: "#0033a0",
              padding: 15,
              borderRadius: 10,
              marginTop: 20,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
              Confirmar movimentações
            </Text>
          </TouchableOpacity>
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
  title: {
    fontSize: 30,
    fontWeight: "700",
    textAlign: "center",
  },
  mainContent: {
    flex: 1,
    width: "100%",
    maxWidth: 800,
    padding: 20,
  },
  itensScroll: {
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
  item: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderRadius: 20,
    width: "100%",
    height: 170,
    gap: 10,
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
    borderWidth: 1,
    borderRadius: 20,
    padding: 10,
    gap: 10,
  },
  dadosEpiText: {
    textAlign: "left",
    fontSize: 14,
    color: "black",
    fontWeight: "500",
    marginBottom: 10,
  },
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
  plusMinusButtonText: {
    fontSize: 30,
    fontWeight: 900,
    color: "white",
  },
});
