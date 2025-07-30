import { View } from "react-native-animatable";
import { getGlobalStyles } from "../../../../globalStyles";
import { useThemeContext } from "../../../../context/ThemeContext";
import MenuSuperior from "../../../components/MenuSuperior";
import MenuInferior from "../../../components/MenuInferior";
import EpiSuprimentoForm from "../../../components/EpiSuprimentoForm";
import { useLocalSearchParams } from "expo-router";
import TipoUnidadeForm from "../../../components/TipoUnidadeForm";
import FornecedorForm from "../../../components/FornecedorForm";
import EnderecoForm from "../../../components/EnderecoForm";
import CategoriaFornecedorForm from "../../../components/CategoriaFornecedorForm";

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
        {(tipoItem === "epi" || tipoItem === "suprimento") && (
          <EpiSuprimentoForm
            tipoItem={tipoItem}
            itemSelecionado={itemSelecionado}
          />
        )}
        {tipoItem === "tipoUnidade" && (
          <TipoUnidadeForm itemSelecionado={itemSelecionado} />
        )}
        {tipoItem === "fornecedor" && (
          <FornecedorForm itemSelecionado={itemSelecionado} />
        )}
        {tipoItem === "categoriaFornecedor" && (
          <CategoriaFornecedorForm itemSelecionado={itemSelecionado} />
        )}
        {tipoItem === "endereco" && (
          <EnderecoForm itemSelecionado={itemSelecionado} />
        )}
      </View>
      <MenuInferior />
    </View>
  );
}
