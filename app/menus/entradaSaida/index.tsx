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
import MenuSuperior from "../../components/MenuSuperior";
import MenuInferior from "../../components/MenuInferior";
import { useEffect, useState } from "react";
import Carregando from "../../components/Carregando";
import AntDesign from "@expo/vector-icons/AntDesign";
import { entradaSaidaApi } from "../../../services/entradaSaidaApi";
import { IEpi } from "../../../interfaces/epi";
import { getEpis } from "../../../services/epiApi";
import { IMovimentacaoEpi } from "../../../interfaces/entradaSaida";
import { getGlobalStyles } from "../../../globalStyles";
import SearchBar from "../../components/SearchBar";

function RenderItem({
  globalStyles,
  epi,
  setQuantidadeItem,
  quantidadeASerMovida,
}: {
  globalStyles: any;
  epi: IEpi;
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
          <Text style={globalStyles.dadosEpiText}>Nome: {epi.nome || " "}</Text>
          <Text style={globalStyles.dadosEpiText}>
            C.A.: {epi.certificadoAprovacao}
          </Text>
          <Text style={globalStyles.dadosEpiText}>
            Unidade/Par: {epi.tipoUnidade.tipo}
          </Text>
          <Text style={globalStyles.dadosEpiText}>
            Quantidade: {epi.quantidade}
          </Text>
          <Text style={[globalStyles.dadosEpiText, { marginBottom: 0 }]}>
            Quantidade para aviso: {epi.quantidadeParaAviso}
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
            onPress={() => setQuantidadeItem(epi.id, quantidadeASerMovida + 1)}
          >
            <AntDesign name="pluscircleo" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.plusMinusButton, { backgroundColor: "#b30f02" }]}
            onPress={() => setQuantidadeItem(epi.id, quantidadeASerMovida - 1)}
          >
            <AntDesign name="minuscircleo" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* texto "Quantidade a ser movida:" + input*/}
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
              globalStyles.dadosEpiText,
              { textAlign: "center", marginBottom: 0 },
            ]}
          >
            Quantidade a ser movida:
          </Text>
          <TextInput
            style={styles.quantidadeInput}
            keyboardType="numeric"
            value={quantidadeASerMovida.toString()}
            onChangeText={(text: string) => {
              // Permite apenas "-" no início e números
              const numericValue = text.replace(/(?!^-)-|[^0-9-]/g, "");

              // Trata campo vazio ou apenas "-"
              if (numericValue === "" || numericValue === "-") {
                setQuantidadeItem(epi.id, numericValue === "-" ? -0 : 0);
                return;
              }

              let valor = parseInt(numericValue, 10);

              // Se for negativo e o valor absoluto for maior que a quantidade, limita
              if (valor < 0 && Math.abs(valor) > (epi.quantidade ?? 0)) {
                valor = -(epi.quantidade ?? 0);
              }

              setQuantidadeItem(epi.id, valor);
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
          mov
            .sort((a, b) =>
              a.nome.localeCompare(b.nome, "pt", { sensitivity: "base" })
            )
            .map((m) => `${m.nome}: ${m.quantidade}`)
            .join("\n")
      );
      setQuantidadeASerMovida({}); // limpa estado
      await carregarEpis(); // atualiza a lista com dados atualizados
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
              .filter((epi) => {
                const termo = normalizar(pesquisa);
                const nome = normalizar(epi.nome || "");
                const ca = normalizar(epi.certificadoAprovacao || "");
                return nome.startsWith(termo) || ca.startsWith(termo);
              })
              .map((epi: IEpi, index: number) => (
                <Animatable.View
                  key={epi.id}
                  animation="fadeInUp"
                  duration={1000}
                  delay={index * 150}
                >
                  <View key={epi.id}>
                    <RenderItem
                      globalStyles={globalStyles}
                      epi={epi}
                      setQuantidadeItem={setQuantidadeItem}
                      quantidadeASerMovida={quantidadeASerMovida[epi.id] || 0}
                    />
                  </View>
                </Animatable.View>
              ))}
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
