import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  useWindowDimensions,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { useThemeContext } from "../../../context/ThemeContext";
import Carregando from "../../components/Carregando";
import { useEffect, useState } from "react";
import ModalConfirmacao from "../../components/ModalConfirmacao";
import { ICriarEpi, IEpi } from "../../../interfaces/epi";
import { editarEpiApi, excluirEpiApi, getEpis } from "../../../services/epiApi";
import { Picker } from "@react-native-picker/picker";
import {
  getFornecedores,
  getFornecedorPorNome,
} from "../../../services/fornecedorApi";
import {
  getTiposUnidade,
  getTipoUnidade,
} from "../../../services/tipoUnidadeApi";
import { IFornecedor } from "../../../interfaces/fornecedor";
import { ITipoUnidade } from "../../../interfaces/tipoUnidade";
import { getGlobalStyles } from "../../../globalStyles";
import SearchBar from "../../components/SearchBar";
import {
  editarSuprimentoApi,
  getSuprimentos,
} from "../../../services/suprimentoApi";
import { ISuprimento } from "../../../interfaces/suprimento";
import MaskInput, { Masks } from "react-native-mask-input";
import {
  acessoCompras,
  acessoComprasAdm,
  useTipoAcessoContext,
} from "../../../context/tipoAcessoContext";
import MenuSuperior from "../../components/MenuSuperior";
import FiltroTipoItem from "../../components/FiltroTipoItem";
import normalizeInsert from "../../../utils/normalizeInsert";
import MenuLateral from "../../components/MenuLateral";

