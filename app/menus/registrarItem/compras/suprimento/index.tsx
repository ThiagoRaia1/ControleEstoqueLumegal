import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  useWindowDimensions,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { useThemeContext } from "../../../../../context/ThemeContext";
import { getGlobalStyles } from "../../../../../globalStyles";
import { IFornecedor } from "../../../../../interfaces/fornecedor";
import { ITipoUnidade } from "../../../../../interfaces/tipoUnidade";
import {
  getFornecedores,
  getFornecedorPorNome,
} from "../../../../../services/fornecedorApi";
import {
  getTiposUnidade,
  getTipoUnidade,
} from "../../../../../services/tipoUnidadeApi";
import Carregando from "../../../../components/Carregando";
import MenuInferior from "../../../../components/MenuInferior";
import MenuSuperior from "../../../../components/MenuSuperior";
import { router } from "expo-router";
import MaskInput, { Masks } from "react-native-mask-input";
import { ICriarSuprimento } from "../../../../../interfaces/suprimento";
import { registrarSuprimentoApi } from "../../../../../services/suprimentoApi";
import normalizeInsert from "../../../../../utils/normalizeInsert";
import { nomePaginas } from "../../../../../utils/nomePaginas";

export default function Suprimento() {
  const { theme } = useThemeContext();
  const globalStyles = getGlobalStyles(theme);
  const { width, height } = useWindowDimensions();
  const [carregando, setCarregando] = useState(false);

  const [nome, setNome] = useState("");
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

  useEffect(() => {
    async function carregarDados() {
      const listaTiposUnidadeDisponiveis = await getTiposUnidade();
      const itensTiposUnidade = listaTiposUnidadeDisponiveis
        .map((f: any) => ({
          label: f.tipo,
          value: f.tipo,
        }))
        .sort((a: any, b: any) => a.label.localeCompare(b.label)); // ordena por nome

      setTiposUnidadeDisponiveis(itensTiposUnidade);

      const listaFornecedores = await getFornecedores();
      const itensFornecedores = listaFornecedores
        .map((f: any) => ({
          label: f.nome,
          value: f.nome,
        }))
        .sort((a: any, b: any) => a.label.localeCompare(b.label)); // ordena por nome

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

  const registrarSuprimento = async () => {
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

      function formatarPrecoParaEnvio(preco: string): string {
        const soNumeros = preco.replace(/\D/g, ""); // remove tudo que não for número
        const valor = parseInt(soNumeros || "0", 10);
        const comDecimal = (valor / 100).toFixed(2); // divide por 100 e fixa 2 casas
        return comDecimal; // retorna como "12.34"
      }

      // console.log(fornecedoresIds);
      // console.log(preco);
      const suprimento: ICriarSuprimento = {
        nome: nome.trim(),
        descricao: descricao.trim(),
        quantidade: parseInt(quantidade.trim(), 10),
        quantidadeParaAviso: parseInt(quantidadeParaAviso.trim(), 10),
        tipoUnidadeId: tipoUnidadeId.id,
        fornecedores: fornecedoresIds,
        preco: formatarPrecoParaEnvio(preco),
        ipi: ipi !== "" ? parseFloat(ipi) : undefined,
      };

      const retornoDaApi = await registrarSuprimentoApi(suprimento);

      alert("Suprimento registrado com sucesso!");
      // Limpa os campos após o registro
      setNome("");
      setDescricao("");
      setTipoUnidade("");
      setFornecedores([""]);
      setQuantidade("");
      setQuantidadeParaAviso("");
      setPreco("");
      setIpi("");
      router.push(nomePaginas.registrarItem.main);
    } catch (erro: any) {
      alert(erro.message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <View style={globalStyles.background}>
      <MenuSuperior />
      <Text style={globalStyles.title}>REGISTRAR SUPRIMENTO</Text>
      <Animatable.View
        animation="fadeInUp"
        duration={1000}
        style={globalStyles.mainContent}
      >
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
              placeholder="Nome do suprimento"
              placeholderTextColor="#888"
              value={nome}
              onChangeText={(text) =>
                setNome(normalizeInsert(text.slice(0, 50)))
              }
            />
          </View>

          <View style={globalStyles.labelInputContainer}>
            <Text style={globalStyles.label}>DESCRIÇÃO:</Text>
            <TextInput
              style={globalStyles.inputEditar}
              placeholder="Descrição do suprimento"
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
                style={globalStyles.inputEditar}
                placeholder="Quantidade inicial do suprimento"
                placeholderTextColor="#888"
                value={quantidade}
                onChangeText={(text) => {
                  const numeric = text.replace(/[^0-9]/g, "");
                  const valor = parseInt(numeric || "0", 10);
                  setQuantidade(valor > 999 ? "999" : numeric);
                }}
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
                    color: theme === "light" ? "black" : "white",
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
          </View>
        </ScrollView>
        <View style={globalStyles.buttonRowContainer}>
          <TouchableOpacity
            style={[globalStyles.button, { flex: 1 }]}
            onPress={registrarSuprimento}
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
      </Animatable.View>
      <MenuInferior />
      {carregando && <Carregando />}
    </View>
  );
}
