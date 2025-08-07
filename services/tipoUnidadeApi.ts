import { httpClient } from "../adapters/httpClient";
import { ICriarTipoUnidade, ITipoUnidade } from "../interfaces/tipoUnidade";

export async function getTiposUnidade() {
  const tiposUnidade: ITipoUnidade[] = await httpClient(`/tipo-unidade`, {
    method: "GET",
  });

  // Ordena por nome em ordem alfabética
  tiposUnidade.sort((a, b) =>
    a.tipo.localeCompare(b.tipo, "pt-BR", { sensitivity: "base" })
  );

  return tiposUnidade;
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

export async function editarTipoUnidadeApi(
  idOriginal: number,
  tipo: ICriarTipoUnidade
) {
  return await httpClient(`/tipo-unidade/editar/${idOriginal}`, {
    method: "PATCH",
    body: JSON.stringify(tipo),
  });
}
