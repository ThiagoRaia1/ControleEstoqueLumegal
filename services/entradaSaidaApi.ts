import { httpClient } from "../adapters/httpClient";

export interface IMovimentacaoEpi {
  _id: string;
  quantidade: number;
}

export async function entradaSaidaApi(movimentacoes: IMovimentacaoEpi[]) {
  return await httpClient("/epi/entradaSaida", {
    method: "PATCH",
    body: JSON.stringify(movimentacoes),
  });
}
