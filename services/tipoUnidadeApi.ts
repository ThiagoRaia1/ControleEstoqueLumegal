import { httpClient } from "../adapters/httpClient";

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