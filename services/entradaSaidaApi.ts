import { httpClient } from "../adapters/httpClient";
import { IMovimentacaoEpi } from "../interfaces/entradaSaida";

export async function entradaSaidaApi(movimentacoes: IMovimentacaoEpi[]) {
  return await httpClient("/epi/entradaSaida", {
    method: "PATCH",
    body: JSON.stringify(movimentacoes),
  });
}
