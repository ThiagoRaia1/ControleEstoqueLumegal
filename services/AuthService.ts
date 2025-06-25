import { IUsuario } from "../context/auth";
import { autenticarLogin } from "../context/api";
import { router } from "expo-router";
import { nomePaginas } from "../utils/nomePaginas";

class AuthService {
  private static instance: AuthService;
  private usuario: IUsuario | null = null;

  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(login: string, senha: string) {
    try {
      const user: IUsuario = await autenticarLogin(login, senha);
      console.log("Usuário autenticado:", user);
      this.usuario = user;
      // console.log("Usuário autenticado:", this.usuario);
      router.push(`${nomePaginas.itensEmFalta}`);
      return user;
    } catch (erro: any) {
      alert("Erro ao autenticar: " + erro.message);
    }
  }

  logout() {
    this.usuario = null;
    router.push("/");
  }

  getUsuario(): IUsuario | null {
    return this.usuario;
  }
}

export default AuthService.getInstance();
