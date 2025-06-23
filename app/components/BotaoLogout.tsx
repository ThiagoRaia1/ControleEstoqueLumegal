import { Link } from "expo-router";
import { Feather } from "@expo/vector-icons"; // Ícones do Expo

export default function LogoutButton({ style = {} }) {
  return (
    <Link
      href="/"
      style={[{ position: "absolute", right: 10, top: 15, zIndex: 999 }, style]}
    >
      <Feather name="log-out" size={30} color="black" />
    </Link>
  );
}
