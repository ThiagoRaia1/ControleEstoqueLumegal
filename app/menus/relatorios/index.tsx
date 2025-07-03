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
import Carregando from "../../components/Carregando";
import { getEntradasSaidas } from "../../../services/entradaSaidaApi";
import { IEntradaSaida } from "../../../interfaces/entradaSaida";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver"; // apenas se for no frontend
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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

  const [carregando, setCarregando] = useState(false);

  async function gerarRelatorio(tipoRelatorio: string) {
    try {
      setCarregando(true);
      // console.log("dataInicial: " + dataInicial.toISOString());

      const dataFinalSelecionada = new Date(dataFinal);
      dataFinalSelecionada.setUTCHours(23, 59, 59, 0);

      // console.log(
      //   "dataFinalSelecionada: " + dataFinalSelecionada.toISOString()
      // );

      if (dataInicial > hojeComecoDoDia)
        throw new Error("dataInicial > hojeComecoDoDia");
      if (dataInicial > dataFinalSelecionada)
        throw new Error("dataInicial > dataFinalSelecionada");
      if (dataFinalSelecionada > hojeFinalDoDia)
        throw new Error("dataFinalSelecionada > hojeFinalDoDia");

      const entradasSaidas: IEntradaSaida[] = await getEntradasSaidas(
        dataInicial.toISOString(),
        dataFinalSelecionada.toISOString()
      );
      // console.log(entradasSaidas);

      if (tipoRelatorio === "XLSX") {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Relatório");

        const alturaPx = 30;
        const alturaPts = alturaPx / 1.33; // aproximadamente 22.5

        // Define largura das colunas
        worksheet.columns = [
          { header: "idEntradaSaida", key: "idEntradaSaida", width: 30 },
          { header: "EPI", key: "epi", width: 30 },
          { header: "Quantidade", key: "quantidade", width: 30 },
          { header: "Data", key: "data", width: 30 },
        ];

        // Adiciona linhas e aplica estilo
        entradasSaidas.forEach((entradaSaida) => {
          worksheet.addRow({
            idEntradaSaida: entradaSaida.id,
            epi: entradaSaida.epi.nome,
            quantidade: entradaSaida.quantidade,
            data: new Date(entradaSaida.data).toLocaleString("pt-BR"),
          });
        });

        // Centraliza o conteúdo das células
        worksheet.eachRow((row) => {
          row.height = alturaPts; // por exemplo
          row.eachCell((cell) => {
            cell.alignment = { vertical: "middle", horizontal: "center" };
          });
        });

        // Pintar células A1 a A4 de azul claro
        const azulClaro: ExcelJS.FillPattern = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF46C8F2" }, // Light Blue
        };

        const cinzaClaro: ExcelJS.FillPattern = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFF5F5F5" }, // cinza claro
        };

        // Suponha que o cabeçalho está na linha 1, dados começam na linha 2
        for (let i = 2; i <= entradasSaidas.length + 1; i++) {
          if (i % 2 === 0) {
            // Aplica o fill cinza claro nas linhas pares
            const row = worksheet.getRow(i);
            row.eachCell((cell) => {
              cell.fill = cinzaClaro;
            });
          }
        }

        ["A1", "B1", "C1", "D1"].forEach((cell) => {
          worksheet.getCell(cell).font = {
            bold: true,
            size: 12,
            color: { argb: "FFFFFFFF" }, // branco
          };
        });

        worksheet.getCell("A1").fill = azulClaro;
        worksheet.getCell("B1").fill = azulClaro;
        worksheet.getCell("C1").fill = azulClaro;
        worksheet.getCell("D1").fill = azulClaro;

        // // Define as bordas completas
        // const bordaCompleta: ExcelJS.Borders = {
        //   top: { style: "thin" },
        //   left: { style: "thin" },
        //   bottom: { style: "thin" },
        //   right: { style: "thin" },
        //   diagonal: {},
        // };

        // // Aplica bordas nas células de A1 até o fim dos dados na coluna D
        // for (let row = 1; row <= entradasSaidas.length + 1; row++) {
        //   for (let col = 1; col <= 4; col++) {
        //     const cell = worksheet.getRow(row).getCell(col);
        //     cell.border = bordaCompleta;
        //   }
        // }

        // Gera o arquivo
        const buffer = await workbook.xlsx.writeBuffer();

        // Para frontend (React/React Native Web)
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, "relatorio_epi.xlsx");
      }

      if (tipoRelatorio === "PDF") {
        // Cria a instância do jsPDF
        const doc = new jsPDF();

        // Define as colunas da tabela com header e dataKey
        const columns = [
          { header: "idEntradaSaida", dataKey: "id" },
          { header: "EPI", dataKey: "epi" },
          { header: "Quantidade", dataKey: "quantidade" },
          { header: "Data", dataKey: "data" },
        ];

        // Mapeia os dados para o formato esperado pela tabela
        const rows = entradasSaidas.map((entrada) => ({
          id: entrada.id,
          epi: entrada.epi.nome,
          quantidade: entrada.quantidade,
          data: new Date(entrada.data).toLocaleString("pt-BR"),
        }));

        // Gera a tabela no PDF
        autoTable(doc, {
          columns,
          body: rows,
          styles: { halign: "center", valign: "middle" },
          headStyles: { fillColor: "#46c8f2" }, // azul claro no cabeçalho
          margin: { top: 20 },
        });

        // Salva o PDF
        doc.save("relatorio_epi.pdf");
      }
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
          alert(erro.message);
        }
      }
    } finally {
      setCarregando(false);
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
              onPress={() => gerarRelatorio("XLSX")}
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
      {carregando && <Carregando />}
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
