import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
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

export default function RegistrarEpi() {
  const { tipoAcesso } = useTipoAcessoContext();
  const { theme } = useThemeContext();
  const globalStyles = getGlobalStyles(theme);
  const [modalVisible, setModalVisible] = useState(false);

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
        <View
          style={{
            flex: 1,
            width: "100%",
            justifyContent: "space-evenly",
            gap: 20,
          }}
        >
          <View style={styles.buttonsRow}>
            <TouchableOpacity
              style={globalStyles.optionButton}
              onPress={() => {
                router.push(
                  nomePaginas.registrarItem.compras.registrarComprasSuprimento
                );
              }}
            >
              <Text style={globalStyles.optionButtonText}>
                REGISTRAR SUPRIMENTO
              </Text>
              <Entypo
                name="shop"
                size={28}
                color={theme === "light" ? "black" : "white"}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.editarListarButton}
              onPress={() => {
                router.push(
                  nomePaginas.registrarItem.compras.registrarComprasSuprimento
                );
              }}
            >
              <Text style={[globalStyles.optionButtonText, { color: "white" }]}>
                EDITAR
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.editarListarButton}
              onPress={async () => {
                await setLista("suprimento");
                setModalVisible(true);
              }}
            >
              <Text style={[globalStyles.optionButtonText, { color: "white" }]}>
                LISTAR
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonsRow}>
            <TouchableOpacity
              style={globalStyles.optionButton}
              onPress={() => {
                router.push(
                  nomePaginas.registrarItem.compras.registrarComprasEpi
                );
              }}
            >
              <Text style={globalStyles.optionButtonText}>REGISTRAR EPI</Text>
              <MaterialCommunityIcons
                name="warehouse"
                size={28}
                color={theme === "light" ? "black" : "white"}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.editarListarButton}
              onPress={() => {
                router.push(
                  nomePaginas.registrarItem.compras.registrarComprasSuprimento
                );
              }}
            >
              <Text style={[globalStyles.optionButtonText, { color: "white" }]}>
                EDITAR
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.editarListarButton}
              onPress={async () => {
                await setLista("epi");
                setModalVisible(true);
              }}
            >
              <Text style={[globalStyles.optionButtonText, { color: "white" }]}>
                LISTAR
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonsRow}>
            <TouchableOpacity
              style={globalStyles.optionButton}
              onPress={() => {
                router.push(
                  nomePaginas.registrarItem.compras.registrarComprastipoUnidade
                );
              }}
            >
              <Text style={globalStyles.optionButtonText}>
                REGISTRAR TIPO DE UNIDADE
              </Text>
              <AntDesign
                name="tago"
                size={28}
                color={theme === "light" ? "black" : "white"}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.editarListarButton}
              onPress={() => {
                router.push(
                  nomePaginas.registrarItem.compras.registrarComprasSuprimento
                );
              }}
            >
              <Text style={[globalStyles.optionButtonText, { color: "white" }]}>
                EDITAR
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.editarListarButton}
              onPress={async () => {
                await setLista("tipoUnidade");
                setModalVisible(true);
              }}
            >
              <Text style={[globalStyles.optionButtonText, { color: "white" }]}>
                LISTAR
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonsRow}>
            <TouchableOpacity
              style={globalStyles.optionButton}
              onPress={() => {
                router.push(
                  nomePaginas.registrarItem.compras.registrarComprasFornecedor
                );
              }}
            >
              <Text style={globalStyles.optionButtonText}>
                REGISTRAR FORNECEDOR
              </Text>
              <AntDesign
                name="contacts"
                size={28}
                color={theme === "light" ? "black" : "white"}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.editarListarButton}
              onPress={() => {
                router.push(
                  nomePaginas.registrarItem.compras.registrarComprasSuprimento
                );
              }}
            >
              <Text style={[globalStyles.optionButtonText, { color: "white" }]}>
                EDITAR
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.editarListarButton}
              onPress={async () => {
                await setLista("fornecedor");
                setModalVisible(true);
              }}
            >
              <Text style={[globalStyles.optionButtonText, { color: "white" }]}>
                LISTAR
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonsRow}>
            <TouchableOpacity
              style={globalStyles.optionButton}
              onPress={() => {
                router.push(
                  nomePaginas.registrarItem.compras
                    .registrarComprasCategoriaFornecedor
                );
              }}
            >
              <Text style={globalStyles.optionButtonText}>
                REGISTRAR CATEGORIA FORNECEDOR
              </Text>
              <AntDesign
                name="skin"
                size={28}
                color={theme === "light" ? "black" : "white"}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.editarListarButton}
              onPress={() => {
                router.push(
                  nomePaginas.registrarItem.compras.registrarComprasSuprimento
                );
              }}
            >
              <Text style={[globalStyles.optionButtonText, { color: "white" }]}>
                EDITAR
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.editarListarButton}
              onPress={async () => {
                await setLista("categoriaFornecedor");
                setModalVisible(true);
              }}
            >
              <Text style={[globalStyles.optionButtonText, { color: "white" }]}>
                LISTAR
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonsRow}>
            <TouchableOpacity
              style={globalStyles.optionButton}
              onPress={() => {
                router.push(
                  nomePaginas.registrarItem.compras.registrarComprasEndereco
                );
              }}
            >
              <Text style={globalStyles.optionButtonText}>
                REGISTRAR ENDERECO
              </Text>
              <Entypo
                name="address"
                size={28}
                color={theme === "light" ? "black" : "white"}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.editarListarButton}
              onPress={() => {
                router.push(
                  nomePaginas.registrarItem.compras.registrarComprasSuprimento
                );
              }}
            >
              <Text style={[globalStyles.optionButtonText, { color: "white" }]}>
                EDITAR
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.editarListarButton}
              onPress={async () => {
                await setLista("endereco");
                setModalVisible(true);
              }}
            >
              <Text style={[globalStyles.optionButtonText, { color: "white" }]}>
                LISTAR
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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
});
