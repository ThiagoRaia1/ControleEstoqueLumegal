import { httpClient } from "../adapters/httpClient";

export interface ILoginRequest {
  login: string;
  senha: string;
}

export interface ILoginResponse {
  token: string;
  tipoAcesso: string;
}

export const login = async (data: ILoginRequest): Promise<ILoginResponse> => {
  return await httpClient("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
};
