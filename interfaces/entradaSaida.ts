import { IEpi } from "./epi";

export interface IMovimentacaoEpi {
  id: string;
  quantidade: number;
}

export interface IEntradaSaida {
  id: number;
  quantidade: number;
  data: Date;
  epi: IEpi;
}
