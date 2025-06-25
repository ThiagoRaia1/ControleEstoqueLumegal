import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import * as Animatable from "react-native-animatable";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import MenuInferior from "../../components/MenuInferior";
import BotaoLogout from "../../components/BotaoLogout";
import { useThemeContext } from "../../../context/ThemeContext";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useState } from "react";

export default function Relatorios() {
  const { theme } = useThemeContext();

  const hojeComecoDoDia = new Date();
  hojeComecoDoDia.setUTCHours(0, 0, 0, 0);

  const hojeFinalDoDia = new Date();
  hojeFinalDoDia.setUTCHours(23, 59, 59, 59);

  const [dataInicial, setDataInicial] = useState(hojeComecoDoDia);
  const [dataFinal, setDataFinal] = useState(hojeFinalDoDia);

  const [mostrarPickerInicial, setMostrarPickerInicial] = useState(false);
  const [mostrarPickerFinal, setMostrarPickerFinal] = useState(false);

  function gerarRelatorio(tipoRelatorio: string) {
    try {
      console.log("dataInicial: " + dataInicial.toLocaleString());

      const dataFinalSelecionada = new Date(dataFinal);
      dataFinalSelecionada.setUTCHours(23, 59, 59, 0);

      console.log("dataFinalSelecionada: " + dataFinalSelecionada.toLocaleString());

      if (dataInicial > hojeComecoDoDia) throw new Error("dataInicial > hojeComecoDoDia");
      if (dataInicial > dataFinalSelecionada)
        throw new Error("dataInicial > dataFinalSelecionada");
      if (dataFinalSelecionada > hojeFinalDoDia)
        throw new Error("dataFinalSelecionada > hojeFinalDoDia");

      console.log("Nenhum erro, fazer a lógica dos relatórios aqui");

    } catch (erro: any) {
      switch (erro.message) {
        case "dataInicial > hojeComecoDoDia": {
          alert(
            `A data inicial deve ser menor ou igual ao dia de hoje (${new Date().toLocaleDateString()}).`
          );
          break;
        }
        case "dataInicial > dataFinalSelecionada": {
          alert("A data final deve ser maior que a data inicial.");
          break;
        }
        case "dataFinalSelecionada > hojeFinalDoDia": {
          alert(
            `A data final deve ser menor ou igual ao dia de hoje (${new Date().toLocaleDateString()}).`
          );
          break;
        }
        default: {
          console.log(erro.message);
        }
      }
    } finally {
    }
  }

  return (
    <View
      style={[
        styles.background,
        theme === "light"
          ? { backgroundColor: "#f0f3fa" }
          : { backgroundColor: "#1c1c1c" },
      ]}
    >
      <BotaoLogout />
      <Text
        style={[
          styles.title,
          theme === "light" ? { color: "black" } : { color: "white" },
        ]}
      >
        Gerar relatório
      </Text>
      <Animatable.View
        animation="fadeInUp"
        duration={1000}
        style={styles.mainView}
      >
        <View style={[styles.buttonsView, { alignItems: "flex-end" }]}>
          <View style={styles.alignItems}>
            <Text
              style={[
                { fontSize: 20 },
                theme === "light" ? { color: "black" } : { color: "white" },
              ]}
            >
              Data inicial
            </Text>
            {Platform.OS === "web" ? (
              <input
                type="date"
                value={dataInicial.toISOString().split("T")[0]}
                onChange={(dataInicialStr) => {
                  const novaData = new Date(dataInicialStr.target.value);
                  if (!isNaN(novaData.getTime())) setDataInicial(novaData); // evita erro ao digitar
                }}
                style={{
                  padding: 10,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: theme === "light" ? "black" : "white",
                  backgroundColor: theme === "light" ? "#fff" : "#2a2a2a",
                  color: theme === "light" ? "black" : "white",
                  fontSize: 16,
                }}
              />
            ) : (
              <>
                <TouchableOpacity
                  onPress={() => setMostrarPickerInicial(true)}
                  style={[
                    styles.dataButton,
                    theme === "light"
                      ? { borderColor: "black", backgroundColor: "#fff" }
                      : { borderColor: "white", backgroundColor: "#2a2a2a" },
                  ]}
                >
                  <Text
                    style={[
                      { fontSize: 16 },
                      theme === "light"
                        ? { color: "black" }
                        : { color: "white" },
                    ]}
                  >
                    {dataInicial.toLocaleDateString("pt-BR")}
                  </Text>
                </TouchableOpacity>
                <DateTimePickerModal
                  isVisible={mostrarPickerInicial}
                  mode="date"
                  date={dataInicial}
                  onConfirm={(date) => {
                    setDataInicial(date);
                    setMostrarPickerInicial(false);
                  }}
                  onCancel={() => setMostrarPickerInicial(false)}
                  locale="pt-BR"
                  display={Platform.OS === "ios" ? "inline" : "default"}
                />
              </>
            )}
          </View>

          <View style={styles.alignItems}>
            <Text
              style={[
                { fontSize: 20 },
                theme === "light" ? { color: "black" } : { color: "white" },
              ]}
            >
              Data final
            </Text>
            {Platform.OS === "web" ? (
              <input
                type="date"
                value={dataFinal.toISOString().split("T")[0]}
                onChange={(dataFinalStr) => {
                  const novaData = new Date(dataFinalStr.target.value);
                  novaData.setHours(23, 59, 59, 59);
                  if (!isNaN(novaData.getTime())) setDataFinal(novaData); // evita erro ao digitar
                }}
                style={{
                  padding: 10,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: theme === "light" ? "black" : "white",
                  backgroundColor: theme === "light" ? "#fff" : "#2a2a2a",
                  color: theme === "light" ? "black" : "white",
                  fontSize: 16,
                }}
              />
            ) : (
              <>
                <TouchableOpacity
                  onPress={() => setMostrarPickerFinal(true)}
                  style={[
                    styles.dataButton,
                    theme === "light"
                      ? { borderColor: "black", backgroundColor: "#fff" }
                      : { borderColor: "white", backgroundColor: "#2a2a2a" },
                  ]}
                >
                  <Text
                    style={[
                      { fontSize: 16 },
                      theme === "light"
                        ? { color: "black" }
                        : { color: "white" },
                    ]}
                  >
                    {dataFinal.toLocaleDateString("pt-BR")}
                  </Text>
                </TouchableOpacity>
                <DateTimePickerModal
                  isVisible={mostrarPickerFinal}
                  mode="date"
                  date={dataFinal}
                  onConfirm={(date) => {
                    setDataFinal(date);
                    setMostrarPickerFinal(false);
                  }}
                  onCancel={() => setMostrarPickerFinal(false)}
                  locale="pt-BR"
                  display={Platform.OS === "ios" ? "inline" : "default"}
                />
              </>
            )}
          </View>
        </View>

        <View style={[styles.buttonsView, { alignItems: "flex-start" }]}>
          <View style={styles.alignItems}>
            <TouchableOpacity
              style={[
                styles.gerarRelatorioButton,
                theme === "light"
                  ? { borderColor: "black" }
                  : { borderColor: "white" },
              ]}
              onPress={() => gerarRelatorio("PDF")}
            >
              <Text
                style={[
                  { fontSize: 20 },
                  theme === "light" ? { color: "black" } : { color: "white" },
                ]}
              >
                Gerar PDF
              </Text>
              <AntDesign
                name="pdffile1"
                size={24}
                color={theme === "light" ? "black" : "white"}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.alignItems}>
            <TouchableOpacity
              style={[
                styles.gerarRelatorioButton,
                theme === "light"
                  ? { borderColor: "black" }
                  : { borderColor: "white" },
              ]}
              onPress={() => gerarRelatorio("XLS")}
            >
              <Text
                style={[
                  { fontSize: 20 },
                  theme === "light" ? { color: "black" } : { color: "white" },
                ]}
              >
                Gerar XLSX
              </Text>
              <MaterialCommunityIcons
                name="microsoft-excel"
                size={28}
                color={theme === "light" ? "black" : "white"}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Animatable.View>
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
  mainView: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
    gap: 100,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    textAlign: "center",
  },
  alignItems: {
    flex: 1,
    alignItems: "center",
    gap: 10,
  },
  buttonsView: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  gerarRelatorioButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "40%",
    minWidth: 150,
    maxWidth: 300,
    gap: 10,
    borderWidth: 2,
    borderRadius: 100,
    paddingVertical: 10,
  },
  dataButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
  },
});
