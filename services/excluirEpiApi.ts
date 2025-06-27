import { httpClient } from "../adapters/httpClient";

export async function excluirEpiApi(_id: string) {
  return await httpClient(`/epi/excluir/${_id}`, {
    method: "DELETE",
  });
}
