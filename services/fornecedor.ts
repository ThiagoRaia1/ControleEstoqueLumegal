import { httpClient } from "../adapters/httpClient";

export async function getFornecedores() {
  return await httpClient("/fornecedor", {
    method: "GET",
  });
}

export async function getFornecedorPorNome(nome: string) {
  return await httpClient(`/fornecedor/nome/${nome}`, {
    method: "GET",
  });
}