import { useThemeContext } from "../../context/ThemeContext";
import { Feather } from "@expo/vector-icons";
import {
  View,
  TouchableOpacity,
  Text,
  useWindowDimensions,
} from "react-native";
import { Link } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import { useAuth } from "../../context/auth";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export const acessoComprasAdm = "ComprasAdm";
export const acessoAlmoxarifadoAdm = "AlmoxarifadoAdm";

export default function MenuSuperior({ style = {} }) {
  const { theme, toggleTheme } = useThemeContext();
  const { usuario, setUsuario } = useAuth();
  const { width } = useWindowDimensions();

  return (
    <View
      style={[
        {
          flexDirection: "row",
          width: "100%",
          height: "5%",
          justifyContent: "space-between",
          paddingHorizontal: 10,
          marginBottom: 20,
          backgroundColor: "black",
        },
        (usuario.tipoAcesso !== acessoComprasAdm ||
          usuario.login !== acessoAlmoxarifadoAdm) && {
          justifyContent: "flex-end",
        },
        theme === "light"
          ? { backgroundColor: "#0033A0" }
          : { backgroundColor: "black" },
      ]}
    >
      {(usuario.tipoAcesso === acessoAlmoxarifadoAdm ||
        usuario.tipoAcesso === acessoComprasAdm) && (
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
            style={[
              usuario.tipoAcesso === acessoComprasAdm && {
                backgroundColor: "white",
              },
              {
                borderRadius: 10,
                paddingVertical: 5,
                paddingHorizontal: 10,
              },
            ]}
            onPress={() =>
              setUsuario({ ...usuario, tipoAcesso: acessoComprasAdm })
            }
          >
            <Entypo
              name="shop"
              size={30}
              color={
                usuario.tipoAcesso === acessoComprasAdm ? "#0033A0" : "white"
              }
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              usuario.tipoAcesso === acessoAlmoxarifadoAdm && {
                backgroundColor: "white",
              },
              {
                borderRadius: 10,
                paddingVertical: 5,
                paddingHorizontal: 10,
              },
            ]}
            onPress={() =>
              setUsuario({ ...usuario, tipoAcesso: acessoAlmoxarifadoAdm })
            }
          >
            <MaterialCommunityIcons
              name="warehouse"
              size={30}
              color={
                usuario.tipoAcesso === acessoAlmoxarifadoAdm ? "#0033A0" : "white"
              }
            />
          </TouchableOpacity>
          <Text
            style={[
              { color: "white", paddingVertical: 5, paddingHorizontal: 10 },
              width > 532
                ? { fontSize: 20 }
                : width > 495
                ? { fontSize: 18 }
                : { fontSize: 16 },
            ]}
          >
            {"Tipo de acesso: " + usuario.tipoAcesso}
          </Text>
        </View>
      )}
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
            color={"white"}
          />
        </TouchableOpacity>

        <Link href="/" style={[{ zIndex: 999 }, style]}>
          <Feather name="log-out" size={30} color={"white"} />
        </Link>
      </View>
    </View>
  );
}
