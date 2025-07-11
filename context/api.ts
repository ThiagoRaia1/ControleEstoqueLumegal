import { httpClient } from "../adapters/httpClient";

export async function autenticarLogin(login: string, senha: string) {
  return await httpClient("/auth/login", {
    method: "POST",
    body: JSON.stringify({ login, senha }),
  });
}
