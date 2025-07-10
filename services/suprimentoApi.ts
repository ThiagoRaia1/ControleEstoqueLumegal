import { httpClient } from "../adapters/httpClient";
import { ICriarSuprimento } from "../interfaces/suprimento";

export async function getSuprimentos() {
  return await httpClient("/suprimento", {
    method: "GET",
  });
}

export async function getSuprimentosEmFalta() {
  return await httpClient("/suprimento/emFalta", {
    method: "GET",
  });
}

export async function registrarSuprimentoApi(suprimento: ICriarSuprimento) {
  return await httpClient("/suprimento", {
    method: "POST",
    body: JSON.stringify(suprimento),
  });
}

export async function editarSuprimentoApi(
  nome: string,
  suprimento: ICriarSuprimento
) {
  return await httpClient(`/suprimento/editarDados/${nome}`, {
    method: "PATCH",
    body: JSON.stringify(suprimento),
  });
}

export async function excluirSuprimentoApi(id: string) {
  return await httpClient(`/suprimento/excluir/${id}`, {
    method: "DELETE",
  });
}
