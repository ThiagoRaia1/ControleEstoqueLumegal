import { IFornecedor } from "./fornecedor";
import { ITipoUnidade } from "./tipoUnidade";

export interface IEpi {
  id: string;
  nome: string;
  descricao?: string;
  certificadoAprovacao?: string;
  quantidade?: number;
  quantidadeParaAviso: number;
  tipoUnidade: ITipoUnidade;
  fornecedores: IFornecedor[];
  preco?: string
}

export interface ICriarEpi {
  nome: string;
  descricao?: string;
  certificadoAprovacao?: string;
  quantidade: number;
  quantidadeParaAviso: number;
  tipoUnidadeId: number;
  fornecedores?: number[];
  preco?: string
}
