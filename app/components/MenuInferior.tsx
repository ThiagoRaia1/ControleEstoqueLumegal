import { Link, usePathname } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Easing,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { nomePaginas } from "../../utils/nomePaginas";
import { useThemeContext } from "../../context/ThemeContext";
import {
  acessoAlmoxarifado,
  acessoAlmoxarifadoAdm,
  acessoCompras,
  acessoComprasAdm,
  useTipoAcessoContext,
} from "../../context/tipoAcessoContext";

let prevIndex = 0;

export default function MenuInferior() {
  const { tipoAcesso } = useTipoAcessoContext();
  const { theme } = useThemeContext();
  const iconSize = 30;
  const pathname = usePathname();

  type FeatherIconName = keyof typeof Feather.glyphMap;
  const menuItems: { href: string; icon: FeatherIconName; label: string }[] = [
    {
      href: `${nomePaginas.itensEmFalta}`,
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
      href: `${nomePaginas.entradaSaida}`,
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

  const [screenWidth, setScreenWidth] = useState(
    Dimensions.get("window").width
  );

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setScreenWidth(window.width);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const itemWidth = screenWidth / menuItems.length;
  const translateX = useRef(new Animated.Value(prevIndex * itemWidth)).current;

  useEffect(() => {
    const activeIndex = menuItems.findIndex((item) => item.href === pathname);
    Animated.timing(translateX, {
      toValue: activeIndex * itemWidth,
      duration: 250,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
    prevIndex = activeIndex;
  }, [pathname, itemWidth]);

  const isActive = (route: string) => pathname === route;

  return (
    <View
      style={[
        styles.menu,
        theme === "light"
          ? { backgroundColor: "#0033a0" }
          : { backgroundColor: "black" },
      ]}
    >
      <Animated.View
        style={[
          styles.activeBackground,
          {
            transform: [{ translateX }],
            width: itemWidth - 10,
          },
        ]}
      />
      {menuItems.map(({ href, icon, label }) => {
        const active = isActive(href);
        return (
          <Link key={href} href={href} asChild>
            <TouchableOpacity
              style={{
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
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
                  screenWidth > 600
                    ? { fontSize: 14 }
                    : screenWidth > 420
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
  );
}

const styles = StyleSheet.create({
  menu: {
    width: "100%",
    height: 70,
    flexDirection: "row",
    alignItems: "center",
    boxShadow: "0px -5px 5px rgba(0, 0, 0, 0.8)",
  },
  text: {
    color: "white",
    fontWeight: "600",
  },
  activeBackground: {
    position: "absolute",
    height: "85%",
    backgroundColor: "white",
    borderRadius: 15,
    zIndex: 0,
    left: 5,
  },
});
