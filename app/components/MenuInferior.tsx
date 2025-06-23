import { Link, usePathname } from "expo-router";
import { useEffect, useRef } from "react";
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

let prevIndex = 0;

type FeatherIconName = keyof typeof Feather.glyphMap;
const menuItems: { href: string; icon: FeatherIconName; label: string }[] = [
  {
    href: `${nomePaginas.itensEmFalta}`,
    icon: "home",
    label: "ITENS EM FALTA",
  },
  {
    href: `${nomePaginas.registrarEpi}`,
    icon: "clock",
    label: "REGISTRAR EPI",
  },
  {
    href: `${nomePaginas.entradaSaida}`,
    icon: "calendar",
    label: "ENTRADA/SAÍDA",
  },
  {
    href: `${nomePaginas.pesquisar}`,
    icon: "user",
    label: "PESQUISAR",
  },
  {
    href: `${nomePaginas.relatorios}`,
    icon: "user",
    label: "RELATÓRIOS",
  },
];

export default function MenuInferior() {
  const iconSize = 30;
  const pathname = usePathname(); // exemplo: "/menuPrincipal/inicio"
  const screenWidth = Dimensions.get("window").width;
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
  }, [pathname]);

  const isActive = (route: string) => pathname === route;

  return (
    <View style={styles.menu}>
      {/* Fundo branco animado */}
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
                color={active ? "#2AA69F" : "white"}
              />
              <Text style={[styles.text, active && { color: "#2AA69F" }]}>
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
    backgroundColor: "#2AA69F",
    width: "100%",
    height: 70,
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 16,
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
