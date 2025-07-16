import { View, Text, TouchableOpacity, TextInput } from "react-native";
import * as Animatable from "react-native-animatable";
import MenuSuperior from "../../../../components/MenuSuperior";
import { useThemeContext } from "../../../../../context/ThemeContext";
import { getGlobalStyles } from "../../../../../globalStyles";
import MenuInferior from "../../../../components/MenuInferior";
import Carregando from "../../../../components/Carregando";
import { useState } from "react";
import { router } from "expo-router";
import { nomePaginas } from "../../../../../utils/nomePaginas";
import { ICriarCategoriaFornecedor } from "../../../../../interfaces/categoriaFornecedor";
import { registrarCategoriaFornecedorApi } from "../../../../../services/categoriaFornecedorApi";

export default function CategoriaFornecedor() {
  const { theme } = useThemeContext();
  const globalStyles = getGlobalStyles(theme);
  const [carregando, setCarregando] = useState(false);

  const [categoria, setCategoria] = useState("");

  const registrarCategoria = async () => {
    try {
      const categoriaFornecedor: ICriarCategoriaFornecedor = {
        categoria: categoria.trim(),
      };
      setCarregando(true);
      const resultado = await registrarCategoriaFornecedorApi(
        categoriaFornecedor
      );
      console.log(resultado);
      alert("Categoria registrada com sucesso!");
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
      <Text style={globalStyles.title}>REGISTRAR CATEGORIA DO FORNECEDOR</Text>
      <Animatable.View
        animation="fadeInUp"
        duration={1000}
        style={globalStyles.mainContent}
      >
        <View style={{ flex: 1, width: "100%", justifyContent: "center" }}>
          <View style={globalStyles.labelInputContainer}>
            <Text style={globalStyles.label}>CATEGORIA DO FORNECEDOR: *</Text>
            <TextInput
              style={globalStyles.inputEditar}
              placeholder="Categoria do fornecedor"
              placeholderTextColor="#888"
              value={categoria}
              onChangeText={(text) => setCategoria(text)}
            />
          </View>
        </View>
        <View style={globalStyles.buttonRowContainer}>
          <TouchableOpacity
            style={[globalStyles.button, { flex: 1 }]}
            onPress={registrarCategoria}
          >
            <Text style={globalStyles.buttonText}>Salvar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              globalStyles.buttonCancelar,
              { flex: 1 },
            ]}
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
