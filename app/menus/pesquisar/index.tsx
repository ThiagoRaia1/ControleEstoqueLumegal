import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  useWindowDimensions,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { useThemeContext } from "../../../context/ThemeContext";
import MenuSuperior from "../../components/MenuSuperior";
import MenuInferior from "../../components/MenuInferior";
import Carregando from "../../components/Carregando";
import { useEffect, useState } from "react";
import ModalConfirmacao from "../../components/ModalConfirmacao";
import { ICriarEpi, IEpi } from "../../../interfaces/epi";
import { editarEpiApi, excluirEpiApi, getEpis } from "../../../services/epiApi";
import { Picker } from "@react-native-picker/picker";
import {
  getFornecedores,
  getFornecedorPorNome,
} from "../../../services/fornecedor";
import {
  getTiposUnidade,
  getTipoUnidade,
} from "../../../services/tipoUnidadeApi";
import { IFornecedor } from "../../../interfaces/fornecedor";
import { ITipoUnidade } from "../../../interfaces/tipoUnidade";
import { getGlobalStyles } from "../../../globalStyles";
import SearchBar from "../../components/SearchBar";

export default function Pesquisar() {
  const { theme } = useThemeContext();
  const globalStyles = getGlobalStyles(theme);
  const { width, height } = useWindowDimensions();
  const [carregando, setCarregando] = useState(false);
  const [epis, setEpis] = useState<IEpi[]>([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [epiSelecionado, setEpiSelecionado] = useState<IEpi | null>(null);

  const [pesquisa, setPesquisa] = useState("");

  const [editando, setEditando] = useState(false);
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

  // Funcao para ignorar acentuacao na pesquisa
  const normalizar = (texto: string) =>
    texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  // Funcao para filtrar a lista de epis de acordo com a pesquisa
  const episFiltrados = epis
    .slice() // cria uma cópia para não modificar o estado original
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
    });

  useEffect(() => {
    if (epiSelecionado && editando) {
      setNome(epiSelecionado.nome || "");
      setDescricao(epiSelecionado.descricao || "");
      setCertificadoAprovacao(epiSelecionado.certificadoAprovacao || "");
      setTipoUnidade(epiSelecionado.tipoUnidade?.tipo || "");
      setQuantidade(String(epiSelecionado.quantidade ?? ""));
      setQuantidadeParaAviso(String(epiSelecionado.quantidadeParaAviso ?? ""));
      if (epiSelecionado.fornecedores.length != 0) {
        setFornecedores(epiSelecionado.fornecedores.map((f) => f.nome));
      }
    }
  }, [epiSelecionado, editando]);

  const editar = async () => {
    if (editando) {
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
        if (!descricao) {
          setDescricao(" ");
        }

        const tipoUnidadeId: ITipoUnidade = await getTipoUnidade(tipoUnidade);

        const fornecedoresValidos = fornecedores.filter((f) => f.trim() !== "");
        let fornecedoresIds: number[] = [];
        for (let i: number = 0; i < fornecedoresValidos.length; i++) {
          const fornecedorObj: IFornecedor = await getFornecedorPorNome(
            fornecedoresValidos[i]
          );
          fornecedoresIds.push(fornecedorObj.id);
        }

        const epiEditado: ICriarEpi = {
          nome,
          descricao: descricao?.trim() || "",
          certificadoAprovacao,
          quantidade: parseInt(quantidade, 10),
          quantidadeParaAviso: parseInt(quantidadeParaAviso, 10),
          tipoUnidadeId: tipoUnidadeId.id,
          fornecedores: fornecedoresIds,
        };
        if (epiSelecionado) {
          const editado = await editarEpiApi(epiSelecionado?.nome, epiEditado);
          alert("Epi editado com sucesso!");
          console.log("Editando epi selecionado: ", epiSelecionado?.nome);
          console.log(editado);
          await carregarEpis();
          setEditando(false);
        }
      } catch (erro: any) {
        console.log(erro.message);
      } finally {
        setCarregando(false);
      }
    }
  };

  const excluirItem = async () => {
    if (!epiSelecionado) return;
    try {
      setCarregando(true);
      await excluirEpiApi(epiSelecionado.id);
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
      <View style={globalStyles.item}>
        <View style={globalStyles.leftSide}>
          <ScrollView
            contentContainerStyle={{ paddingRight: 10, borderRadius: 20 }}
          >
            <Text style={globalStyles.dadosEpiText}>Nome: {epi.nome}</Text>
            <Text style={globalStyles.dadosEpiText}>
              C.A.: {epi.certificadoAprovacao}
            </Text>
            <Text style={globalStyles.dadosEpiText}>
              Unidade/Par: {epi.tipoUnidade.tipo}
            </Text>
            <Text style={globalStyles.dadosEpiText}>
              Quantidade: {epi.quantidade}
            </Text>
            <Text style={globalStyles.dadosEpiText}>
              Quantidade para aviso: {epi.quantidadeParaAviso}
            </Text>
            <Text style={[globalStyles.dadosEpiText, { marginBottom: 0 }]}>
              Fornecedores:
            </Text>
            {epi.fornecedores.slice(0, 3).map((fornecedor, index) => (
              <Text
                key={index}
                style={[globalStyles.dadosEpiText, { marginBottom: 0 }]}
              >
                {"    -"} {fornecedor.nome}
              </Text>
            ))}
          </ScrollView>
        </View>

        <View style={globalStyles.rightSide}>
          <Text style={[globalStyles.dadosEpiText, { marginBottom: -5 }]}>
            Descrição:
          </Text>
          <ScrollView
            contentContainerStyle={{ paddingRight: 10, borderRadius: 20 }}
          >
            <Text
              style={[
                globalStyles.dadosEpiText,
                { flex: 1, marginBottom: 0, textAlign: "justify" },
              ]}
            >
              {epi.descricao}
            </Text>
          </ScrollView>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <TouchableOpacity
              style={[globalStyles.button, { height: 40 }]}
              onPress={() => {
                setEpiSelecionado(epi);
                setEditando(true);
              }}
            >
              <Text style={globalStyles.buttonText}>Editar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={globalStyles.background}>
      <MenuSuperior />
      <Text style={globalStyles.title}>
        {!editando ? "PESQUISAR" : "EDITANDO"}
      </Text>
      <Animatable.View
        animation="fadeInUp"
        duration={1000}
        style={globalStyles.mainContent}
      >
        {!editando ? (
          <>
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
                {episFiltrados.map((epi: IEpi, index: number) => (
                  <Animatable.View
                    key={epi.id}
                    animation="fadeInUp"
                    duration={1000}
                    delay={index * 150}
                  >
                    <ItemEpi epi={epi} />
                  </Animatable.View>
                ))}
              </View>
            </ScrollView>
          </>
        ) : (
          <>
            <ScrollView
              style={{ width: "100%" }}
              contentContainerStyle={[
                globalStyles.scrollContentForm,
                height < 973 && { paddingRight: 20 },
                height < 997 && width < 534 && { paddingRight: 20 },
              ]}
              persistentScrollbar={true}
            >
              <View style={globalStyles.labelInputContainer}>
                <Text style={globalStyles.label}>NOME: *</Text>
                <TextInput
                  style={globalStyles.inputEditar}
                  placeholder="Nome do EPI"
                  placeholderTextColor="#888"
                  value={nome}
                  onChangeText={(text) => setNome(text.slice(0, 30))}
                />
              </View>

              <View style={globalStyles.labelInputContainer}>
                <Text style={globalStyles.label}>
                  CERTIFICADO DE APROVAÇÃO:
                </Text>
                <TextInput
                  style={globalStyles.inputEditar}
                  placeholder="C.A. do EPI"
                  placeholderTextColor="#888"
                  value={certificadoAprovacao}
                  onChangeText={(text) =>
                    setCertificadoAprovacao(text.slice(0, 20))
                  }
                />
              </View>

              <View style={globalStyles.labelInputContainer}>
                <Text style={globalStyles.label}>DESCRIÇÃO:</Text>
                <TextInput
                  style={globalStyles.inputEditar}
                  placeholder="Descrição do EPI"
                  placeholderTextColor="#888"
                  value={descricao}
                  onChangeText={(text) => setDescricao(text)}
                />
              </View>

              <View style={globalStyles.labelInputContainer}>
                <Text style={globalStyles.label}>TIPO DE UNIDADE: *</Text>

                <View
                  style={[
                    globalStyles.pickerContainer,
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
                      globalStyles.inputEditar,
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

              <View style={globalStyles.labelInputContainer}>
                <Text style={globalStyles.label}>FORNECEDORES:</Text>

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
                          globalStyles.pickerContainer,
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
                            globalStyles.inputEditar,
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
                            borderRadius: 8,
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
                      style={globalStyles.button}
                    >
                      <Text style={globalStyles.buttonText}>
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
                <View style={[globalStyles.labelInputContainer, { flex: 1 }]}>
                  <Text style={globalStyles.label}>QUANTIDADE:</Text>
                  <TextInput
                    style={[
                      globalStyles.inputEditar,
                      theme === "light"
                        ? {
                            backgroundColor: "#ccc",
                          }
                        : {
                            color: "#888",
                            backgroundColor: "black",
                          },
                    ]}
                    placeholder="Quantidade inicial do EPI"
                    placeholderTextColor="#888"
                    value={quantidade}
                    editable={false}
                    onChangeText={(text) => {
                      const numeric = text.replace(/[^0-9]/g, "");
                      const valor = parseInt(numeric || "0", 10);
                      setQuantidade(valor > 999 ? "999" : numeric);
                    }}
                  />
                </View>
                <View style={[globalStyles.labelInputContainer, { flex: 1 }]}>
                  <Text style={globalStyles.label}>
                    QUANTIDADE PARA AVISO: *
                  </Text>
                  <TextInput
                    style={globalStyles.inputEditar}
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
            <View style={globalStyles.buttonRowContainer}>
              <TouchableOpacity
                style={[globalStyles.button, { flex: 1 }]}
                onPress={editar}
              >
                <Text style={globalStyles.buttonText}>Salvar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  globalStyles.button,
                  { flex: 1, backgroundColor: "#B30F03" },
                ]}
                onPress={() => setEditando(false)}
              >
                <Text style={globalStyles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </Animatable.View>
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
