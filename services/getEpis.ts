import { httpClient } from "../adapters/httpClient";

export async function getEpis() {
  return await httpClient("/epi", {
    method: "GET",
  });
}
