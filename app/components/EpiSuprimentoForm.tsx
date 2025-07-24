import { Picker } from "@react-native-picker/picker";
import {
  ScrollView,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  useWindowDimensions,
} from "react-native";
import MaskInput, { Masks } from "react-native-mask-input";
import {
  acessoCompras,
  acessoComprasAdm,
  useTipoAcessoContext,
} from "../../context/tipoAcessoContext";
import normalizeInsert from "../../utils/normalizeInsert";
import { getGlobalStyles } from "../../globalStyles";
import { useThemeContext } from "../../context/ThemeContext";
import { useEffect, useState } from "react";
import { IFornecedor } from "../../interfaces/fornecedor";
import { ITipoUnidade } from "../../interfaces/tipoUnidade";
import {
  getFornecedores,
  getFornecedorPorNome,
} from "../../services/fornecedorApi";
import { getTiposUnidade, getTipoUnidade } from "../../services/tipoUnidadeApi";
import { router } from "expo-router";
import { ICriarEpi } from "../../interfaces/epi";
import { editarEpiApi } from "../../services/epiApi";
import { editarSuprimentoApi } from "../../services/suprimentoApi";

interface EpiSuprimentoFormProps {
  tipoItem: string;
  itemSelecionado: any;
}

export default function EpiSuprimentoForm({
  tipoItem,
  itemSelecionado,
}: EpiSuprimentoFormProps) {
  const { tipoAcesso } = useTipoAcessoContext();
  const { theme } = useThemeContext();
  const globalStyles = getGlobalStyles(theme);
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

  const editar = async () => {
    // Validação
    if (
      !nome?.trim() ||
      !tipoUnidade?.trim() ||
      !quantidade?.trim() ||
      !quantidadeParaAviso?.trim()
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

      const fornecedoresValidos = fornecedores.filter(
        (f) => typeof f === "string" && f.trim() !== ""
      );
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

      if (tipoItem === "epi") {
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
        console.log("Editando EPI selecionado: ", itemSelecionado.nome);
        console.log(editado);
      } else if (tipoItem === "suprimento") {
        // Montar objeto para edição de suprimento
        const suprimentoEditado = {
          nome,
          descricao: descricao?.trim() || "",
          quantidade: quantidadeNum,
          quantidadeParaAviso: quantidadeParaAvisoNum,
          tipoUnidadeId: tipoUnidadeObj.id,
          fornecedores: fornecedoresIds,
          preco: formatarPrecoParaEnvio(preco),
        };

        await editarSuprimentoApi(itemSelecionado.nome, suprimentoEditado);
        alert("Suprimento editado com sucesso!");
        console.log("Editando suprimento selecionado: ", itemSelecionado.nome);
      } else {
        alert("Tipo de item desconhecido.");
      }
    } catch (erro: any) {
      alert(erro.message);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    setNome(itemSelecionado.nome ?? "");
    if (tipoItem === "epi")
      setCertificadoAprovacao(itemSelecionado.certificadoAprovacao ?? "");
    setDescricao(itemSelecionado.descricao ?? "");

    if (itemSelecionado.tipoUnidade) {
      if (typeof itemSelecionado.tipoUnidade === "object") {
        setTipoUnidade(itemSelecionado.tipoUnidade.tipo ?? "");
      } else {
        setTipoUnidade(itemSelecionado.tipoUnidade ?? "");
      }
    } else {
      setTipoUnidade("");
    }

    if (Array.isArray(itemSelecionado.fornecedores)) {
      if (typeof itemSelecionado.fornecedores[0] === "object") {
        setFornecedores(
          itemSelecionado.fornecedores.map((f: any) => f.nome ?? "")
        );
      } else {
        setFornecedores(itemSelecionado.fornecedores);
      }
    } else {
      setFornecedores([""]);
    }

    setQuantidade(itemSelecionado.quantidade?.toString() ?? "");
    setQuantidadeParaAviso(
      itemSelecionado.quantidadeParaAviso?.toString() ?? ""
    );
    setPreco(itemSelecionado.preco?.toString() ?? "");
    setIpi(itemSelecionado.ipi?.toString() ?? "");
  }, []);

  return (
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
            onChangeText={(text) => setNome(normalizeInsert(text.slice(0, 50)))}
          />
        </View>

        {tipoItem === "epi" && (
          <View style={globalStyles.labelInputContainer}>
            <Text style={globalStyles.label}>CERTIFICADO DE APROVAÇÃO:</Text>
            <TextInput
              style={globalStyles.inputEditar}
              placeholder="C.A. do EPI"
              placeholderTextColor="#888"
              value={certificadoAprovacao}
              onChangeText={(text) =>
                setCertificadoAprovacao(normalizeInsert(text.slice(0, 20)))
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
                  backgroundColor: theme === "light" ? "#F0F3FA" : "#1C1C1C", // fundo do picker
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
                      backgroundColor: theme === "light" ? "#fff" : "#2a2a2a",
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
                    dropdownIconColor={theme === "light" ? "black" : "white"}
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
            <Text style={globalStyles.label}>QUANTIDADE PARA AVISO: *</Text>
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
          {[acessoCompras, acessoComprasAdm].includes(tipoAcesso) &&
            (tipoItem === "epi" || tipoItem === "suprimento") && (
              <>
                <View style={[globalStyles.labelInputContainer, { flex: 1 }]}>
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
                <View style={[globalStyles.labelInputContainer, { flex: 1 }]}>
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
          onPress={() => router.back()}
        >
          <Text style={globalStyles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
