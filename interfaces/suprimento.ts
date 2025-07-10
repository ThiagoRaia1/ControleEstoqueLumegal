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
}

export interface ICriarSuprimento {
  nome: string;
  descricao?: string;
  quantidade: number;
  quantidadeParaAviso: number;
  tipoUnidadeId: number;
  fornecedores?: number[];
  preco?: string;
}
