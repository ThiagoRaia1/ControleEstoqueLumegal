import { Link, usePathname } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from "react-native";
import { Entypo, Feather } from "@expo/vector-icons";
import { nomePaginas } from "../../utils/nomePaginas";
import { useThemeContext } from "../../context/ThemeContext";
import {
  acessoAlmoxarifado,
  acessoAlmoxarifadoAdm,
  acessoCompras,
  acessoComprasAdm,
  useTipoAcessoContext,
} from "../../context/tipoAcessoContext";

interface Props {
  visivel?: boolean;
  setVisivel: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function MenuLateral({ visivel = true, setVisivel }: Props) {
  const { tipoAcesso } = useTipoAcessoContext();
  const { theme } = useThemeContext();
  const iconSize = 30;
  const pathname = usePathname();
  const menuWidth = 250;

  const slideAnim = useRef(new Animated.Value(-menuWidth)).current;

  const menuItems: {
    href: string;
    icon: keyof typeof Feather.glyphMap;
    label: string;
  }[] = [
    {
      href: `${nomePaginas.itensEmFalta.main}`,
      icon: "archive",
      label: "ITENS EM FALTA",
    },
    {
      href: `${nomePaginas.registrarItem.main}`,
      icon: "package",
      label:
        tipoAcesso === acessoAlmoxarifado ||
        tipoAcesso === acessoAlmoxarifadoAdm
          ? "REGISTRAR EPI"
          : tipoAcesso === acessoCompras || tipoAcesso === acessoComprasAdm
          ? "REGISTRAR ITEM"
          : "",
    },
    {
      href: `${nomePaginas.entradaSaida.main}`,
      icon: "edit",
      label: "ENTRADA/SAÍDA",
    },
    {
      href: `${nomePaginas.pesquisar}`,
      icon: "search",
      label: "PESQUISAR",
    },
    {
      href: `${nomePaginas.relatorios}`,
      icon: "file",
      label: "RELATÓRIOS",
    },
  ];

  const [screenHeight, setScreenHeight] = useState(
    Dimensions.get("window").height
  );

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setScreenHeight(window.height);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const isActive = (route: string) => pathname.startsWith(route);

  useEffect(() => {
    if (visivel) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -menuWidth,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visivel]);

  return visivel ? (
    <>
      <TouchableOpacity
        style={{
          position: "absolute",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          width: "100%",
          height: "100%",
          zIndex: 1,
        }}
        activeOpacity={1}
        onPress={() => setVisivel(false)}
      />
      <Animated.View
        style={[
          styles.menu,
          {
            transform: [{ translateX: slideAnim }],
            width: menuWidth,
            backgroundColor: theme === "light" ? "#0033a0" : "black",
          },
        ]}
      >
        <TouchableOpacity
          style={{
            backgroundColor: "white",
            width: "100%",
            height: 40,
            justifyContent: "center",
            paddingHorizontal: 5,
          }}
          onPress={() => setVisivel(false)}
        >
          <Entypo name={"cross"} size={iconSize} color="black" />
        </TouchableOpacity>

        <View
          style={{
            height: screenHeight - 40,
            width: "100%",
            alignItems: "center",
            paddingVertical: 20,
          }}
        >
          {menuItems.map(({ href, icon, label }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                asChild
                style={{
                  width: "80%",
                  marginBottom: 10,
                }}
              >
                <TouchableOpacity
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: active ? "white" : "transparent",
                    borderRadius: 20,
                  }}
                >
                  <Feather
                    name={icon}
                    size={iconSize}
                    color={active ? "#0033a0" : "white"}
                  />
                  <Text
                    style={[
                      styles.text,
                      active && { color: "#0033a0" },
                      screenHeight > 600
                        ? { fontSize: 14 }
                        : screenHeight > 420
                        ? { fontSize: 10 }
                        : { fontSize: 8 },
                    ]}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              </Link>
            );
          })}
        </View>
      </Animated.View>
    </>
  ) : null;
}

const styles = StyleSheet.create({
  menu: {
    position: "absolute",
    height: "100%",
    alignItems: "center",
    zIndex: 999,
    left: 0,
    top: 0,
  },
  text: {
    color: "white",
    fontWeight: "600",
  },
});
