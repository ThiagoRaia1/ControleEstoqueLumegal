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
import { Picker } from "@react-native-picker/picker";
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

export default function RegistrarEpi() {
  const { theme } = useThemeContext();
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
      <MenuSuperior />
      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            theme === "light" ? { color: "black" } : { color: "white" },
          ]}
        >
          {usuario.tipoAcesso === "Almoxarifado" ||
          usuario.tipoAcesso === "AlmoxarifadoAdm"
            ? "REGISTRAR EPI"
            : usuario.tipoAcesso === "Compras" ||
              usuario.tipoAcesso === "ComprasAdm"
            ? "REGISTRAR ITEM"
            : " "}
        </Text>
        <View style={{ flex: 1, width: "100%", maxWidth: 800 }}>
          <Animatable.View
            animation="fadeInUp"
            duration={1000}
            style={styles.mainContent}
          >
            <ScrollView
              contentContainerStyle={[
                styles.scrollContent,
                height < 973 && { paddingRight: 20 },
                height < 997 && width < 534 && { paddingRight: 20 },
              ]}
              persistentScrollbar={true}
            >
              <View style={styles.labelInputContainer}>
                <Text
                  style={[
                    styles.label,
                    theme === "light" ? { color: "black" } : { color: "white" },
                  ]}
                >
                  NOME: *
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    { outline: "none" } as any,
                    theme === "light"
                      ? { color: "black", borderColor: "black" }
                      : { color: "white", borderColor: "white" },
                  ]}
                  placeholder="Nome do EPI"
                  placeholderTextColor="#888"
                  value={nome}
                  onChangeText={(text) => setNome(text.slice(0, 30))}
                />
              </View>

              <View style={styles.labelInputContainer}>
                <Text
                  style={[
                    styles.label,
                    theme === "light" ? { color: "black" } : { color: "white" },
                  ]}
                >
                  CERTIFICADO DE APROVAÇÃO:
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    { outline: "none" } as any,
                    theme === "light"
                      ? { color: "black", borderColor: "black" }
                      : { color: "white", borderColor: "white" },
                  ]}
                  placeholder="C.A. do EPI"
                  placeholderTextColor="#888"
                  value={certificadoAprovacao}
                  onChangeText={(text) =>
                    setCertificadoAprovacao(text.slice(0, 20))
                  }
                />
              </View>

              <View style={styles.labelInputContainer}>
                <Text
                  style={[
                    styles.label,
                    theme === "light" ? { color: "black" } : { color: "white" },
                  ]}
                >
                  DESCRIÇÃO:
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    { outline: "none" } as any,
                    theme === "light"
                      ? { color: "black", borderColor: "black" }
                      : { color: "white", borderColor: "white" },
                  ]}
                  placeholder="Descrição do EPI"
                  placeholderTextColor="#888"
                  value={descricao}
                  onChangeText={(text) => setDescricao(text)}
                />
              </View>

              <View style={styles.labelInputContainer}>
                <Text
                  style={[
                    styles.label,
                    { color: theme === "light" ? "black" : "white" },
                  ]}
                >
                  TIPO DE UNIDADE: *
                </Text>

                <View
                  style={[
                    styles.pickerContainer,
                    {
                      backgroundColor: theme === "light" ? "#fff" : "#2a2a2a", // fundo claro ou escuro
                      borderColor: theme === "light" ? "black" : "white",
                    },
                  ]}
                >
                  <Picker
                    selectedValue={tipoUnidade}
                    onValueChange={(tipo) => setTipoUnidade(tipo)}
                    style={[
                      styles.input,
                      { outline: "none" } as any,
                      {
                        color:
                          tipoUnidade === ""
                            ? "#888"
                            : theme === "light"
                            ? "black"
                            : "white",
                      },
                      {
                        backgroundColor:
                          theme === "light" ? "#F0F3FA" : "#1C1C1C", // fundo do picker
                        borderWidth: 0,
                      },
                    ]}
                    mode="dropdown"
                    dropdownIconColor={theme === "light" ? "black" : "white"} // cor do ícone (Web/Android)
                  >
                    <Picker.Item
                      label="Tipo de unidade"
                      value=""
                      color={theme === "light" ? "black" : "#888"} // texto do placeholder
                    />
                    {tiposUnidadeDisponiveis.map((tipo) => (
                      <Picker.Item
                        key={tipo.value}
                        label={tipo.label}
                        value={tipo.value}
                        color={theme === "light" ? "black" : "white"}
                      />
                    ))}
                  </Picker>
                </View>
              </View>

              <View style={styles.labelInputContainer}>
                <Text
                  style={[
                    styles.label,
                    theme === "light" ? { color: "black" } : { color: "white" },
                  ]}
                >
                  FORNECEDORES:
                </Text>

                {fornecedores.map((forn, index) => {
                  // Filtra os fornecedores já selecionados, exceto o atual
                  const usados = fornecedores.filter((_, i) => i !== index);
                  const opcoesFiltradas = fornecedoresDisponiveis.filter(
                    (f) => !usados.includes(f.value)
                  );

                  return (
                    <View
                      key={index}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                        marginBottom: 10,
                      }}
                    >
                      <View
                        style={[
                          styles.pickerContainer,
                          {
                            flex: 1,
                            backgroundColor:
                              theme === "light" ? "#fff" : "#2a2a2a",
                            borderColor: theme === "light" ? "black" : "white",
                          },
                        ]}
                      >
                        <Picker
                          selectedValue={fornecedores[index]}
                          onValueChange={(valor) => setFornecedor(index, valor)}
                          style={[
                            styles.input,
                            { outline: "none" } as any,
                            {
                              flex: 1,
                              color:
                                fornecedores[index] === ""
                                  ? "#888"
                                  : theme === "light"
                                  ? "black"
                                  : "white",
                              backgroundColor:
                                theme === "light" ? "#F0F3FA" : "#1C1C1C",
                              borderWidth: 0,
                            },
                          ]}
                          mode="dropdown"
                          dropdownIconColor={
                            theme === "light" ? "black" : "white"
                          }
                        >
                          <Picker.Item
                            label="Selecione o fornecedor"
                            value=""
                            color={"#888"}
                          />
                          {opcoesFiltradas.map((fornecedor) => (
                            <Picker.Item
                              key={fornecedor.value}
                              label={fornecedor.label}
                              value={fornecedor.value}
                              color={theme === "light" ? "black" : "white"}
                            />
                          ))}
                        </Picker>
                      </View>

                      {index > 0 && (
                        <TouchableOpacity
                          onPress={() =>
                            setFornecedores((prev) =>
                              prev.filter((_, i) => i !== index)
                            )
                          }
                          style={{
                            backgroundColor: "#d9534f",
                            borderRadius: 10,
                            paddingVertical: 4,
                            paddingHorizontal: 8,
                          }}
                        >
                          <Text style={{ color: "white", fontWeight: "bold" }}>
                            X
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  );
                })}

                {fornecedores.length < 3 &&
                  fornecedores[fornecedores.length - 1].trim() !== "" && (
                    <TouchableOpacity
                      onPress={() => setFornecedores((prev) => [...prev, ""])}
                      style={[styles.button, { marginTop: 0 }]}
                    >
                      <Text style={styles.buttonText}>
                        Adicionar fornecedor
                      </Text>
                    </TouchableOpacity>
                  )}
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  gap: 20,
                }}
              >
                <View style={[styles.labelInputContainer, { flex: 1 }]}>
                  <Text
                    style={[
                      styles.label,
                      theme === "light"
                        ? { color: "black" }
                        : { color: "white" },
                    ]}
                  >
                    QUANTIDADE: *
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      { outline: "none" } as any,
                      theme === "light"
                        ? { color: "black", borderColor: "black" }
                        : { color: "white", borderColor: "white" },
                    ]}
                    placeholder="Quantidade inicial do EPI"
                    placeholderTextColor="#888"
                    value={quantidade}
                    onChangeText={(text) => {
                      const numeric = text.replace(/[^0-9]/g, "");
                      const valor = parseInt(numeric || "0", 10);
                      setQuantidade(valor > 999 ? "999" : numeric);
                    }}
                  />
                </View>
                <View style={[styles.labelInputContainer, { flex: 1 }]}>
                  <Text
                    style={[
                      styles.label,
                      theme === "light"
                        ? { color: "black" }
                        : { color: "white" },
                    ]}
                  >
                    QUANTIDADE PARA AVISO: *
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      { outline: "none" } as any,
                      theme === "light"
                        ? { color: "black", borderColor: "black" }
                        : { color: "white", borderColor: "white" },
                    ]}
                    placeholder="Quantidade para o item ser exibido no aviso"
                    placeholderTextColor="#888"
                    value={quantidadeParaAviso}
                    onChangeText={(text) => {
                      const numeric = text.replace(/[^0-9]/g, "");
                      const valor = parseInt(numeric || "0", 10);
                      setQuantidadeParaAviso(valor > 999 ? "999" : numeric);
                    }}
                  />
                </View>
              </View>
            </ScrollView>
          </Animatable.View>
          <Animatable.View
            animation="fadeInUp"
            duration={1000}
            style={{ width: "100%" }}
          >
            <TouchableOpacity style={styles.button} onPress={registrarEpi}>
              <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>
          </Animatable.View>
        </View>
      </View>
      <MenuInferior />
      {carregando && <Carregando />}
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
  },
  content: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    paddingTop: 0,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
  },
  mainContent: {
    flex: 1,
    width: "100%",
    maxWidth: 800,
  },
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
  pickerContainer: {
    width: "100%",
    height: 50,
    backgroundColor: "#aaa",
    borderRadius: 10,
    borderWidth: 1,
  },
  button: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#0033A0",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    paddingHorizontal: 30,
  },
});
