import { Slot } from "expo-router";
import { AuthProvider } from "../context/auth";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider } from "../context/ThemeContext";
import { TipoAcessoProvider } from "../context/tipoAcessoContext";

export default function Layout() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <TipoAcessoProvider>
          <StatusBar hidden />
          <Slot />
        </TipoAcessoProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
