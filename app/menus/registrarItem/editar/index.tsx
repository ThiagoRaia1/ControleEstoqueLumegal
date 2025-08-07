import { View } from "react-native-animatable";
import { getGlobalStyles } from "../../../../globalStyles";
import { useThemeContext } from "../../../../context/themeContext";
import MenuSuperior from "../../../components/MenuSuperior";
import EpiSuprimentoForm from "../../../components/EpiSuprimentoForm";
import { useLocalSearchParams } from "expo-router";
import TipoUnidadeForm from "../../../components/TipoUnidadeForm";
import FornecedorForm from "../../../components/FornecedorForm";
import EnderecoForm from "../../../components/EnderecoForm";
import CategoriaFornecedorForm from "../../../components/CategoriaFornecedorForm";
import MenuLateral from "../../../components/MenuLateral";
import { useState } from "react";

export default function Editar() {
  const { theme } = useThemeContext();
  const globalStyles = getGlobalStyles(theme);
  const [isMenuLateralVisivel, setIsMenuLateralVisivel] = useState(false);

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
      <MenuLateral
        visivel={isMenuLateralVisivel}
        setVisivel={setIsMenuLateralVisivel}
      />
    </View>
  );
}
