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
import { router } from "expo-router";
import { editarTipoUnidadeApi } from "../../services/tipoUnidadeApi";
import { nomePaginas } from "../../utils/nomePaginas";
import { ICriarEndereco, IEndereco } from "../../interfaces/endereco";
import { editarEnderecoApi } from "../../services/enderecoApi";

interface EnderecoFormProps {
  itemSelecionado: IEndereco;
}

export default function EpiSuprimentoForm({
  itemSelecionado,
}: EnderecoFormProps) {
  const { theme } = useThemeContext();
  const globalStyles = getGlobalStyles(theme);
  const { width, height } = useWindowDimensions();
  const [carregando, setCarregando] = useState(false);

  const [cidade, setCidade] = useState("");

  const editar = async () => {
    // Validação
    if (!cidade?.trim()) {
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
      const editado: ICriarEndereco = {
        cidade: cidade.trim(),
      };

      await editarEnderecoApi(itemSelecionado.id, editado);

      alert("Endereço editado com sucesso!");
      router.push(nomePaginas.registrarItem.main);
    } catch (erro: any) {
      alert(erro.message);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    setCidade(itemSelecionado.cidade ?? "");
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
          <Text style={globalStyles.label}>CIDADE: *</Text>
          <TextInput
            style={globalStyles.inputEditar}
            placeholder="Cidade"
            placeholderTextColor="#888"
            value={cidade}
            onChangeText={(text) => setCidade(normalizeInsert(text))}
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
