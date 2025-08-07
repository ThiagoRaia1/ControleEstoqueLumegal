import { View, TextInput, StyleSheet } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { useThemeContext } from "../../context/themeContext";
import { getGlobalStyles } from "../../globalStyles";

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
}

export default function SearchBar({
  placeholder = "Pesquisar...",
  value,
  onChangeText,
}: SearchBarProps) {
  const { theme } = useThemeContext();
  const globalStyles = getGlobalStyles(theme);

  return (
    <View style={globalStyles.searchBar}>
      <Feather
        name="search"
        size={30}
        color={theme === "light" ? "black" : "white"}
        style={{ paddingHorizontal: 10 }}
      />
      <TextInput
        style={[styles.input, { color: theme === "light" ? "black" : "white" }]}
        placeholder={placeholder}
        placeholderTextColor="#888"
        onChangeText={onChangeText}
        value={value}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    flex: 1,
    fontSize: 16,
    padding: 5,
    outlineStyle: "none" as any,
  },
});
