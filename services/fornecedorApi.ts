import { httpClient } from "../adapters/httpClient";
import { ICriarFornecedor, IFornecedor } from "../interfaces/fornecedor";

export async function getFornecedores() {
  const fornecedores: IFornecedor[] = await httpClient("/fornecedor", {
    method: "GET",
  });

  // Ordena por nome em ordem alfabética
  fornecedores.sort((a, b) =>
    a.nome.localeCompare(b.nome, "pt-BR", { sensitivity: "base" })
  );

  return fornecedores;
}

export async function getFornecedorPorNome(nome: string) {
  return await httpClient(`/fornecedor/nome/${nome}`, {
    method: "GET",
  });
}

export async function registrarFornecedorApi(fornecedor: ICriarFornecedor) {
  return await httpClient("/fornecedor", {
    method: "POST",
    body: JSON.stringify(fornecedor),
  });
}

export async function editarFornecedorApi(
  nomeOriginal: string,
  fornecedor: ICriarFornecedor
) {
  return await httpClient(`/fornecedor/editar/${nomeOriginal}`, {
    method: "PATCH",
    body: JSON.stringify(fornecedor),
  });
}
