import { useThemeContext } from "../../context/ThemeContext";
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

export default function MenuSuperior({ style = {} }) {
  const { logout } = useAuth();
  const { tipoAcesso, setTipoAcesso } = useTipoAcessoContext();
  const { theme, toggleTheme } = useThemeContext();
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
          boxShadow: "0px 5px 5px rgba(0, 0, 0, 0.8)",
        },
        tipoAcesso !== acessoComprasAdm &&
          tipoAcesso !== acessoAlmoxarifadoAdm && {
            justifyContent: "flex-end",
          },
        theme === "light"
          ? { backgroundColor: "#0033A0" }
          : { backgroundColor: "black" },
      ]}
    >
      {(tipoAcesso === acessoAlmoxarifadoAdm ||
        tipoAcesso === acessoComprasAdm) && (
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
              tipoAcesso === acessoComprasAdm && {
                backgroundColor: "white",
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
              color={tipoAcesso === acessoComprasAdm ? "#0033A0" : "white"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              tipoAcesso === acessoAlmoxarifadoAdm && {
                backgroundColor: "white",
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
              color={tipoAcesso === acessoAlmoxarifadoAdm ? "#0033A0" : "white"}
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
            {"Tipo de acesso: " + tipoAcesso}
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

        <TouchableOpacity
          onPress={() => {
            logout();
            router.push("/");
          }}
        >
          <Feather name="log-out" size={30} color={"white"} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
