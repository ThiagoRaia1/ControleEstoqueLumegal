import { useThemeContext } from "../../context/ThemeContext";
import { Feather } from "@expo/vector-icons";
import { View, TouchableOpacity } from "react-native";
import { Link } from "expo-router";

export default function LogoutButton({ style = {} }) {
  const { theme, toggleTheme } = useThemeContext();

  return (
    <View
      style={{
        flexDirection: "row",
        gap: 20,
        width: "100%",
        height: "5%",
        justifyContent: "flex-end",
        alignItems: "flex-end",
        paddingRight: 10,
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
