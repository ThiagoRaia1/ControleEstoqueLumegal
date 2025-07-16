import { View, Text, TouchableOpacity, TextInput } from "react-native";
import * as Animatable from "react-native-animatable";
import MenuSuperior from "../../../../components/MenuSuperior";
import { useThemeContext } from "../../../../../context/ThemeContext";
import { getGlobalStyles } from "../../../../../globalStyles";
import MenuInferior from "../../../../components/MenuInferior";
import Carregando from "../../../../components/Carregando";
import { useState } from "react";
import { router } from "expo-router";
import { registrarTipoUnidadeApi } from "../../../../../services/tipoUnidadeApi";
import { ICriarTipoUnidade } from "../../../../../interfaces/tipoUnidade";

export default function TipoUnidade() {
  const { theme } = useThemeContext();
  const globalStyles = getGlobalStyles(theme);
  const [carregando, setCarregando] = useState(false);

  const [tipo, setTipo] = useState("");

  const registrarTipoUnidade = async () => {
    try {
      setCarregando(true);
      if (!tipo || !tipo.trim()) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
      }
      const tipoUnidade: ICriarTipoUnidade = {
        tipo: tipo.trim(),
      };
      const retornoDaApi = await registrarTipoUnidadeApi(tipoUnidade);
      alert("Tipo de unidade registrado com sucesso!");
      setTipo("");
    } catch (erro: any) {
      alert(erro.message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <View style={globalStyles.background}>
      <MenuSuperior />
      <Text style={globalStyles.title}>REGISTRAR TIPO DE UNIDADE</Text>
      <Animatable.View
        animation="fadeInUp"
        duration={1000}
        style={globalStyles.mainContent}
      >
        <View style={{ flex: 1, width: "100%", justifyContent: "center" }}>
          <View style={globalStyles.labelInputContainer}>
            <Text style={globalStyles.label}>TIPO: *</Text>
            <TextInput
              style={globalStyles.inputEditar}
              placeholder="Tipo"
              placeholderTextColor="#888"
              value={tipo}
              onChangeText={(text) => setTipo(text)}
            />
          </View>
        </View>
        <View style={globalStyles.buttonRowContainer}>
          <TouchableOpacity
            style={[globalStyles.button, { flex: 1 }]}
            onPress={registrarTipoUnidade}
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
