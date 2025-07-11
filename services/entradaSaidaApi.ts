import { httpClient } from "../adapters/httpClient";
import { IMovimentacaoItem } from "../interfaces/entradaSaida";

export async function getEntradasSaidasEpi(
  dataInicial: string,
  dataFinal: string
) {
  return await httpClient(`/entrada-saida-epi/${dataInicial}/${dataFinal}`, {
    method: "GET",
  });
}

export async function getEntradasSaidasSuprimento(
  dataInicial: string,
  dataFinal: string
) {
  return await httpClient(
    `/entrada-saida-suprimento/${dataInicial}/${dataFinal}`,
    {
      method: "GET",
    }
  );
}

export async function entradaSaidaEpiApi(movimentacoes: IMovimentacaoItem[]) {
  const registroEntradaSaida = movimentacoes.map(({ id, quantidade }) => ({
    idEpi: id,
    quantidade,
  }));

  const [resEpi, resEntradaSaida] = await Promise.all([
    httpClient("/epi/entradaSaida", {
      method: "PATCH",
      body: JSON.stringify(movimentacoes),
    }),
    httpClient("/entrada-saida-epi", {
      method: "POST",
      body: JSON.stringify(registroEntradaSaida),
    }),
  ]);

  return {
    epi: resEpi,
    entradaSaida: resEntradaSaida,
  };
}

export async function entradaSaidaSuprimentoApi(
  movimentacoes: IMovimentacaoItem[]
) {
  const registroEntradaSaida = movimentacoes.map(({ id, quantidade }) => ({
    idSuprimento: id,
    quantidade,
  }));

  const [resSuprimento, resEntradaSaida] = await Promise.all([
    httpClient("/suprimento/entradaSaida", {
      method: "PATCH",
      body: JSON.stringify(movimentacoes),
    }),
    httpClient("/entrada-saida-suprimento", {
      method: "POST",
      body: JSON.stringify(registroEntradaSaida),
    }),
  ]);

  return {
    epi: resSuprimento,
    entradaSaida: resEntradaSaida,
  };
}
