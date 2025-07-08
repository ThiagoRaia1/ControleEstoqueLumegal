import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { useThemeContext } from "../../../context/ThemeContext";
import MenuSuperior from "../../components/MenuSuperior";
import MenuInferior from "../../components/MenuInferior";
import { useEffect } from "react";
import Entypo from "@expo/vector-icons/Entypo";
import { useAuth } from "../../../context/auth";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { getGlobalStyles } from "../../../globalStyles";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import { nomePaginas } from "../../../utils/nomePaginas";

export default function RegistrarEpi() {
  const { theme } = useThemeContext();
  const globalStyles = getGlobalStyles(theme);
  const { usuario } = useAuth();

  useEffect(() => {
    if (
      usuario.tipoAcesso === "Almoxarifado" ||
      usuario.tipoAcesso === "AlmoxarifadoAdm"
    ) {
      router.push(nomePaginas.registrarItem.registrarEpi);
    }
  }, []);

  return (
    <View style={globalStyles.background}>
      <MenuSuperior />
      <Text style={globalStyles.title}>
        REGISTRAR ITEM
      </Text>
      <Animatable.View
        animation="fadeInUp"
        duration={1000}
        style={globalStyles.mainContent}
      >
        <View
          style={{
            flex: 1,
            width: "100%",
            justifyContent: "space-evenly",
          }}
        >
          <TouchableOpacity
            style={globalStyles.optionButton}
            onPress={() => {
              router.push(nomePaginas.registrarItem.registrarSuprimento);
            }}
          >
            <Text style={globalStyles.optionButtonText}>
              REGISTRAR SUPRIMENTO
            </Text>
            <Entypo
              name="shop"
              size={28}
              color={theme === "light" ? "black" : "white"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={globalStyles.optionButton}
            onPress={() => {
              router.push(nomePaginas.registrarItem.registrarEpi);
            }}
          >
            <Text style={globalStyles.optionButtonText}>REGISTRAR EPI</Text>
            <MaterialCommunityIcons
              name="warehouse"
              size={28}
              color={theme === "light" ? "black" : "white"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={globalStyles.optionButton}
            onPress={() => {
              router.push(nomePaginas.registrarItem.registrarFornecedor);
            }}
          >
            <Text style={globalStyles.optionButtonText}>
              REGISTRAR FORNECEDOR
            </Text>
            <AntDesign
              name="contacts"
              size={28}
              color={theme === "light" ? "black" : "white"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={globalStyles.optionButton}
            onPress={() => {
              router.push(nomePaginas.registrarItem.registrartipoUnidade);
            }}
          >
            <Text style={globalStyles.optionButtonText}>
              REGISTRAR TIPO DE UNIDADE
            </Text>
            <AntDesign
              name="tago"
              size={28}
              color={theme === "light" ? "black" : "white"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={globalStyles.optionButton}
            onPress={() => {
              router.push(
                nomePaginas.registrarItem.registrarCategoriaFornecedor
              );
            }}
          >
            <Text style={globalStyles.optionButtonText}>
              REGISTRAR CATEGORIA FORNECEDOR
            </Text>
            <AntDesign
              name="skin"
              size={28}
              color={theme === "light" ? "black" : "white"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={globalStyles.optionButton}
            onPress={() => {
              router.push(nomePaginas.registrarItem.registrarEndereco);
            }}
          >
            <Text style={globalStyles.optionButtonText}>
              REGISTRAR ENDERECO
            </Text>
            <Entypo
              name="address"
              size={28}
              color={theme === "light" ? "black" : "white"}
            />
          </TouchableOpacity>
        </View>
      </Animatable.View>
      <MenuInferior />
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flex: 1,
    gap: 20,
    justifyContent: "center",
  },
  labelInputContainer: {
    gap: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
  },
  input: {
    height: 50,
    width: "100%",
    fontSize: 16,
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  optionButtonsRow: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 20,
  },
});
