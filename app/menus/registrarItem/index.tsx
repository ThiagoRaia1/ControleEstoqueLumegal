import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { useThemeContext } from "../../../context/ThemeContext";
import MenuSuperior from "../../components/MenuSuperior";
import MenuInferior from "../../components/MenuInferior";
import Carregando from "../../components/Carregando";
import { useEffect, useState } from "react";
import Entypo from "@expo/vector-icons/Entypo";
import { ICriarEpi } from "../../../interfaces/epi";
import { registrarEpiApi } from "../../../services/epiApi";
import {
  getTiposUnidade,
  getTipoUnidade,
} from "../../../services/tipoUnidadeApi";
import { ITipoUnidade } from "../../../interfaces/tipoUnidade";
import {
  getFornecedores,
  getFornecedorPorNome,
} from "../../../services/fornecedor";
import { IFornecedor } from "../../../interfaces/fornecedor";
import { useAuth } from "../../../context/auth";
import MaskInput, { Masks } from "react-native-mask-input";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { getGlobalStyles } from "../../../globalStyles";
import { AntDesign } from "@expo/vector-icons";

export default function RegistrarEpi() {
  const { theme } = useThemeContext();
  const globalStyles = getGlobalStyles(theme);
  const { usuario } = useAuth();
  const { width, height } = useWindowDimensions();
  const [carregando, setCarregando] = useState(false);

  const [nome, setNome] = useState("");
  const [certificadoAprovacao, setCertificadoAprovacao] = useState("");
  const [descricao, setDescricao] = useState("");
  const [tipoUnidade, setTipoUnidade] = useState("");
  const [fornecedores, setFornecedores] = useState<string[]>([""]);
  const [quantidade, setQuantidade] = useState("");
  const [quantidadeParaAviso, setQuantidadeParaAviso] = useState("");
  const [preco, setPreco] = useState("");

  // Estado com lista completa de fornecedores vindos do backend
  const [fornecedoresDisponiveis, setFornecedoresDisponiveis] = useState<
    { label: string; value: string }[]
  >([]);

  // Estado com lista completa de tipos de unidade vindos do backend
  const [tiposUnidadeDisponiveis, setTiposUnidadeDisponiveis] = useState<
    { label: string; value: string }[]
  >([]);

  useEffect(() => {
    async function carregarDados() {
      const listaTiposUnidadeDisponiveis = await getTiposUnidade();
      const itensTiposUnidade = listaTiposUnidadeDisponiveis.map((f: any) => ({
        label: f.tipo,
        value: f.tipo, // use f.id se quiser o ID como value
      }));
      setTiposUnidadeDisponiveis(itensTiposUnidade);

      const listaFornecedores = await getFornecedores();
      const itensFornecedores = listaFornecedores.map((f: any) => ({
        label: f.nome,
        value: f.nome, // use f.id se quiser o ID como value
      }));
      setFornecedoresDisponiveis(itensFornecedores);
    }
    carregarDados();
  }, []);

  // Função para setar fornecedor selecionado no índice
  const setFornecedor = (index: number, valor: string) => {
    setFornecedores((prev) => {
      const novos = [...prev];
      novos[index] = valor;
      return novos;
    });
  };

  const registrarEpi = async () => {
    // Validação dos fornecedores: só passa os não vazios
    const fornecedoresValidos = fornecedores.filter((f) => f.trim() !== "");

    if (
      !nome ||
      !nome.trim() ||
      !tipoUnidade ||
      !tipoUnidade.trim() ||
      !quantidade ||
      !quantidade.trim() ||
      !quantidadeParaAviso ||
      !quantidadeParaAviso.trim()
    ) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      setCarregando(true);
      if (!parseInt(quantidade, 10) || parseInt(quantidade, 10) < 0) {
        throw new Error("Quantidade deve ser um número válido.");
      }
      if (
        !parseInt(quantidadeParaAviso, 10) ||
        parseInt(quantidadeParaAviso, 10) < 0
      ) {
        throw new Error("Quantidade para Aviso deve ser um número válido.");
      }

      const tipoUnidadeId: ITipoUnidade = await getTipoUnidade(tipoUnidade);

      let fornecedoresIds: number[] = [];
      for (let i: number = 0; i < fornecedoresValidos.length; i++) {
        const fornecedorObj: IFornecedor = await getFornecedorPorNome(
          fornecedoresValidos[i]
        );
        fornecedoresIds.push(fornecedorObj.id);
      }

      // console.log(fornecedoresIds);
      const epi: ICriarEpi = {
        nome: nome.trim(),
        descricao: descricao.trim(),
        certificadoAprovacao: certificadoAprovacao.trim(),
        quantidade: parseInt(quantidade.trim(), 10),
        quantidadeParaAviso: parseInt(quantidadeParaAviso.trim(), 10),
        tipoUnidadeId: tipoUnidadeId.id,
        fornecedores: fornecedoresIds,
      };

      const retornoDaApi = await registrarEpiApi(epi);

      alert("EPI registrado com sucesso!");
      // Limpa os campos após o registro
      setNome("");
      setCertificadoAprovacao("");
      setDescricao("");
      setTipoUnidade("");
      setFornecedores([""]);
      setQuantidade("");
      setQuantidadeParaAviso("");
    } catch (erro: any) {
      alert(erro.message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <View style={globalStyles.background}>
      <MenuSuperior />
      <Text style={globalStyles.title}>
        {usuario.tipoAcesso === "Almoxarifado" ||
        usuario.tipoAcesso === "AlmoxarifadoAdm"
          ? "REGISTRAR EPI"
          : usuario.tipoAcesso === "Compras" ||
            usuario.tipoAcesso === "ComprasAdm"
          ? "REGISTRAR ITEM"
          : " "}
      </Text>
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
          }}
        >
          <TouchableOpacity style={globalStyles.optionButton} onPress={() => {
            console.log("suprimento")
          }}>
            <Text style={globalStyles.optionButtonText}>
              REGISTRAR SUPRIMENTO
            </Text>
            <Entypo
              name="shop"
              size={28}
              color={theme === "light" ? "black" : "white"}
            />
          </TouchableOpacity>

          <TouchableOpacity style={globalStyles.optionButton} onPress={() => {
            console.log("epi")
          }}>
            <Text style={globalStyles.optionButtonText}>REGISTRAR EPI</Text>
            <MaterialCommunityIcons
              name="warehouse"
              size={28}
              color={theme === "light" ? "black" : "white"}
            />
          </TouchableOpacity>

          <TouchableOpacity style={globalStyles.optionButton} onPress={() => {
            console.log("fornecedor")
          }}>
            <Text style={globalStyles.optionButtonText}>
              REGISTRAR FORNECEDOR
            </Text>
            <AntDesign
              name="contacts"
              size={28}
              color={theme === "light" ? "black" : "white"}
            />
          </TouchableOpacity>

          <TouchableOpacity style={globalStyles.optionButton} onPress={() => {
            console.log("tipoUnidade")
          }}>
            <Text style={globalStyles.optionButtonText}>
              REGISTRAR TIPO DE UNIDADE
            </Text>
            <AntDesign
              name="tago"
              size={28}
              color={theme === "light" ? "black" : "white"}
            />
          </TouchableOpacity>

          <TouchableOpacity style={globalStyles.optionButton} onPress={() => {
            console.log("categoriaFornecedor")
          }}>
            <Text style={globalStyles.optionButtonText}>
              REGISTRAR CATEGORIA FORNECEDOR
            </Text>
            <AntDesign
              name="skin"
              size={28}
              color={theme === "light" ? "black" : "white"}
            />
          </TouchableOpacity>

          <TouchableOpacity style={globalStyles.optionButton} onPress={() => {
            console.log("endereco")
          }}>
            <Text style={globalStyles.optionButtonText}>
              REGISTRAR ENDERECO
            </Text>
            <Entypo
              name="address"
              size={28}
              color={theme === "light" ? "black" : "white"}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={globalStyles.button} onPress={registrarEpi}>
          <Text style={globalStyles.buttonText}>Salvar</Text>
        </TouchableOpacity>
      </Animatable.View>

      <MenuInferior />
      {carregando && <Carregando />}
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flex: 1,
    gap: 20,
    justifyContent: "center",
  },
  labelInputContainer: {
    gap: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
  },
  input: {
    height: 50,
    width: "100%",
    fontSize: 16,
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  optionButtonsRow: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 20,
  },
});
