import { httpClient } from "../adapters/httpClient";
import { ICriarSuprimento, ISuprimento } from "../interfaces/suprimento";

export async function getSuprimentos() {
  const suprimentos: ISuprimento[] = await httpClient("/suprimento", {
    method: "GET",
  });

  // Ordena por nome em ordem alfabética
  suprimentos.sort((a, b) =>
    a.nome.localeCompare(b.nome, "pt-BR", { sensitivity: "base" })
  );

  return suprimentos;
}

export async function getSuprimentosEmFalta() {
  const suprimentosEmFalta: ISuprimento[] = await httpClient(
    "/suprimento/emFalta",
    {
      method: "GET",
    }
  );

  // Ordena por nome em ordem alfabética
  suprimentosEmFalta.sort((a, b) =>
    a.nome.localeCompare(b.nome, "pt-BR", { sensitivity: "base" })
  );

  return suprimentosEmFalta;
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
