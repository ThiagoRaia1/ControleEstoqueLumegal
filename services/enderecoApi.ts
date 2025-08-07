import { httpClient } from "../adapters/httpClient";
import { ICriarEndereco, IEndereco } from "../interfaces/endereco";

export async function registrarEnderecoApi(endereco: ICriarEndereco) {
  return await httpClient("/endereco", {
    method: "POST",
    body: JSON.stringify(endereco),
  });
}

export async function getEnderecoPorCidade(cidade: string) {
  return await httpClient(`/endereco/cidade/${encodeURIComponent(cidade)}`, {
    method: "GET",
  });
}

export async function getEnderecos() {
  const enderecos: IEndereco[] = await httpClient("/endereco", {
    method: "GET",
  });

  // Ordena por nome em ordem alfabética
  enderecos.sort((a, b) =>
    a.cidade.localeCompare(b.cidade, "pt-BR", { sensitivity: "base" })
  );

  return enderecos;
}

export async function editarEnderecoApi(
  idOriginal: number,
  endereco: ICriarEndereco
) {
  return await httpClient(`/endereco/editar/${idOriginal}`, {
    method: "PATCH",
    body: JSON.stringify(endereco),
  });
}
