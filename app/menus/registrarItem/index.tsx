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
import MenuLateral from "../../components/MenuLateral";
import Carregando from "../../components/Carregando";

export default function RegistrarItem() {
  const { tipoAcesso } = useTipoAcessoContext();
  const { theme } = useThemeContext();
  const globalStyles = getGlobalStyles(theme);
  const [modalVisible, setModalVisible] = useState(false);
  const [isMenuLateralVisivel, setIsMenuLateralVisivel] = useState(false);
  const [carregando, setCarregando] = useState(false);

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
    try {
      setCarregando(true);
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
    } catch (erro: any) {
      alert(erro);
    } finally {
      setCarregando(false);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={globalStyles.background}>
      <MenuSuperior />
      <Animatable.View
        animation="fadeInUp"
        duration={1000}
        style={globalStyles.mainContent}
      >
        <ScrollView
          style={{ width: "100%", marginRight: -20 }}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            paddingRight: 20,
          }}
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
                  onPress={async () => {
                    await setLista(opcao.listar);
                    setModalVisible(true);
                  }}
                >
                  <Text style={styles.cardButtonText}>LISTAR/EDITAR</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </Animatable.View>

      <MenuLateral
        visivel={isMenuLateralVisivel}
        setVisivel={setIsMenuLateralVisivel}
      />
      {modalVisible && (
        <ModalConfirmacao
          visivel={modalVisible}
          onCancelar={closeModal}
          textoCancelar="Fechar"
          itens={itens ?? []}
          tipoItem={tipoDaLista}
        />
      )}
      {carregando && <Carregando />}
    </View>
  );
}

const styles = StyleSheet.create({
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
