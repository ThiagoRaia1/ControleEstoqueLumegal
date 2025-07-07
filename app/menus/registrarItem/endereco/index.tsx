import { View, Text, TouchableOpacity, TextInput } from "react-native";
import * as Animatable from "react-native-animatable";
import MenuSuperior from "../../../components/MenuSuperior";
import { useThemeContext } from "../../../../context/ThemeContext";
import { getGlobalStyles } from "../../../../globalStyles";
import MenuInferior from "../../../components/MenuInferior";
import Carregando from "../../../components/Carregando";
import { useState } from "react";
import { router } from "expo-router";
import { IEndereco } from "../../../../interfaces/endereco";

export default function Endereco() {
  const { theme } = useThemeContext();
  const globalStyles = getGlobalStyles(theme);
  const [carregando, setCarregando] = useState(false);

  const [endereco, setEndereco] = useState<Partial<IEndereco>>({
    cidade: "",
  });

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
              value={endereco.cidade}
              onChangeText={(text) =>
                setEndereco((prev) => ({
                  ...prev,
                  nome: text.slice(0, 30),
                }))
              }
            />
          </View>
        </View>
        <View style={globalStyles.buttonRowContainer}>
          <TouchableOpacity
            style={[globalStyles.button, { flex: 1 }]}
            // onPress={editar}
          >
            <Text style={globalStyles.buttonText}>Salvar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              globalStyles.button,
              { flex: 1, backgroundColor: "#B30F03" },
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
