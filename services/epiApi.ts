import { httpClient } from "../adapters/httpClient";
import { ICriarEpi } from "../interfaces/epi";

export async function getEpis() {
  return await httpClient("/epi", {
    method: "GET",
  });
}

export async function getEpisEmFalta() {
  return await httpClient("/epi/emFalta", {
    method: "GET",
  });
}

export async function registrarEpiApi(epi: ICriarEpi) {
  return await httpClient("/epi", {
    method: "POST",
    body: JSON.stringify(epi),
  });
}

export async function editarEpiApi(nome: string, epi: ICriarEpi) {
  return await httpClient(`/epi/${nome}`, {
    method: "PATCH",
    body: JSON.stringify(epi),
  });
}

export async function excluirEpiApi(id: string) {
  return await httpClient(`/epi/excluir/${id}`, {
    method: "DELETE",
  });
}
