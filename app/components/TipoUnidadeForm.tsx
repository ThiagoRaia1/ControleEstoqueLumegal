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
import { ICriarTipoUnidade, ITipoUnidade } from "../../interfaces/tipoUnidade";
import { router } from "expo-router";
import { editarTipoUnidadeApi } from "../../services/tipoUnidadeApi";
import { nomePaginas } from "../../utils/nomePaginas";

interface TipoUnidadeFormProps {
  itemSelecionado: ITipoUnidade;
}

export default function EpiSuprimentoForm({
  itemSelecionado,
}: TipoUnidadeFormProps) {
  const { theme } = useThemeContext();
  const globalStyles = getGlobalStyles(theme);
  const { width, height } = useWindowDimensions();
  const [carregando, setCarregando] = useState(false);

  const [tipo, setTipo] = useState("");

  const editar = async () => {
    // Validação
    if (!tipo?.trim()) {
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
      const tipoUnidadeEditado: ICriarTipoUnidade = {
        tipo: tipo.trim(),
      };

      await editarTipoUnidadeApi(itemSelecionado.id, tipoUnidadeEditado);

      alert("Tipo editado com sucesso!");
      router.push(nomePaginas.registrarItem.main);
    } catch (erro: any) {
      alert(erro.message);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    setTipo(itemSelecionado.tipo ?? "");
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
          <Text style={globalStyles.label}>TIPO: *</Text>
          <TextInput
            style={globalStyles.inputEditar}
            placeholder="Tipo"
            placeholderTextColor="#888"
            value={tipo}
            onChangeText={(text) => setTipo(normalizeInsert(text))}
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
