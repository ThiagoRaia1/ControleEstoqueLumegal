import { httpClient } from "../adapters/httpClient";
import {
  ICategoriaFornecedor,
  ICriarCategoriaFornecedor,
} from "../interfaces/categoriaFornecedor";

export async function registrarCategoriaFornecedorApi(
  categoriaFornecedor: ICriarCategoriaFornecedor
) {
  return await httpClient("/categoria-fornecedor", {
    method: "POST",
    body: JSON.stringify(categoriaFornecedor),
  });
}

export async function getCategoriasFornecedor() {
  const categoriasFornecedor: ICategoriaFornecedor[] = await httpClient(
    "/categoria-fornecedor",
    {
      method: "GET",
    }
  );

  // Ordena por nome em ordem alfabética
  categoriasFornecedor.sort((a, b) =>
    a.categoria.localeCompare(b.categoria, "pt-BR", { sensitivity: "base" })
  );

  return categoriasFornecedor;
}

export async function getCategoriaFornecedorPorCategoria(categoria: string) {
  return await httpClient(`/categoria-fornecedor/categoria/${categoria}`, {
    method: "GET",
  });
}

export async function editarCategoriaFornecedorApi(
  idOriginal: number,
  categoria: ICriarCategoriaFornecedor
) {
  return await httpClient(`/categoria-fornecedor/editar/${idOriginal}`, {
    method: "PATCH",
    body: JSON.stringify(categoria),
  });
}
