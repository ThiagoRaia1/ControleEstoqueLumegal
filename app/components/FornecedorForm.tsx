import { Picker } from "@react-native-picker/picker";
import {
  ScrollView,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  useWindowDimensions,
} from "react-native";
import normalizeInsert from "../../utils/normalizeInsert";
import { getGlobalStyles } from "../../globalStyles";
import { useThemeContext } from "../../context/ThemeContext";
import { useEffect, useState } from "react";
import { ICriarFornecedor, IFornecedor } from "../../interfaces/fornecedor";
import { ITipoUnidade } from "../../interfaces/tipoUnidade";
import {
  editarFornecedorApi,
  getFornecedores,
  getFornecedorPorNome,
} from "../../services/fornecedorApi";
import { getTiposUnidade } from "../../services/tipoUnidadeApi";
import { router } from "expo-router";
import { IEndereco } from "../../interfaces/endereco";
import { getEnderecoPorCidade, getEnderecos } from "../../services/enderecoApi";
import { ICategoriaFornecedor } from "../../interfaces/categoriaFornecedor";
import {
  getCategoriasFornecedor,
  getCategoriasFornecedorPorCategoria,
} from "../../services/categoriaFornecedorApi";
import { nomePaginas } from "../../utils/nomePaginas";

interface FornecedorFormProps {
  itemSelecionado: IFornecedor;
}

