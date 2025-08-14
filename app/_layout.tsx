import { Slot, useRouter, usePathname } from "expo-router";
import { useAuth, AuthProvider } from "../context/auth";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider } from "../context/ThemeContext";
import { TipoAcessoProvider } from "../context/tipoAcessoContext";
import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";

function LayoutWithAuthCheck() {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    // Evita redirecionar se já estiver na página de login
    if (!isAuthenticated && pathname !== "/") {
      logout();
      router.replace("/");
    }
  }, [isMounted, isAuthenticated, pathname]);

  if (!isMounted) {
    // Evita "piscar" a tela errada
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Slot />;
}

export default function Layout() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <TipoAcessoProvider>
          <StatusBar hidden />
          <LayoutWithAuthCheck />
        </TipoAcessoProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
