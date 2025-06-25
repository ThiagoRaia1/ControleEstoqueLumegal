import { View, StyleSheet, Text, ScrollView } from "react-native";
import * as Animatable from "react-native-animatable";
import MenuInferior from "../../components/MenuInferior";
import BotaoLogout from "../../components/BotaoLogout";
import { useThemeContext } from "../../../context/ThemeContext";

function renderItemEmFalta() {
  const { theme } = useThemeContext();
  return (
    <View
      style={[
        styles.itemEmFalta,
        theme === "light"
          ? { backgroundColor: "white" }
          : { backgroundColor: "#c7c7c7" },
      ]}
    >
      <View style={styles.leftSide}>
        <Text style={styles.dadosEpiText}>Nome: EPI</Text>
        <Text style={styles.dadosEpiText}>C.A.: 13347</Text>
        <Text style={styles.dadosEpiText}>Unidade/Par: Unidade</Text>
      </View>

      <View style={styles.rightSide}>
        <Text
          style={[
            styles.dadosEpiText,
            {
              textAlign: "center",
              color: "white",
            },
          ]}
        >
          Quantidade:{"\n"}10
        </Text>
      </View>
    </View>
  );
}

export default function Inicio() {
  const { theme } = useThemeContext();
  return (
    <View
      style={[
        styles.background,
        theme === "light"
          ? {
              backgroundColor: "#f0f3fa",
            }
          : { backgroundColor: "#1c1c1c" },
      ]}
    >
      <BotaoLogout />
      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            theme === "light" ? { color: "black" } : { color: "white" },
          ]}
        >
          Itens em falta
        </Text>
        <Animatable.View
          animation="fadeInUp"
          duration={1000}
          style={styles.mainContent}
        >
          <ScrollView
            style={[
              styles.itensEmFaltaScroll,
              theme === "light"
                ? { borderColor: "#ccc" }
                : { borderColor: "black" },
            ]}
            contentContainerStyle={[
              styles.scrollContent,
              theme === "light"
                ? { backgroundColor: "white" }
                : { backgroundColor: "#5e5e5e" },
            ]}
            persistentScrollbar={true}
          >
            <View style={{ padding: 20, gap: 20 }}>
              {renderItemEmFalta()}
              {renderItemEmFalta()}
              {renderItemEmFalta()}
              {renderItemEmFalta()}
              {renderItemEmFalta()}
              {renderItemEmFalta()}
              {renderItemEmFalta()}
              {renderItemEmFalta()}
            </View>
          </ScrollView>
        </Animatable.View>
      </View>
      <MenuInferior />
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  content: {
    flex: 1,
    alignItems: "center",
  },
  mainContent: {
    flex: 1,
    width: "100%",
    maxWidth: 700,
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    textAlign: "center",
  },
  itensEmFaltaScroll: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 3,
    alignSelf: "center",
    width: "100%",
    maxWidth: 500,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "flex-start",
  },
  leftSide: {
    flex: 1,
    justifyContent: "space-between",
    height: "100%",
    paddingVertical: 5,
  },
  rightSide: {
    flex: 1,
    height: "100%",
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "#4B366D",
    borderRadius: 10,
  },
  itemEmFalta: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    backgroundColor: "white",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 20,
    width: "100%",
    height: 100,
    gap: 10,
  },
  dadosEpiText: {
    textAlign: "left",
    fontSize: 14,
    color: "black",
    fontWeight: "400",
  },
});
