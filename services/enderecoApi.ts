import { httpClient } from "../adapters/httpClient";
import { ICriarEndereco } from "../interfaces/endereco";

export async function registrarEnderecoApi(endereco: ICriarEndereco) {
  console.log(endereco);
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
  return await httpClient("/endereco", {
    method: "GET",
  });
}
