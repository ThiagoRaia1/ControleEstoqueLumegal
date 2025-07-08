import { View, Text, TouchableOpacity, TextInput } from "react-native";
import * as Animatable from "react-native-animatable";
import MenuSuperior from "../../../components/MenuSuperior";
import { useThemeContext } from "../../../../context/ThemeContext";
import { getGlobalStyles } from "../../../../globalStyles";
import MenuInferior from "../../../components/MenuInferior";
import Carregando from "../../../components/Carregando";
import { useState } from "react";
import { router } from "expo-router";
import { IFornecedor } from "../../../../interfaces/fornecedor";

export default function TipoUnidade() {
  const { theme } = useThemeContext();
  const globalStyles = getGlobalStyles(theme);
  const [carregando, setCarregando] = useState(false);

  const [fornecedor, setFornecedor] = useState<Partial<IFornecedor>>({
    nome: "",
    endereco: [],
    categoriasFornecedor: [],
  });

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
              placeholder="Tipo"
              placeholderTextColor="#888"
              value={fornecedor.nome}
              onChangeText={(text) =>
                setFornecedor((prev) => ({
                  ...prev,
                  nome: text.slice(0, 30),
                }))
              }
            />
          </View>

          <View style={globalStyles.labelInputContainer}>
            <Text style={globalStyles.label}>ENDEREÇOS: *</Text>
            <TextInput
              style={globalStyles.inputEditar}
              placeholder="Endereços"
              placeholderTextColor="#888"
              value={"Verificar como colocar os 3 fornecedores permitidos"}
              //   onChangeText={(text) =>
              //     setTipoUnidade((prev) => ({
              //       ...prev,
              //       nome: text.slice(0, 30),
              //     }))
              //   }
            />
          </View>

          <View style={globalStyles.labelInputContainer}>
            <Text style={globalStyles.label}>CATEGORIAS DO FORNECEDOR: *</Text>
            <TextInput
              style={globalStyles.inputEditar}
              placeholder="Categorias do fornecedor"
              placeholderTextColor="#888"
              value={"Ver como permitir mais de uma categoria"}
              //   onChangeText={(text) =>
              //     setTipoUnidade((prev) => ({
              //       ...prev,
              //       nome: text.slice(0, 30),
              //     }))
              //   }
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
