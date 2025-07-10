import { IEpi } from "./epi";

export interface IMovimentacaoItem {
  id: string;
  quantidade: number;
}

export interface IEntradaSaida {
  id: number;
  quantidade: number;
  data: Date;
  epi: IEpi;
}
