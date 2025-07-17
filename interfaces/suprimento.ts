import { IFornecedor } from "./fornecedor";
import { ITipoUnidade } from "./tipoUnidade";

export interface ISuprimento {
  id: string;
  nome: string;
  descricao?: string;
  quantidade?: number;
  quantidadeParaAviso: number;
  tipoUnidade: ITipoUnidade;
  fornecedores: IFornecedor[];
  preco?: string;
  ipi?: number;
}

export interface ICriarSuprimento {
  nome: string;
  descricao?: string;
  quantidade: number;
  quantidadeParaAviso: number;
  tipoUnidadeId: number;
  fornecedores?: number[];
  preco?: string;
  ipi?: number;
}