export default function FornecedorForm({
  itemSelecionado,
}: FornecedorFormProps) {
  const { theme } = useThemeContext();
  const globalStyles = getGlobalStyles(theme);
  const { width, height } = useWindowDimensions();
  const [carregando, setCarregando] = useState(false);

  const [nome, setNome] = useState("");
  const [enderecos, setEnderecos] = useState<string[]>([""]);
  const [categoriasFornecedor, setCategoriasFornecedor] = useState<string[]>([
    "",
  ]);

  // Estado com lista completa de enderecos vindos do backend
  const [enderecosDisponiveis, setEnderecosDisponiveis] = useState<
    { label: string; value: string }[]
  >([]);

  // Estado com lista completa de categorias de fornecedor vindas do backend
  const [categoriasFornecedorDisponiveis, setCategoriasFornecedorDisponiveis] =
    useState<{ label: string; value: string }[]>([]);

  async function carregarCategoriasFornecedoresEEnderecos() {
    try {
      setCarregando(true);
      const listaCategoriasFornecedorDisponiveis =
        await getCategoriasFornecedor();
      const itensCategoriasFornecedor =
        listaCategoriasFornecedorDisponiveis.map((f: ICategoriaFornecedor) => ({
          label: f.categoria,
          value: f.categoria, // use f.id se quiser o ID como value
        }));
      setCategoriasFornecedorDisponiveis(itensCategoriasFornecedor);

      const listaEnderecos = await getEnderecos();
      const itensEnderecos = listaEnderecos.map((f: IEndereco) => ({
        label: f.cidade,
        value: f.cidade, // use f.id se quiser o ID como value
      }));
      setEnderecosDisponiveis(itensEnderecos);
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
        await carregarCategoriasFornecedoresEEnderecos();
      } catch (erro: any) {
        alert(erro.message);
      } finally {
        setCarregando(false);
      }
    };

    carregarDados();

    setNome(itemSelecionado.nome ?? "");

    if (itemSelecionado.enderecos.length > 0) {
      setEnderecos(
        itemSelecionado.enderecos.map(
          (endereco: IEndereco) => endereco.cidade ?? ""
        )
      );
    } else {
      setEnderecos([""]);
    }

    if (itemSelecionado.categoriasFornecedor.length > 0) {
      setCategoriasFornecedor(
        itemSelecionado.categoriasFornecedor.map(
          (categoriaFornecedor: ICategoriaFornecedor) =>
            categoriaFornecedor.categoria ?? ""
        )
      );
    } else {
      setCategoriasFornecedor([""]);
    }
  }, []);

  // Função para setar endereco selecionado no índice
  const setEndereco = (index: number, valor: string) => {
    setEnderecos((prev) => {
      const novos = [...prev];
      novos[index] = valor;
      return novos;
    });
  };

  // Função para setar categoria selecionada no índice
  const setCategoriaFornecedor = (index: number, valor: string) => {
    setCategoriasFornecedor((prev) => {
      const novos = [...prev];
      novos[index] = valor;
      return novos;
    });
  };

  const editar = async () => {
    // Validação

    if (!itemSelecionado) {
      alert("Nenhum item selecionado para edição.");
      return;
    }

    if (!nome.trim()) {
      alert("Nome é obrigatório.");
      return;
    }

    if (enderecos.length === 0) {
      alert("O fornecedor deve ter ao menos um endereço.");
      return;
    }

    if (categoriasFornecedor.length === 0) {
      alert("O fornecedor deve ter ao menos uma categoria.");
      return;
    }

    try {
      setCarregando(true);

      const enderecosValidos = enderecos.filter(
        (endereco) => typeof endereco === "string" && endereco.trim() !== ""
      );
      let enderecosIds: number[] = [];
      for (let i = 0; i < enderecosValidos.length; i++) {
        const enderecoObj: IEndereco = await getEnderecoPorCidade(
          enderecosValidos[i]
        );
        enderecosIds.push(enderecoObj.id);
      }

      const categoriasFornecedorValidas = categoriasFornecedor.filter(
        (f) => typeof f === "string" && f.trim() !== ""
      );
      let categoriasIds: number[] = [];
      for (let i = 0; i < categoriasFornecedorValidas.length; i++) {
        const categoriasObj: ICategoriaFornecedor =
          await getCategoriasFornecedorPorCategoria(
            categoriasFornecedorValidas[i]
          );
        categoriasIds.push(categoriasObj.id);
      }

      // Montar objeto para edição de suprimento
      const editado: ICriarFornecedor = {
        nome,
        enderecos: enderecosIds,
        categoriasFornecedor: categoriasIds,
      };

      await editarFornecedorApi(itemSelecionado.nome, editado);
      alert("Fornecedor editado com sucesso!");
      router.push(nomePaginas.registrarItem.main);
    } catch (erro: any) {
      alert(erro.message);
    } finally {
      setCarregando(false);
    }
  };

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
        <View
          style={{
            flex: 1,
            width: "100%",
            justifyContent: "center",
            gap: 20,
          }}
        >
          <View style={globalStyles.labelInputContainer}>
            <Text style={globalStyles.label}>NOME: *</Text>
            <TextInput
              style={globalStyles.inputEditar}
              placeholder="Nome"
              placeholderTextColor="#888"
              value={nome}
              onChangeText={(text) => setNome(normalizeInsert(text))}
            />
          </View>

          <View style={globalStyles.labelInputContainer}>
            <Text style={globalStyles.label}>ENDEREÇOS: ¹*</Text>

            {enderecos.map((endereco, index) => {
              const usados = enderecos.filter((_, i) => i !== index);
              const opcoesFiltradas = enderecosDisponiveis.filter(
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
                      selectedValue={enderecos[index]}
                      onValueChange={(valor) => setEndereco(index, valor)}
                      style={[
                        globalStyles.inputEditar,
                        {
                          flex: 1,
                          color:
                            enderecos[index] === ""
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
                        label="Selecione o endereço"
                        value=""
                        color={"#888"}
                      />
                      {opcoesFiltradas.map((endereco) => (
                        <Picker.Item
                          key={endereco.value}
                          label={endereco.label}
                          value={endereco.value}
                          color={theme === "light" ? "black" : "white"}
                        />
                      ))}
                    </Picker>
                  </View>

                  {index > 0 && (
                    <TouchableOpacity
                      onPress={() =>
                        setEnderecos((prev) =>
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

            {enderecos.length < 3 &&
              enderecos[enderecos.length - 1].trim() !== "" && (
                <TouchableOpacity
                  onPress={() => setEnderecos((prev) => [...prev, ""])}
                  style={globalStyles.button}
                >
                  <Text style={globalStyles.buttonText}>
                    Adicionar endereço
                  </Text>
                </TouchableOpacity>
              )}
          </View>

          <View style={globalStyles.labelInputContainer}>
            <Text style={globalStyles.label}>CATEGORIAS DO FORNECEDOR: ¹*</Text>

            {categoriasFornecedor.map((categoria, index) => {
              const usados = categoriasFornecedor.filter((_, i) => i !== index);
              const opcoesFiltradas = categoriasFornecedorDisponiveis.filter(
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
                      selectedValue={categoriasFornecedor[index]}
                      onValueChange={(valor) =>
                        setCategoriaFornecedor(index, valor)
                      }
                      style={[
                        globalStyles.inputEditar,
                        {
                          flex: 1,
                          color:
                            categoriasFornecedor[index] === ""
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
                        label="Selecione a categoria"
                        value=""
                        color={"#888"}
                      />
                      {opcoesFiltradas.map((categoria: any) => (
                        <Picker.Item
                          key={categoria.value}
                          label={categoria.label}
                          value={categoria.value}
                          color={theme === "light" ? "black" : "white"}
                        />
                      ))}
                    </Picker>
                  </View>

                  {index > 0 && (
                    <TouchableOpacity
                      onPress={() =>
                        setCategoriasFornecedor((prev) =>
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

            {categoriasFornecedor.length < 3 &&
              categoriasFornecedor[categoriasFornecedor.length - 1].trim() !==
                "" && (
                <TouchableOpacity
                  onPress={() =>
                    setCategoriasFornecedor((prev) => [...prev, ""])
                  }
                  style={globalStyles.button}
                >
                  <Text style={globalStyles.buttonText}>
                    Adicionar categoria
                  </Text>
                </TouchableOpacity>
              )}
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
          style={[globalStyles.buttonCancelar, { flex: 1 }]}
          onPress={() => router.back()}
        >
          <Text style={globalStyles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