export default function Pesquisar() {
  const { tipoAcesso } = useTipoAcessoContext();
  const { theme } = useThemeContext();
  const globalStyles = getGlobalStyles(theme);
  const { width, height } = useWindowDimensions();
  const [carregando, setCarregando] = useState(false);
  const [isMenuLateralVisivel, setIsMenuLateralVisivel] = useState(false);

  const [epis, setEpis] = useState<IEpi[]>([]);
  const [suprimentos, setSuprimentos] = useState<ISuprimento[]>([]);
  const [filtro, setFiltro] = useState<"todos" | "epi" | "suprimento">("todos");

  const [modalVisible, setModalVisible] = useState(false);
  type ItemUnificado = (IEpi | ISuprimento) & { tipo: "epi" | "suprimento" };
  const [itemSelecionado, setItemSelecionado] = useState<ItemUnificado | null>(
    null
  );

  const [pesquisa, setPesquisa] = useState("");

  const [editando, setEditando] = useState(false);
  const [nome, setNome] = useState("");
  const [certificadoAprovacao, setCertificadoAprovacao] = useState("");
  const [descricao, setDescricao] = useState("");
  const [tipoUnidade, setTipoUnidade] = useState("");
  const [fornecedores, setFornecedores] = useState<string[]>([""]);
  const [quantidade, setQuantidade] = useState("");
  const [quantidadeParaAviso, setQuantidadeParaAviso] = useState("");
  const [preco, setPreco] = useState("");
  const [ipi, setIpi] = useState("");

  // Estado com lista completa de fornecedores vindos do backend
  const [fornecedoresDisponiveis, setFornecedoresDisponiveis] = useState<
    { label: string; value: string }[]
  >([]);

  // Estado com lista completa de tipos de unidade vindos do backend
  const [tiposUnidadeDisponiveis, setTiposUnidadeDisponiveis] = useState<
    { label: string; value: string }[]
  >([]);

  async function carregarTiposUnidadeEFornecedores() {
    try {
      setCarregando(true);
      const listaTiposUnidadeDisponiveis = await getTiposUnidade();
      const itensTiposUnidade = listaTiposUnidadeDisponiveis.map(
        (f: ITipoUnidade) => ({
          label: f.tipo,
          value: f.tipo, // use f.id se quiser o ID como value
        })
      );
      setTiposUnidadeDisponiveis(itensTiposUnidade);

      const listaFornecedores = await getFornecedores();
      const itensFornecedores = listaFornecedores.map((f: IFornecedor) => ({
        label: f.nome,
        value: f.nome, // use f.id se quiser o ID como value
      }));
      setFornecedoresDisponiveis(itensFornecedores);
    } catch (erro: any) {
      alert(erro.message);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setCarregando(true);
        if ([acessoCompras, acessoComprasAdm].includes(tipoAcesso)) {
          await Promise.all([carregarEpis(), carregarSuprimentos()]);
        } else {
          await carregarEpis();
        }
        await carregarTiposUnidadeEFornecedores();
      } catch (erro: any) {
        alert(erro.message);
      } finally {
        setCarregando(false);
      }
    };

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

  const listaUnificada = [
    ...epis.map((item) => ({ ...item, tipo: "epi" })),
    ...([acessoCompras, acessoComprasAdm].includes(tipoAcesso)
      ? suprimentos.map((item) => ({ ...item, tipo: "suprimento" as const }))
      : []),
  ];

  // Funcao para ignorar acentuacao na pesquisa
  const normalizar = (texto: string) =>
    texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  // Funcao para filtrar a lista de itens de acordo com a pesquisa
  const itensFiltrados = listaUnificada
    .filter((item) => {
      // Aplica o filtro de tipo
      if (filtro === "epi" && item.tipo !== "epi") return false;
      if (filtro === "suprimento" && item.tipo !== "suprimento") return false;
      return true;
    })
    .filter((item) => {
      // Aplica o filtro de pesquisa
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
    .sort((a, b) =>
      (a.nome || "").localeCompare(b.nome || "", "pt-BR", {
        sensitivity: "base",
      })
    );

  useEffect(() => {
    if (itemSelecionado && editando) {
      setNome(itemSelecionado.nome || "");
      setDescricao(itemSelecionado.descricao || "");
      if ("certificadoAprovacao" in itemSelecionado) {
        setCertificadoAprovacao(itemSelecionado.certificadoAprovacao || "");
      }
      setTipoUnidade(itemSelecionado.tipoUnidade?.tipo || "");
      setQuantidade(String(itemSelecionado.quantidade ?? ""));
      setQuantidadeParaAviso(String(itemSelecionado.quantidadeParaAviso ?? ""));
      if (itemSelecionado.fornecedores.length != 0) {
        setFornecedores(itemSelecionado.fornecedores.map((f) => f.nome));
      }
      setPreco(itemSelecionado.preco || "");
    }
  }, [itemSelecionado, editando]);

  const editar = async () => {
    if (editando) {
      // Validações básicas comuns a ambos
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

        const quantidadeNum = parseInt(quantidade, 10);
        const quantidadeParaAvisoNum = parseInt(quantidadeParaAviso, 10);

        if (isNaN(quantidadeNum) || quantidadeNum < 0) {
          throw new Error("Quantidade deve ser um número válido.");
        }
        if (isNaN(quantidadeParaAvisoNum) || quantidadeParaAvisoNum < 0) {
          throw new Error("Quantidade para Aviso deve ser um número válido.");
        }

        if (!descricao) {
          setDescricao(" ");
        }

        const tipoUnidadeObj: ITipoUnidade = await getTipoUnidade(tipoUnidade);

        const fornecedoresValidos = fornecedores.filter((f) => f.trim() !== "");
        let fornecedoresIds: number[] = [];
        for (let i = 0; i < fornecedoresValidos.length; i++) {
          const fornecedorObj: IFornecedor = await getFornecedorPorNome(
            fornecedoresValidos[i]
          );
          fornecedoresIds.push(fornecedorObj.id);
        }

        if (!itemSelecionado) {
          alert("Nenhum item selecionado para edição.");
          return;
        }

        function formatarPrecoParaEnvio(preco: string): string {
          const soNumeros = preco.replace(/\D/g, ""); // remove tudo que não for número
          const valor = parseInt(soNumeros || "0", 10);
          const comDecimal = (valor / 100).toFixed(2); // divide por 100 e fixa 2 casas
          return comDecimal; // retorna como "12.34"
        }

        if (itemSelecionado.tipo === "epi") {
          // Objeto para edição de EPI
          const epiEditado: ICriarEpi = {
            nome,
            descricao: descricao?.trim() || "",
            certificadoAprovacao,
            quantidade: quantidadeNum,
            quantidadeParaAviso: quantidadeParaAvisoNum,
            tipoUnidadeId: tipoUnidadeObj.id,
            fornecedores: fornecedoresIds,
            preco: formatarPrecoParaEnvio(preco),
          };

          const editado = await editarEpiApi(itemSelecionado.nome, epiEditado);
          alert("EPI editado com sucesso!");

          await carregarEpis();
        } else if (itemSelecionado.tipo === "suprimento") {
          // Montar objeto para edição de suprimento
          const suprimentoEditado = {
            nome,
            descricao: descricao?.trim() || "",
            quantidade: quantidadeNum,
            quantidadeParaAviso: quantidadeParaAvisoNum,
            tipoUnidadeId: tipoUnidadeObj.id,
            fornecedores: fornecedoresIds,
            preco: formatarPrecoParaEnvio(preco),
            // Não inclui certificadoAprovacao para suprimento
          };

          await editarSuprimentoApi(itemSelecionado.nome, suprimentoEditado);
          alert("Suprimento editado com sucesso!");

          await carregarSuprimentos();
        } else {
          alert("Tipo de item desconhecido.");
        }

        setEditando(false);
      } catch (erro: any) {
        alert(erro.message);
      } finally {
        setCarregando(false);
      }
    }
  };

  const excluirItem = async () => {
    if (!itemSelecionado) return;
    try {
      setCarregando(true);
      await excluirEpiApi(itemSelecionado.id);
      alert(`EPI "${itemSelecionado.nome}" excluído com sucesso!`);
      setModalVisible(false);
      setItemSelecionado(null);
      await carregarEpis(); // Atualiza a lista
    } catch (erro: any) {
      alert(erro.message);
    }
  };

  function RenderForm({
    item,
    onEditar,
  }: {
    item: ItemUnificado;
    onEditar?: () => void;
  }) {
    const isEpi = item.tipo === "epi";

    return (
      <View
        style={{
          backgroundColor: theme === "light" ? "#fff" : "#1e1e1e",
          borderRadius: 12,
          padding: 16,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 4,
          elevation: 3,
          flexDirection: "column",
          gap: 12,
          borderWidth: 1,
          borderColor: theme === "light" ? "#888" : "white",
        }}
      >
        <View>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: theme === "light" ? "#000" : "#fff",
              marginBottom: 4,
            }}
          >
            {item.nome}
          </Text>
          <Text style={[globalStyles.dadosItem, { marginLeft: -3 }]}>
            {isEpi ? "🧤 EPI" : "📦 Suprimento"}
          </Text>
          {isEpi && (
            <Text
              style={{
                color: theme === "light" ? "black" : "#888",
                fontWeight: "500",
                fontSize: 14,
                marginBottom: 4,
              }}
            >
              C.A.: {(item as IEpi).certificadoAprovacao}
            </Text>
          )}
          <Text style={globalStyles.dadosItem}>
            Unidade: {item.tipoUnidade.tipo}
          </Text>
          <Text style={globalStyles.dadosItem}>
            Quantidade: {item.quantidade} | Aviso: {item.quantidadeParaAviso}
          </Text>
        </View>

        {item.descricao?.trim() !== "" && (
          <View>
            <Text style={[globalStyles.dadosItem, { fontWeight: "bold" }]}>
              Descrição:
            </Text>
            <Text style={[globalStyles.dadosItem, { textAlign: "justify" }]}>
              {item.descricao}
            </Text>
          </View>
        )}

        {item.fornecedores?.length > 0 && (
          <View>
            <Text
              style={[
                globalStyles.dadosItem,
                { fontWeight: "bold", marginBottom: 0 },
              ]}
            >
              Fornecedores:
            </Text>
            {item.fornecedores.slice(0, 3).map((fornecedor, index) => (
              <Text key={index} style={globalStyles.dadosItem}>
                • {fornecedor.nome}
              </Text>
            ))}
          </View>
        )}

        <TouchableOpacity
          style={{
            alignSelf: "flex-end",
            backgroundColor: theme === "light" ? "#007bff" : "#444",
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 8,
            marginTop: 8,
          }}
          onPress={onEditar}
        >
          <Text
            style={{
              color: "#fff",
              fontWeight: "bold",
              fontSize: 14,
            }}
          >
            Editar
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  function ItemUnificado({ item }: { item: ItemUnificado }) {
    return (
      <RenderForm
        item={item}
        onEditar={() => {
          setItemSelecionado(item);
          setEditando(true);
        }}
      />
    );
  }

  return (
    <View style={globalStyles.background}>
      <MenuSuperior />
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
            {(tipoAcesso === acessoCompras ||
              tipoAcesso === acessoComprasAdm) && (
              <FiltroTipoItem
                valorSelecionado={filtro}
                onSelecionar={setFiltro}
              />
            )}
            <View style={globalStyles.itensScroll}>
              <ScrollView
                contentContainerStyle={{
                  padding: 20,
                  gap: 20,
                }}
                persistentScrollbar
              >
                {itensFiltrados.map((item: any, index: number) => (
                  <Animatable.View
                    key={
                      "certificadoAprovacao" in item
                        ? `epi-${item.id}`
                        : `sup-${item.id}`
                    }
                    animation="fadeInUp"
                    duration={600}
                    delay={index * 100}
                  >
                    <ItemUnificado item={item} />
                  </Animatable.View>
                ))}
              </ScrollView>
            </View>
          </>
        ) : (
          <>
            <Text style={globalStyles.title}>EDITANDO</Text>
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
                  onChangeText={(text) =>
                    setNome(normalizeInsert(text.slice(0, 50)))
                  }
                />
              </View>

              {itemSelecionado?.tipo === "epi" && (
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
                      setCertificadoAprovacao(
                        normalizeInsert(text.slice(0, 20))
                      )
                    }
                  />
                </View>
              )}

              <View style={globalStyles.labelInputContainer}>
                <Text style={globalStyles.label}>DESCRIÇÃO:</Text>
                <TextInput
                  style={globalStyles.inputEditar}
                  placeholder="Descrição do EPI"
                  placeholderTextColor="#888"
                  value={descricao}
                  onChangeText={(text) => setDescricao(normalizeInsert(text))}
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
                  <Text style={globalStyles.label}>QUANTIDADE: *</Text>
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
                {[acessoCompras, acessoComprasAdm].includes(tipoAcesso) && (
                  <>
                    <View
                      style={[globalStyles.labelInputContainer, { flex: 1 }]}
                    >
                      <Text style={globalStyles.label}>PRECO:</Text>
                      <MaskInput
                        style={globalStyles.inputEditar}
                        placeholder="Preço médio do item"
                        placeholderTextColor="#888"
                        value={preco}
                        onChangeText={(masked, unmasked) => {
                          const centavos = parseInt(unmasked || "0", 10);

                          // Limite de R$ 9999,99 (999999 centavos)
                          if (centavos > 999999) return;

                          const reais = (centavos / 100).toFixed(2); // ex: 1 => "0.01", 10 => "0.10", 100 => "1.00"
                          setPreco(reais);
                        }}
                        mask={Masks.BRL_CURRENCY}
                      />
                    </View>
                    <View
                      style={[globalStyles.labelInputContainer, { flex: 1 }]}
                    >
                      <Text style={globalStyles.label}>IPI:</Text>
                      <View
                        style={{
                          flexDirection: "row",
                          height: 50,
                          width: "100%",
                          borderWidth: 1,
                          borderRadius: 10,
                          borderColor: theme === "light" ? "black" : "white",
                          boxShadow:
                            theme === "light"
                              ? "0px 5px 10px rgba(0, 0, 0, 0.8)"
                              : "0px 5px 10px rgba(140, 140, 140, 0.8)",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextInput
                          style={{
                            width: "80%",
                            height: "100%",
                            outlineStyle: "none" as any,
                            fontSize: 16,
                          }}
                          placeholder="IPI do item"
                          placeholderTextColor="#888"
                          value={ipi}
                          onChangeText={(text) => {
                            // Permite números e vírgula/ponto (substitui vírgula por ponto)
                            const sanitized = text
                              .replace(/[^0-9.,]/g, "") // mantém números, vírgula e ponto
                              .replace(",", "."); // padroniza como ponto

                            // Verifica se é um número válido
                            const parsed = parseFloat(sanitized);

                            // Atualiza apenas se for um número válido ou vazio
                            if (!isNaN(parsed)) {
                              setIpi(sanitized);
                            } else if (sanitized === "") {
                              setIpi("");
                            }
                          }}
                          keyboardType="decimal-pad"
                        />
                        <Text
                          style={{
                            color: theme === "light" ? "black" : "white",
                          }}
                        >
                          %
                        </Text>
                      </View>
                    </View>
                  </>
                )}
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
                style={[globalStyles.buttonCancelar, { flex: 1 }]}
                onPress={() => setEditando(false)}
              >
                <Text style={globalStyles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </Animatable.View>
      <MenuLateral
        visivel={isMenuLateralVisivel}
        setVisivel={setIsMenuLateralVisivel}
      />
      {carregando && <Carregando />}
      <ModalConfirmacao
        visivel={modalVisible}
        onConfirmar={excluirItem}
        onCancelar={() => setModalVisible(false)}
        mensagem={`Tem certeza que deseja excluir o EPI "${
          itemSelecionado?.nome || " "
        }"?`}
      />
    </View>
  );
}
