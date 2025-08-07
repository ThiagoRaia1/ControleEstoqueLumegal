import { httpClient } from "../adapters/httpClient";
import { ICriarEpi, IEpi } from "../interfaces/epi";

export async function getEpis() {
  const epis: IEpi[] = await httpClient("/epi", {
    method: "GET",
  });

  // Ordena por nome em ordem alfabética
  epis.sort((a, b) =>
    a.nome.localeCompare(b.nome, "pt-BR", { sensitivity: "base" })
  );

  return epis;
}

export async function getEpisEmFalta() {
  const episEmFalta: IEpi[] = await httpClient("/epi/emFalta", {
    method: "GET",
  });

  // Ordena por nome em ordem alfabética
  episEmFalta.sort((a, b) =>
    a.nome.localeCompare(b.nome, "pt-BR", { sensitivity: "base" })
  );

  return episEmFalta;
}

export async function registrarEpiApi(epi: ICriarEpi) {
  return await httpClient("/epi", {
    method: "POST",
    body: JSON.stringify(epi),
  });
}

export async function editarEpiApi(nome: string, epi: ICriarEpi) {
  return await httpClient(`/epi/editarDados/${nome}`, {
    method: "PATCH",
    body: JSON.stringify(epi),
  });
}

export async function excluirEpiApi(id: string) {
  return await httpClient(`/epi/excluir/${id}`, {
    method: "DELETE",
  });
}
