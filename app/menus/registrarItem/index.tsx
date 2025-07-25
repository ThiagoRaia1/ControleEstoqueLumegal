import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { useThemeContext } from "../../../context/ThemeContext";
import MenuSuperior from "../../components/MenuSuperior";
import MenuInferior from "../../components/MenuInferior";
import { useEffect, useState } from "react";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { getGlobalStyles } from "../../../globalStyles";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import { nomePaginas } from "../../../utils/nomePaginas";
import {
  acessoAlmoxarifado,
  acessoAlmoxarifadoAdm,
  useTipoAcessoContext,
} from "../../../context/tipoAcessoContext";
import ModalConfirmacao from "../../components/ModalConfirmacao";
import { ISuprimento } from "../../../interfaces/suprimento";
import { getSuprimentos } from "../../../services/suprimentoApi";
import { getEpis } from "../../../services/epiApi";
import { IEpi } from "../../../interfaces/epi";
import { IFornecedor } from "../../../interfaces/fornecedor";
import { ITipoUnidade } from "../../../interfaces/tipoUnidade";
import { ICategoriaFornecedor } from "../../../interfaces/categoriaFornecedor";
import { IEndereco } from "../../../interfaces/endereco";
import { getEnderecos } from "../../../services/enderecoApi";
import { getCategoriasFornecedor } from "../../../services/categoriaFornecedorApi";
import { getFornecedores } from "../../../services/fornecedorApi";
import { getTiposUnidade } from "../../../services/tipoUnidadeApi";

export default function RegistrarItem() {
  const { tipoAcesso } = useTipoAcessoContext();
  const { theme } = useThemeContext();
  const globalStyles = getGlobalStyles(theme);
  const [modalVisible, setModalVisible] = useState(false);

  const opcoes = [
    {
      titulo: "Suprimento",
      registrar: nomePaginas.registrarItem.compras.registrarComprasSuprimento,
      listar: "suprimento",
      icone: (
        <Entypo
          name="shop"
          size={28}
          color={theme === "light" ? "black" : "white"}
        />
      ),
    },
    {
      titulo: "EPI",
      registrar: nomePaginas.registrarItem.compras.registrarComprasEpi,
      listar: "epi",
      icone: (
        <MaterialCommunityIcons
          name="warehouse"
          size={28}
          color={theme === "light" ? "black" : "white"}
        />
      ),
    },
    {
      titulo: "Tipo de Unidade",
      registrar: nomePaginas.registrarItem.compras.registrarComprastipoUnidade,
      listar: "tipoUnidade",
      icone: (
        <AntDesign
          name="tago"
          size={28}
          color={theme === "light" ? "black" : "white"}
        />
      ),
    },
    {
      titulo: "Fornecedor",
      registrar: nomePaginas.registrarItem.compras.registrarComprasFornecedor,
      listar: "fornecedor",
      icone: (
        <AntDesign
          name="contacts"
          size={28}
          color={theme === "light" ? "black" : "white"}
        />
      ),
    },
    {
      titulo: "Categoria Fornecedor",
      registrar:
        nomePaginas.registrarItem.compras.registrarComprasCategoriaFornecedor,
      listar: "categoriaFornecedor",
      icone: (
        <AntDesign
          name="skin"
          size={28}
          color={theme === "light" ? "black" : "white"}
        />
      ),
    },
    {
      titulo: "Endereço",
      registrar: nomePaginas.registrarItem.compras.registrarComprasEndereco,
      listar: "endereco",
      icone: (
        <Entypo
          name="address"
          size={28}
          color={theme === "light" ? "black" : "white"}
        />
      ),
    },
  ] as const;

  useEffect(() => {
    if ([acessoAlmoxarifado, acessoAlmoxarifadoAdm].includes(tipoAcesso)) {
      router.replace(
        nomePaginas.registrarItem.almoxarifado.registrarAlmoxarifadoEpi
      );
    }
  }, [tipoAcesso]);

  const [tipoDaLista, setTipoDaLista] = useState<
    | "suprimento"
    | "epi"
    | "tipoUnidade"
    | "fornecedor"
    | "categoriaFornecedor"
    | "endereco"
    | undefined
  >(undefined);

  const [itens, setItens] = useState<
    | ISuprimento[]
    | IEpi[]
    | ITipoUnidade[]
    | IFornecedor[]
    | ICategoriaFornecedor[]
    | IEndereco[]
    | null
  >([]);

  const setLista = async (
    tipoDoItem:
      | "suprimento"
      | "epi"
      | "tipoUnidade"
      | "fornecedor"
      | "categoriaFornecedor"
      | "endereco"
      | undefined
  ) => {
    setTipoDaLista(tipoDoItem);
    switch (tipoDoItem) {
      case "suprimento":
        setItens(await getSuprimentos());
        break;

      case "epi":
        setItens(await getEpis());
        break;

      case "tipoUnidade":
        setItens(await getTiposUnidade());
        break;

      case "fornecedor":
        setItens(await getFornecedores());
        break;

      case "categoriaFornecedor":
        setItens(await getCategoriasFornecedor());
        break;

      case "endereco":
        setItens(await getEnderecos());
        break;

      default:
        "Tipo inválido";
    }
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={globalStyles.background}>
      <MenuSuperior />
      <Text style={globalStyles.title}>REGISTRAR ITEM</Text>
      <Animatable.View
        animation="fadeInUp"
        duration={1000}
        style={globalStyles.mainContent}
      >
        <ScrollView
          style={{ width: "100%" }}
          contentContainerStyle={{ paddingHorizontal: 20 }}
        >
          {opcoes.map((opcao) => (
            <View
              style={[
                styles.card,
                {
                  backgroundColor: theme === "light" ? "#fff" : "#1e1e1e",
                },
              ]}
              key={opcao.titulo}
            >
              <View style={styles.cardHeader}>
                {opcao.icone}
                <Text
                  style={[
                    styles.cardTitle,
                    {
                      color: theme === "light" ? "#000" : "#fff",
                    },
                  ]}
                >
                  {opcao.titulo}
                </Text>
              </View>
              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  style={styles.cardButton}
                  onPress={() => router.push(opcao.registrar)}
                >
                  <Text style={styles.cardButtonText}>REGISTRAR</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cardButton}
                  onPress={() => router.push(opcao.registrar)}
                >
                  <Text style={styles.cardButtonText}>EDITAR</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cardButton}
                  onPress={async () => {
                    await setLista(opcao.listar);
                    setModalVisible(true);
                  }}
                >
                  <Text style={styles.cardButtonText}>LISTAR</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </Animatable.View>

      <MenuInferior />
      {modalVisible && (
        <ModalConfirmacao
          visivel={modalVisible}
          onCancelar={closeModal}
          textoCancelar="Fechar"
          itens={itens ?? []}
          tipoItens={tipoDaLista}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  buttonsRow: {
    flexDirection: "row",
    gap: 20,
    justifyContent: "center",
  },
  editarListarButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0033A0",
    boxShadow: "0px 5px 5px #000c27ff",
    borderRadius: 20,
    paddingHorizontal: 20,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  cardButton: {
    flex: 1,
    backgroundColor: "#0033A0",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  cardButtonText: {
    color: "white",
    fontWeight: "600",
  },
});
