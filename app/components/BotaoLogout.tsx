import { Link } from "expo-router";
import { Feather } from "@expo/vector-icons"; // Ícones do Expo
import { View } from "react-native";

export default function LogoutButton({ style = {} }) {
  return (
    <View
      style={{
        width: "100%",
        height: "5%",
        justifyContent: "center",
        alignItems: "flex-end",
        paddingRight: 10,
      }}
    >
      <Link href="/" style={[{ zIndex: 999 }, style]}>
        <Feather name="log-out" size={30} color="black" />
      </Link>
    </View>
  );
}
