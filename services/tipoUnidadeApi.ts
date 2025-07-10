import { httpClient } from "../adapters/httpClient";
import { ICriarTipoUnidade } from "../interfaces/tipoUnidade";

export async function getTiposUnidade() {
  return await httpClient(`/tipo-unidade`, {
    method: "GET",
  });
}

export async function getTipoUnidade(tipo: string) {
  return await httpClient(`/tipo-unidade/tipo/${tipo}`, {
    method: "GET",
  });
}

export async function registrarTipoUnidadeApi(tipo: ICriarTipoUnidade) {
  return await httpClient("/tipo-unidade", {
    method: "POST",
    body: JSON.stringify(tipo),
  });
}
