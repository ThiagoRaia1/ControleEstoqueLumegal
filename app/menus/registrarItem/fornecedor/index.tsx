import { View, Text, TouchableOpacity, TextInput } from "react-native";
import * as Animatable from "react-native-animatable";
import MenuSuperior from "../../../components/MenuSuperior";
import { useThemeContext } from "../../../../context/ThemeContext";
import { getGlobalStyles } from "../../../../globalStyles";
import MenuInferior from "../../../components/MenuInferior";
import Carregando from "../../../components/Carregando";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import {
  getEnderecoPorCidade,
  getEnderecos,
} from "../../../../services/enderecoApi";
import { IEndereco } from "../../../../interfaces/endereco";
import { ICriarFornecedor } from "../../../../interfaces/fornecedor";
import {
  getCategoriasFornecedor,
  getCategoriasFornecedorPorCategoria,
} from "../../../../services/categoriaFornecedorApi";
import { nomePaginas } from "../../../../utils/nomePaginas";
import { registrarFornecedorApi } from "../../../../services/fornecedorApi";
import { ICategoriaFornecedor } from "../../../../interfaces/categoriaFornecedor";

export default function Fornecedor() {
  const { theme } = useThemeContext();
  const globalStyles = getGlobalStyles(theme);
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

  // Estado com lista completa de categorias vindos do backend
  const [categoriasDisponiveis, setCategoriasDisponiveis] = useState<
    { label: string; value: string }[]
  >([]);

  useEffect(() => {
    async function carregarDados() {
      const listaEnderecos = await getEnderecos();
      const itensEnderecos = listaEnderecos.map((f: IEndereco) => ({
        label: f.cidade,
        value: f.cidade, // use f.id se quiser o ID como value
      }));
      setEnderecosDisponiveis(itensEnderecos);

      const listaCategorias = await getCategoriasFornecedor();
      const itensCategorias = listaCategorias.map(
        (f: ICategoriaFornecedor) => ({
          label: f.categoria,
          value: f.categoria, // use f.id se quiser o ID como value
        })
      );
      setCategoriasDisponiveis(itensCategorias);
    }
    carregarDados();
  }, []);

  // Função para setar fornecedor selecionado no índice
  const setEndereco = (index: number, valor: string) => {
    setEnderecos((prev) => {
      const novos = [...prev];
      novos[index] = valor;
      return novos;
    });
  };

  // Função para setar fornecedor selecionado no índice
  const setCategoria = (index: number, valor: string) => {
    setCategoriasFornecedor((prev) => {
      const novos = [...prev];
      novos[index] = valor;
      return novos;
    });
  };

  const registrarFornecedor = async () => {
    try {
      const enderecosValidos = enderecos.filter((f) => f.trim() !== "");
      let enderecosIds: number[] = [];
      for (let i: number = 0; i < enderecosValidos.length; i++) {
        const enderecoObj: IEndereco = await getEnderecoPorCidade(
          enderecosValidos[i]
        );
        enderecosIds.push(enderecoObj.id);
      }

      const categoriasFornecedorValidos = categoriasFornecedor.filter(
        (f) => f.trim() !== ""
      );
      let categoriasFornecedorIds: number[] = [];
      for (let i: number = 0; i < categoriasFornecedorValidos.length; i++) {
        const categoriaFornecedorObj: ICategoriaFornecedor =
          await getCategoriasFornecedorPorCategoria(
            categoriasFornecedorValidos[i]
          );
        categoriasFornecedorIds.push(categoriaFornecedorObj.id);
      }

      const fornecedor: ICriarFornecedor = {
        nome: nome.trim(),
        enderecos: enderecosIds,
        categoriasFornecedor: categoriasFornecedorIds,
      };
      setCarregando(true);
      const resultado = await registrarFornecedorApi(fornecedor);
      console.log(resultado);
      alert("Fornecedor registrado com sucesso!");
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
      <Text style={globalStyles.title}>REGISTRAR FORNECEDOR</Text>
      <Animatable.View
        animation="fadeInUp"
        duration={1000}
        style={globalStyles.mainContent}
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
              onChangeText={(text) => setNome(text)}
            />
          </View>

          <View style={globalStyles.labelInputContainer}>
            <Text style={globalStyles.label}>ENDEREÇOS: ¹*</Text>

            {enderecos.map((endereco, index) => {
              // Filtra os enderecos já selecionados, exceto o atual
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
                    Adicionar fornecedor
                  </Text>
                </TouchableOpacity>
              )}
          </View>

          <View style={globalStyles.labelInputContainer}>
            <Text style={globalStyles.label}>CATEGORIAS DO FORNECEDOR: ¹*</Text>

            {categoriasFornecedor.map((categoria, index) => {
              // Filtra os enderecos já selecionados, exceto o atual
              const usados = categoriasFornecedor.filter((_, i) => i !== index);
              const opcoesFiltradas = categoriasDisponiveis.filter(
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
                      onValueChange={(valor) => setCategoria(index, valor)}
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
                      {opcoesFiltradas.map((categoria) => (
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

        <View style={globalStyles.buttonRowContainer}>
          <TouchableOpacity
            style={[globalStyles.button, { flex: 1 }]}
            onPress={registrarFornecedor}
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
