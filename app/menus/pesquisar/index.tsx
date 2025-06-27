import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { useThemeContext } from "../../../context/ThemeContext";
import BotaoLogout from "../../components/BotaoLogout";
import MenuInferior from "../../components/MenuInferior";
import { IEpi } from "../../../services/registrarEpiApi";
import Carregando from "../../components/Carregando";
import { useEffect, useState } from "react";
import { getEpis } from "../../../services/getEpis";
import ModalConfirmacao from "../../components/ModalConfirmacao";
import { excluirEpiApi } from "../../../services/excluirEpiApi";

export default function Pesquisar() {
  const { theme } = useThemeContext();
  const [carregando, setCarregando] = useState(false);
  const [epis, setEpis] = useState<IEpi[]>([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [epiSelecionado, setEpiSelecionado] = useState<IEpi | null>(null);

  const excluirItem = async () => {
    if (!epiSelecionado) return;
    try {
      setCarregando(true);
      await excluirEpiApi(epiSelecionado._id);
      alert(`EPI "${epiSelecionado.nome}" excluído com sucesso!`);
      setModalVisible(false);
      setEpiSelecionado(null);
      await carregarEpis(); // Atualiza a lista
    } catch (erro: any) {
      alert(erro.message);
    }
  };

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

  useEffect(() => {
    carregarEpis();
  }, []);

  function ItemEpi({ epi }: { epi: IEpi }) {
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
            <Text style={styles.dadosEpiText}>Nome: {epi.nome}</Text>
            <Text style={styles.dadosEpiText}>
              C.A.: {epi.certificadoAprovacao}
            </Text>
            <Text style={styles.dadosEpiText}>
              Unidade/Par: {epi.tipoUnidade}
            </Text>
            <Text style={styles.dadosEpiText}>
              Quantidade: {epi.quantidade}
            </Text>
            <Text style={styles.dadosEpiText}>
              Quantidade para aviso: {epi.quantidadeParaAviso}
            </Text>
            <Text style={[styles.dadosEpiText, { marginBottom: -10 }]}>
              Fornecedores: {epi.fornecedor}
            </Text>
          </ScrollView>
        </View>

        <View style={styles.rightSide}>
          <Text style={[styles.dadosEpiText, { marginBottom: -5 }]}>
            Descrição:
          </Text>
          <ScrollView
            contentContainerStyle={{ paddingRight: 10, borderRadius: 20 }}
          >
            <Text
              style={[
                styles.dadosEpiText,
                { flex: 1, marginBottom: 0, textAlign: "justify" },
              ]}
            >
              {epi.descricao}
            </Text>
          </ScrollView>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <TouchableOpacity
              style={[
                styles.button,
                theme === "light"
                  ? { borderColor: "#ccc" }
                  : { borderColor: "black" },
              ]}
              onPress={() => {
                alert("Funcionalidade de edição em desenvolvimento.");
              }}
            >
              <Text style={styles.buttonText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: "#b30f02" },
                theme === "light"
                  ? { borderColor: "#ccc" }
                  : { borderColor: "black" },
              ]}
              onPress={() => {
                setEpiSelecionado(epi);
                setModalVisible(true);
              }}
            >
              <Text style={styles.buttonText}>Excluir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

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
          Pesquisar
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
                  key={epi._id}
                  animation="fadeInUp"
                  duration={1000}
                  delay={index * 150}
                >
                  <ItemEpi epi={epi} />
                </Animatable.View>
              ))}
            </View>
          </ScrollView>
        </Animatable.View>
      </View>
      <MenuInferior />
      {carregando && <Carregando />}
      <ModalConfirmacao
        visivel={modalVisible}
        onConfirmar={excluirItem}
        onCancelar={() => setModalVisible(false)}
        mensagem={`Tem certeza que deseja excluir o EPI "${
          epiSelecionado?.nome || " "
        }"?`}
      />
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
    height: 200,
    gap: 10,
  },
  leftSide: {
    flex: 1,
    justifyContent: "space-between",
    height: "100%",
    paddingVertical: 5,
    gap: 10,
  },
  rightSide: {
    flex: 1,
    justifyContent: "space-evenly",
    height: "100%",
    paddingVertical: 5,
    gap: 10,
  },
  dadosEpiText: {
    textAlign: "left",
    fontSize: 14,
    color: "black",
    fontWeight: "500",
    marginBottom: 10,
  },
  button: {
    flex: 1,
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#0033A0",
  },
  buttonText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: 500,
    color: "white",
  },
});
