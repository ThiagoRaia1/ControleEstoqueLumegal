import { httpClient } from "../adapters/httpClient";
import { ICriarCategoriaFornecedor } from "../interfaces/categoriaFornecedor";

export async function registrarCategoriaFornecedorApi(
  categoriaFornecedor: ICriarCategoriaFornecedor
) {
  console.log(categoriaFornecedor);
  return await httpClient("/categoria-fornecedor", {
    method: "POST",
    body: JSON.stringify(categoriaFornecedor),
  });
}

export async function getCategoriasFornecedor() {
  return await httpClient("/categoria-fornecedor", {
    method: "GET",
  });
}

export async function getCategoriasFornecedorPorCategoria(categoria: string) {
  return await httpClient(`/categoria-fornecedor/categoria/${categoria}`, {
    method: "GET",
  });
}
