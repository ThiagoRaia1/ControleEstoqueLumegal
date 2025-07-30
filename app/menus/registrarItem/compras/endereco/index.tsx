import { View, Text, TouchableOpacity, TextInput } from "react-native";
import * as Animatable from "react-native-animatable";
import MenuSuperior from "../../../../components/MenuSuperior";
import { useThemeContext } from "../../../../../context/ThemeContext";
import { getGlobalStyles } from "../../../../../globalStyles";
import Carregando from "../../../../components/Carregando";
import { useState } from "react";
import { router } from "expo-router";
import { ICriarEndereco } from "../../../../../interfaces/endereco";
import { registrarEnderecoApi } from "../../../../../services/enderecoApi";
import { nomePaginas } from "../../../../../utils/nomePaginas";
import normalizeInsert from "../../../../../utils/normalizeInsert";
import MenuLateral from "../../../../components/MenuLateral";

export default function Endereco() {
  const { theme } = useThemeContext();
  const globalStyles = getGlobalStyles(theme);
  const [carregando, setCarregando] = useState(false);
  const [isMenuLateralVisivel, setIsMenuLateralVisivel] = useState(false);

  const [cidade, setCidade] = useState("");

  const registrarEndereco = async () => {
    try {
      const endereco: ICriarEndereco = {
        cidade: cidade.trim(),
      };
      setCarregando(true);
      const resultado = await registrarEnderecoApi(endereco);
      alert("Endereço registrado com sucesso!");
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
      <Text style={globalStyles.title}>REGISTRAR ENDERECO</Text>
      <Animatable.View
        animation="fadeInUp"
        duration={1000}
        style={globalStyles.mainContent}
      >
        <View style={{ flex: 1, width: "100%", justifyContent: "center" }}>
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
        </View>
        <View style={globalStyles.buttonRowContainer}>
          <TouchableOpacity
            style={[globalStyles.button, { flex: 1 }]}
            onPress={registrarEndereco}
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
      <MenuLateral
        visivel={isMenuLateralVisivel}
        setVisivel={setIsMenuLateralVisivel}
      />
      {carregando && <Carregando />}
    </View>
  );
}
