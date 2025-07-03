import { httpClient } from "../adapters/httpClient";
import { IMovimentacaoEpi } from "../interfaces/entradaSaida";

export async function getEntradasSaidas(
  dataInicial: string,
  dataFinal: string
) {
  return await httpClient(`/entrada-saida/${dataInicial}/${dataFinal}`, {
    method: "GET",
  });
}

export async function entradaSaidaApi(movimentacoes: IMovimentacaoEpi[]) {
  const registroEntradaSaida = movimentacoes.map(({ id, quantidade }) => ({
    idEpi: id,
    quantidade,
  }));

  const [resEpi, resEntradaSaida] = await Promise.all([
    httpClient("/epi/entradaSaida", {
      method: "PATCH",
      body: JSON.stringify(movimentacoes),
    }),
    httpClient("/entrada-saida", {
      method: "POST",
      body: JSON.stringify(registroEntradaSaida),
    }),
  ]);

  return {
    epi: resEpi,
    entradaSaida: resEntradaSaida,
  };
}
