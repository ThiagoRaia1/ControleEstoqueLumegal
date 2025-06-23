import { View, StyleSheet, Text, ScrollView } from "react-native";
import * as Animatable from "react-native-animatable";
import MenuInferior from "../../components/MenuInferior";
import BotaoLogout from "../../components/BotaoLogout";

function renderItemEmFalta() {
  return (
    <View style={styles.itemEmFalta}>
      
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
  return (
    <View style={[styles.background, { flex: 1 }]}>
      <View style={styles.content}>
        <BotaoLogout />
        <Text style={styles.title}>Itens em falta</Text>
        <Animatable.View
          animation="fadeInUp"
          duration={1000}
          style={styles.mainContent}
        >
          <ScrollView
            style={styles.itensEmFaltaScroll}
            contentContainerStyle={styles.scrollContent}
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
  background: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "#f0f3fa",
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "white",
    textAlign: "center",
    textShadowColor: "black", // Cor da borda
    textShadowOffset: { width: 1, height: 1 }, // Espessura da sombra
    textShadowRadius: 10, // Suaviza a borda
  },
  itensEmFaltaScroll: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#ccc",
    alignSelf: "center",
    width: "100%",
    maxWidth: 500,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "flex-start",
    backgroundColor: "white",
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
