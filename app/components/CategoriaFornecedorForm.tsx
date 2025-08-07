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
import { useThemeContext } from "../../context/themeContext";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { nomePaginas } from "../../utils/nomePaginas";
import {
  ICategoriaFornecedor,
  ICriarCategoriaFornecedor,
} from "../../interfaces/categoriaFornecedor";
import { editarCategoriaFornecedorApi } from "../../services/categoriaFornecedorApi";

interface CategoriaFornecedorFormProps {
  itemSelecionado: ICategoriaFornecedor;
}

export default function CategoriaFornecedorForm({
  itemSelecionado,
}: CategoriaFornecedorFormProps) {
  const { theme } = useThemeContext();
  const globalStyles = getGlobalStyles(theme);
  const { width, height } = useWindowDimensions();
  const [carregando, setCarregando] = useState(false);

  const [categoria, setCategoria] = useState("");

  const editar = async () => {
    // Validação
    if (!categoria?.trim()) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      setCarregando(true);

      if (!itemSelecionado) {
        alert("Nenhum item selecionado para edição.");
        return;
      }

      // Objeto para edição de EPI
      const editado: ICriarCategoriaFornecedor = {
        categoria: categoria.trim(),
      };

      await editarCategoriaFornecedorApi(itemSelecionado.id, editado);

      alert("Categoria de fornecedor editada com sucesso!");
      router.push(nomePaginas.registrarItem.main);
    } catch (erro: any) {
      alert(erro.message);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    setCategoria(itemSelecionado.categoria ?? "");
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
          <Text style={globalStyles.label}>CATEGORIA DO FORNECEDOR: *</Text>
          <TextInput
            style={globalStyles.inputEditar}
            placeholder="Categoria"
            placeholderTextColor="#888"
            value={categoria}
            onChangeText={(text) => setCategoria(normalizeInsert(text))}
          />
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
