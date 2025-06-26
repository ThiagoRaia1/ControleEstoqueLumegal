import { httpClient } from "../adapters/httpClient";

export async function getEpisEmFalta() {
  return await httpClient("/epi/emFalta", {
    method: "GET",
  });
}
