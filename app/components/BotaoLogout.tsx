import { useThemeContext } from "../../context/ThemeContext";
import { Feather } from "@expo/vector-icons";
import { View, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import { useAuth } from "../../context/auth";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function LogoutButton({ style = {} }) {
  const { theme, toggleTheme } = useThemeContext();
  const { usuario, setUsuario } = useAuth();

  function renderThemeLogoutButtons() {
    return (
      <View
        style={{
          flex: 1,
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

        <Link href="/" style={[{ zIndex: 999 }, style]}>
          <Feather
            name="log-out"
            size={30}
            color={theme === "light" ? "black" : "white"}
          />
        </Link>
      </View>
    );
  }

  return (
    <View
      style={{
        flexDirection: "row",
        gap: 20,
        width: "100%",
        height: "5%",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 10,
      }}
    >
      {usuario.tipoAcesso === "AlmoxarifadoAdm" ||
      usuario.tipoAcesso === "ComprasAdm" ? (
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            gap: 20,
            height: "100%",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => setUsuario({ ...usuario, tipoAcesso: "ComprasAdm" })}
          >
            <Entypo
              name="shop"
              size={30}
              color={theme === "light" ? "black" : "white"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              setUsuario({ ...usuario, tipoAcesso: "AlmoxarifadoAdm" })
            }
          >
            <MaterialCommunityIcons
              name="warehouse"
              size={30}
              color={theme === "light" ? "black" : "white"}
            />
          </TouchableOpacity>
          {renderThemeLogoutButtons()}
        </View>
      ) : (
        renderThemeLogoutButtons()
      )}
    </View>
  );
}
