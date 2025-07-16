import { useEffect } from "react";
import { nomePaginas } from "../../../utils/nomePaginas";
import { router } from "expo-router";
import {
  acessoAlmoxarifado,
  acessoAlmoxarifadoAdm,
  acessoCompras,
  acessoComprasAdm,
  useTipoAcessoContext,
} from "../../../context/tipoAcessoContext";

export default function EntradaSaida() {
  const { tipoAcesso } = useTipoAcessoContext();

  useEffect(() => {
    switch (tipoAcesso) {
      case acessoCompras:
      case acessoComprasAdm:
        router.push(nomePaginas.entradaSaida.compras);
        break;
      case acessoAlmoxarifado:
      case acessoAlmoxarifadoAdm:
        router.push(nomePaginas.entradaSaida.almoxarifado);
        break;
      default:
        alert("Erro ao redirecionar, por favor realize o login novamente.");
        router.push("/");
    }
  }, [tipoAcesso]);

  return null;
}
