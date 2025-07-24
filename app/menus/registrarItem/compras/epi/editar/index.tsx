import { View } from "react-native-animatable";
import { getGlobalStyles } from "../../../../../../globalStyles";
import { useThemeContext } from "../../../../../../context/ThemeContext";
import MenuSuperior from "../../../../../components/MenuSuperior";
import MenuInferior from "../../../../../components/MenuInferior";
import EpiSuprimentoForm from "../../../../../components/EpiSuprimentoForm";
import { useLocalSearchParams } from "expo-router";

export default function Editar() {
  const { theme } = useThemeContext();
  const globalStyles = getGlobalStyles(theme);

  const params = useLocalSearchParams();

  const tipoItem = typeof params.tipoItem === "string" ? params.tipoItem : "";

  const itemSelecionado =
    typeof params.item === "string" ? JSON.parse(params.item) : {};

  return (
    <View style={globalStyles.background}>
      <MenuSuperior />
      <View style={globalStyles.mainContent}>
        <EpiSuprimentoForm
          tipoItem={tipoItem}
          itemSelecionado={itemSelecionado}
        />
      </View>
      <MenuInferior />
    </View>
  );
}
