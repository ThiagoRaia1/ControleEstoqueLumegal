import { httpClient } from "../adapters/httpClient";

export interface IEpi {
  _id?: string;
  nome?: string;
  descricao?: string;
  certificadoAprovacao?: string;
  quantidade?: number;
  quantidadeParaAviso?: number;
  tipoUnidade?: string;
  fornecedor?: string;
}

export async function registrarEpiApi(epi: IEpi) {
  console.log("registrarEpiApi", epi);
  return await httpClient("/epi", {
    method: "POST",
    body: JSON.stringify(epi),
  });
}
