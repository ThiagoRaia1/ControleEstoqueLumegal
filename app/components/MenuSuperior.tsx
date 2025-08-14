import { useThemeContext } from "../../context/themeContext";
import { Feather } from "@expo/vector-icons";
import {
  View,
  TouchableOpacity,
  Text,
  useWindowDimensions,
} from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {
  acessoAlmoxarifadoAdm,
  acessoComprasAdm,
  useTipoAcessoContext,
} from "../../context/tipoAcessoContext";
import { useAuth } from "../../context/auth";
import { router } from "expo-router";
import { useState } from "react";
import MenuLateral from "./MenuLateral";

export default function MenuSuperior() {
  const { logout } = useAuth();
  const { tipoAcesso, setTipoAcesso } = useTipoAcessoContext();
  const { theme, toggleTheme } = useThemeContext();
  const { width } = useWindowDimensions();
  const [isMenuLateralVisible, setIsMenuLateralVisible] = useState(false);

  return (
    <>
      <View
        style={[
          {
            flexDirection: "row",
            width: "100%",
            height: 60,
            justifyContent: "space-between",
            padding: 10,
            backgroundColor: theme === "light" ? "#598bff" : "black",
          },
          tipoAcesso !== acessoComprasAdm &&
            tipoAcesso !== acessoAlmoxarifadoAdm && {
              justifyContent: "flex-end",
            },
        ]}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            gap: 10,
            height: "100%",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={{
              paddingVertical: 5,
              paddingHorizontal: 5,
            }}
            onPress={() => setIsMenuLateralVisible(true)}
          >
            <Entypo
              name="menu"
              size={30}
              color={theme === "light" ? "black" : "white"}
            />
          </TouchableOpacity>
          {(tipoAcesso === acessoAlmoxarifadoAdm ||
            tipoAcesso === acessoComprasAdm) && (
            <>
              <TouchableOpacity
                style={[
                  tipoAcesso === acessoComprasAdm && {
                    backgroundColor: theme === "light" ? "#0033A0" : "white",
                  },
                  {
                    borderRadius: 10,
                    paddingVertical: 5,
                    paddingHorizontal: 10,
                  },
                ]}
                onPress={() => setTipoAcesso(acessoComprasAdm)}
              >
                <Entypo
                  name="shop"
                  size={30}
                  color={
                    tipoAcesso === acessoComprasAdm && theme === "light"
                      ? "white"
                      : tipoAcesso === acessoComprasAdm && theme === "dark"
                      ? "#0033A0"
                      : tipoAcesso !== acessoComprasAdm && theme === "light"
                      ? "black"
                      : "white"
                  }
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  tipoAcesso === acessoAlmoxarifadoAdm && {
                    backgroundColor: theme === "light" ? "#0033A0" : "white",
                  },
                  {
                    borderRadius: 10,
                    paddingVertical: 5,
                    paddingHorizontal: 10,
                  },
                ]}
                onPress={() => setTipoAcesso(acessoAlmoxarifadoAdm)}
              >
                <MaterialCommunityIcons
                  name="warehouse"
                  size={30}
                  color={
                    tipoAcesso === acessoAlmoxarifadoAdm && theme === "light"
                      ? "white"
                      : tipoAcesso === acessoAlmoxarifadoAdm && theme === "dark"
                      ? "#0033A0"
                      : tipoAcesso !== acessoAlmoxarifadoAdm &&
                        theme === "light"
                      ? "black"
                      : "white"
                  }
                />
              </TouchableOpacity>
            </>
          )}
        </View>
        <View
          style={{
            width: "18%",
            flexDirection: "row",
            gap: 20,
            height: "100%",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <TouchableOpacity onPress={toggleTheme}>
            <Feather
              name={theme === "light" ? "sun" : "moon"}
              size={30}
              color={theme === "light" ? "black" : "white"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              logout();
              router.push("/");
            }}
          >
            <Feather
              name="log-out"
              size={30}
              color={theme === "light" ? "black" : "white"}
            />
          </TouchableOpacity>
        </View>
      </View>
      {isMenuLateralVisible && (
        <MenuLateral
          visivel={isMenuLateralVisible}
          setVisivel={setIsMenuLateralVisible}
        />
      )}

      <Text
        style={[
          {
            color: theme === "light" ? "black" : "white",
            position: "absolute",
            bottom: 5,
            right: 10,
          },
          width > 532
            ? { fontSize: 20 }
            : width > 495
            ? { fontSize: 18 }
            : { fontSize: 16 },
        ]}
      >
        {(tipoAcesso === acessoAlmoxarifadoAdm ||
          tipoAcesso === acessoComprasAdm) &&
          `${tipoAcesso} - `}
        V2.4.1
      </Text>
    </>
  );
}
