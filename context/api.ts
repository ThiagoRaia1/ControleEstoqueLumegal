import { httpClient } from "../adapters/httpClient";

export async function autenticarLogin(login: string, senha: string) {
  return await httpClient("/usuario/login", {
    method: "POST",
    body: JSON.stringify({ login, senha }),
  });
}
