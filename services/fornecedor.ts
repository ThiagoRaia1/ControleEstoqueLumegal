import { httpClient } from "../adapters/httpClient";
import { ICriarFornecedor } from "../interfaces/fornecedor";

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

export async function registrarFornecedorApi(fornecedor: ICriarFornecedor) {
  console.log(fornecedor);
  return await httpClient("/fornecedor", {
    method: "POST",
    body: JSON.stringify(fornecedor),
  });
}
