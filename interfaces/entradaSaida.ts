import { IEpi } from "./epi";
import { ISuprimento } from "./suprimento";

export interface IMovimentacaoItem {
  id: string;
  quantidade: number;
}

export interface IEntradaSaidaEpi {
  id: number;
  quantidade: number;
  data: Date;
  epi: IEpi;
}

export interface IEntradaSaidaSuprimento {
  id: number;
  quantidade: number;
  data: Date;
  suprimento: ISuprimento;
}
