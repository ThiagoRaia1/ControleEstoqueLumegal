import { ICategoriaFornecedor } from "./categoriaFornecedor";
import { IEndereco } from "./endereco";

export interface IFornecedor {
    id: number,
    nome: string,
    endereco: IEndereco[],
    categoriasFornecedor: ICategoriaFornecedor[]
}

export interface ICriarFornecedor {
    nome: string,
    enderecos: number[],
    categoriasFornecedor: number[]
}