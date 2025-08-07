import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import * as Animatable from "react-native-animatable";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useThemeContext } from "../../../context/themeContext";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useState } from "react";
import Carregando from "../../components/Carregando";
import {
  getEntradasSaidasEpi,
  getEntradasSaidasSuprimento,
} from "../../../services/entradaSaidaApi";
import {
  IEntradaSaidaEpi,
  IEntradaSaidaSuprimento,
} from "../../../interfaces/entradaSaida";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver"; // apenas se for no frontend
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getGlobalStyles } from "../../../globalStyles";
import {
  acessoCompras,
  acessoComprasAdm,
  useTipoAcessoContext,
} from "../../../context/tipoAcessoContext";
import MenuSuperior from "../../components/MenuSuperior";
import MenuLateral from "../../components/MenuLateral";

export default function Relatorios() {
  const { tipoAcesso } = useTipoAcessoContext();
  const { theme } = useThemeContext();
  const globalStyles = getGlobalStyles(theme);
  const [isMenuLateralVisivel, setIsMenuLateralVisivel] = useState(false);

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

      const dataFinalSelecionada = new Date(dataFinal);
      dataFinalSelecionada.setUTCHours(23, 59, 59, 0);

      if (dataInicial > hojeComecoDoDia)
        throw new Error("dataInicial > hojeComecoDoDia");
      if (dataInicial > dataFinalSelecionada)
        throw new Error("dataInicial > dataFinalSelecionada");
      if (dataFinalSelecionada > hojeFinalDoDia)
        throw new Error("dataFinalSelecionada > hojeFinalDoDia");

      const entradasSaidasEpi: IEntradaSaidaEpi[] = await getEntradasSaidasEpi(
        dataInicial.toISOString(),
        dataFinalSelecionada.toISOString()
      );

      const entradasSaidasSuprimento: IEntradaSaidaSuprimento[] =
        await getEntradasSaidasSuprimento(
          dataInicial.toISOString(),
          dataFinalSelecionada.toISOString()
        );

      if (tipoRelatorio === "XLSX") {
        const workbook = new ExcelJS.Workbook();
        const worksheetEpi = workbook.addWorksheet("Relatório_Epi");

        const alturaPx = 30;
        const alturaPts = alturaPx / 1.33;
        const columnsWidth = 59.29;

        // ==== Primeira tabela: Entradas e Saídas EPI ====
        // Define colunas da primeira tabela
        worksheetEpi.columns = [
          { header: "EPI", key: "epi", width: columnsWidth },
          { header: "Quantidade", key: "quantidade", width: columnsWidth },
          { header: "Data", key: "data", width: columnsWidth },
        ];

        // Estilos globais
        const azulClaro: ExcelJS.FillPattern = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF46C8F2" }, // azul claro
        };

        const cinzaClaro: ExcelJS.FillPattern = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFF5F5F5" }, // cinza claro
        };

        const branco: ExcelJS.FillPattern = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFFFFFF" }, // branco
        };

        // Preenche os dados da primeira tabela
        entradasSaidasEpi.forEach((entradaSaida, index) => {
          const row = worksheetEpi.addRow({
            epi: entradaSaida.epi.nome,
            quantidade: entradaSaida.quantidade,
            data: new Date(entradaSaida.data).toLocaleString("pt-BR"),
          });

          const isPar = index % 2 === 0;
          const fill = isPar ? cinzaClaro : branco;

          row.eachCell((cell) => {
            cell.alignment = { vertical: "middle", horizontal: "center" };
            cell.fill = fill;
          });

          row.height = alturaPts;
        });

        // Aplica estilo à primeira tabela
        worksheetEpi.eachRow((row, rowNumber) => {
          row.height = alturaPts;
          row.eachCell((cell) => {
            cell.alignment = { vertical: "middle", horizontal: "center" };
          });

          if (rowNumber === 1) {
            row.eachCell((cell) => {
              cell.fill = azulClaro;
              cell.font = { bold: true, size: 12, color: { argb: "FFFFFFFF" } };
            });
          } else if (rowNumber % 2 === 0) {
            row.eachCell((cell) => {
              cell.fill = cinzaClaro;
            });
          }
        });

        // ==== Segunda tabela: Entradas e Saídas por EPI ====
        const saidasPorEpi: Record<string, number> = {};
        const entradasPorEpi: Record<string, number> = {};

        for (const entrada of entradasSaidasEpi) {
          const nome = entrada.epi.nome;
          if (entrada.quantidade > 0) {
            entradasPorEpi[nome] =
              (entradasPorEpi[nome] || 0) + entrada.quantidade;
          } else if (entrada.quantidade < 0) {
            saidasPorEpi[nome] = (saidasPorEpi[nome] || 0) + entrada.quantidade;
          }
        }

        const startResumoRowEpi = entradasSaidasEpi.length + 4;

        // Cabeçalho da tabela
        worksheetEpi.getCell(`A${startResumoRowEpi}`).value = "EPI";
        worksheetEpi.getCell(`B${startResumoRowEpi}`).value =
          "Total de Entradas";
        worksheetEpi.getCell(`C${startResumoRowEpi}`).value = "Total de Saídas";

        ["A", "B", "C"].forEach((col) => {
          const cell = worksheetEpi.getCell(`${col}${startResumoRowEpi}`);
          cell.fill = azulClaro;
          cell.font = { bold: true, size: 12, color: { argb: "FFFFFFFF" } };
          cell.alignment = { vertical: "middle", horizontal: "center" };
          worksheetEpi.getColumn(col).width = columnsWidth;
        });

        worksheetEpi.getRow(startResumoRowEpi).height = alturaPts;

        // Unifica os nomes de EPIs
        const nomesEpi = new Set([
          ...Object.keys(entradasPorEpi),
          ...Object.keys(saidasPorEpi),
        ]);

        // Corpo da tabela
        let linhaEpi = startResumoRowEpi + 1;
        Array.from(nomesEpi).forEach((nome, index) => {
          const entradaTotal = entradasPorEpi[nome] || 0;
          const saidaTotal = saidasPorEpi[nome] || 0;

          worksheetEpi.getCell(`A${linhaEpi}`).value = nome;
          worksheetEpi.getCell(`B${linhaEpi}`).value = entradaTotal;
          worksheetEpi.getCell(`C${linhaEpi}`).value = saidaTotal;

          const isPar = index % 2 === 0;
          ["A", "B", "C"].forEach((col) => {
            const cell = worksheetEpi.getCell(`${col}${linhaEpi}`);
            cell.alignment = { vertical: "middle", horizontal: "center" };
            cell.fill = isPar
              ? cinzaClaro
              : {
                  type: "pattern",
                  pattern: "solid",
                  fgColor: { argb: "FFFFFFFF" },
                };
          });

          worksheetEpi.getRow(linhaEpi).height = alturaPts;
          linhaEpi++;
        });

        if ([acessoCompras, acessoComprasAdm].includes(tipoAcesso)) {
          const worksheetSuprimento = workbook.addWorksheet(
            "Relatório_Suprimento"
          );
          // ==== Primeira tabela: Entradas e Saídas Suprimento ====
          // Define colunas da primeira tabela
          worksheetSuprimento.columns = [
            { header: "Suprimento", key: "suprimento", width: columnsWidth },
            { header: "Quantidade", key: "quantidade", width: columnsWidth },
            { header: "Data", key: "data", width: columnsWidth },
          ];

          // Preenche os dados da primeira tabela
          entradasSaidasSuprimento.forEach((entradaSaida, index) => {
            const row = worksheetSuprimento.addRow({
              suprimento: entradaSaida.suprimento.nome,
              quantidade: entradaSaida.quantidade,
              data: new Date(entradaSaida.data).toLocaleString("pt-BR"),
            });

            const isPar = index % 2 === 0;
            const fill = isPar ? cinzaClaro : branco;

            row.eachCell((cell) => {
              cell.alignment = { vertical: "middle", horizontal: "center" };
              cell.fill = fill;
            });

            row.height = alturaPts;
          });

          // Aplica estilo à primeira tabela
          worksheetSuprimento.eachRow((row, rowNumber) => {
            row.height = alturaPts;
            row.eachCell((cell) => {
              cell.alignment = { vertical: "middle", horizontal: "center" };
            });

            if (rowNumber === 1) {
              row.eachCell((cell) => {
                cell.fill = azulClaro;
                cell.font = {
                  bold: true,
                  size: 12,
                  color: { argb: "FFFFFFFF" },
                };
              });
            } else if (rowNumber % 2 === 0) {
              row.eachCell((cell) => {
                cell.fill = cinzaClaro;
              });
            }
          });

          // ==== Segunda tabela: Entradas e Saídas por suprimento ====
          const saidasPorSuprimento: Record<string, number> = {};
          const entradasPorSuprimento: Record<string, number> = {};

          for (const entrada of entradasSaidasSuprimento) {
            const nome = entrada.suprimento.nome;
            if (entrada.quantidade > 0) {
              entradasPorSuprimento[nome] =
                (entradasPorSuprimento[nome] || 0) + entrada.quantidade;
            } else if (entrada.quantidade < 0) {
              saidasPorSuprimento[nome] =
                (saidasPorSuprimento[nome] || 0) + entrada.quantidade;
            }
          }

          const startResumoRowSuprimento = entradasSaidasSuprimento.length + 4;

          // Cabeçalho da tabela
          worksheetSuprimento.getCell(`A${startResumoRowSuprimento}`).value =
            "Suprimento";
          worksheetSuprimento.getCell(`B${startResumoRowSuprimento}`).value =
            "Total de Entradas";
          worksheetSuprimento.getCell(`C${startResumoRowSuprimento}`).value =
            "Total de Saídas";

          ["A", "B", "C"].forEach((col) => {
            const cell = worksheetSuprimento.getCell(
              `${col}${startResumoRowSuprimento}`
            );
            cell.fill = azulClaro;
            cell.font = { bold: true, size: 12, color: { argb: "FFFFFFFF" } };
            cell.alignment = { vertical: "middle", horizontal: "center" };
            worksheetSuprimento.getColumn(col).width = columnsWidth;
          });

          worksheetSuprimento.getRow(startResumoRowSuprimento).height =
            alturaPts;

          // Unifica os nomes de Suprimentos
          const nomesSuprimento = new Set([
            ...Object.keys(entradasPorSuprimento),
            ...Object.keys(saidasPorSuprimento),
          ]);

          // Corpo da tabela
          let linhaSuprimento = startResumoRowSuprimento + 1;
          Array.from(nomesSuprimento).forEach((nome, index) => {
            const entradaTotal = entradasPorSuprimento[nome] || 0;
            const saidaTotal = saidasPorSuprimento[nome] || 0;

            worksheetSuprimento.getCell(`A${linhaSuprimento}`).value = nome;
            worksheetSuprimento.getCell(`B${linhaSuprimento}`).value =
              entradaTotal;
            worksheetSuprimento.getCell(`C${linhaSuprimento}`).value =
              saidaTotal;

            const isPar = index % 2 === 0;
            ["A", "B", "C"].forEach((col) => {
              const cell = worksheetSuprimento.getCell(
                `${col}${linhaSuprimento}`
              );
              cell.alignment = { vertical: "middle", horizontal: "center" };
              cell.fill = isPar
                ? cinzaClaro
                : {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "FFFFFFFF" },
                  };
            });

            worksheetSuprimento.getRow(linhaSuprimento).height = alturaPts;
            linhaSuprimento++;
          });
        }

        // Gera e salva o arquivo
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, "relatorio.xlsx");
      }

      if (tipoRelatorio === "PDF") {
        const doc = new jsPDF();

        // --- Tabela 1 Epi: Detalhada ---
        const columnsEpi = [
          // { header: "idEntradaSaida", dataKey: "id" },
          { header: "EPI", dataKey: "epi" },
          { header: "Quantidade", dataKey: "quantidade" },
          { header: "Data", dataKey: "data" },
        ];

        const rowsEpi = entradasSaidasEpi.map((entrada) => ({
          // id: entrada.id,
          epi: entrada.epi.nome,
          quantidade: entrada.quantidade,
          data: new Date(entrada.data).toLocaleString("pt-BR"),
        }));

        autoTable(doc, {
          columns: columnsEpi,
          body: rowsEpi,
          styles: { halign: "center", valign: "middle" },
          headStyles: { fillColor: "#46c8f2" },
          margin: { top: 20 },
        });

        // --- Agrupamento por EPI: Entradas e Saídas ---
        const entradasPorEpi: Record<string, number> = {};
        const saidasPorEpi: Record<string, number> = {};

        for (const entrada of entradasSaidasEpi) {
          const nome = entrada.epi.nome;
          if (entrada.quantidade > 0) {
            entradasPorEpi[nome] =
              (entradasPorEpi[nome] || 0) + entrada.quantidade;
          } else if (entrada.quantidade < 0) {
            saidasPorEpi[nome] = (saidasPorEpi[nome] || 0) + entrada.quantidade;
          }
        }

        // Unifica todos os nomes de EPI
        const nomesUnicosEpi = new Set([
          ...Object.keys(entradasPorEpi),
          ...Object.keys(saidasPorEpi),
        ]);

        // Monta o corpo da tabela
        const resumoBodyEpi = Array.from(nomesUnicosEpi).map((nome) => ({
          epi: nome,
          entradas: entradasPorEpi[nome] || 0,
          saidas: saidasPorEpi[nome] || 0,
        }));

        // --- Tabela 2 Epi: Resumo de Entradas e Saídas ---
        autoTable(doc, {
          startY: (doc as any).lastAutoTable.finalY + 10,
          columns: [
            { header: "EPI", dataKey: "epi" },
            { header: "Total de Entradas", dataKey: "entradas" },
            { header: "Total de Saídas", dataKey: "saidas" },
          ],
          body: resumoBodyEpi,
          styles: { halign: "center", valign: "middle" },
          headStyles: { fillColor: "#46c8f2", textColor: "#ffffff" },
        });

        if ([acessoCompras, acessoComprasAdm].includes(tipoAcesso)) {
          // --- Tabela 1 Suprimento: Detalhada ---
          const columnsSuprimento = [
            // { header: "idEntradaSaida", dataKey: "id" },
            { header: "Suprimento", dataKey: "suprimento" },
            { header: "Quantidade", dataKey: "quantidade" },
            { header: "Data", dataKey: "data" },
          ];

          const rowsSuprimento = entradasSaidasSuprimento.map((entrada) => ({
            // id: entrada.id,
            suprimento: entrada.suprimento.nome,
            quantidade: entrada.quantidade,
            data: new Date(entrada.data).toLocaleString("pt-BR"),
          }));

          autoTable(doc, {
            columns: columnsSuprimento,
            body: rowsSuprimento,
            styles: { halign: "center", valign: "middle" },
            headStyles: { fillColor: "#46c8f2" },
            margin: { top: 20 },
          });

          // --- Agrupamento por suprimento: Entradas e Saídas ---
          const entradasPorSuprimento: Record<string, number> = {};
          const saidasPorSuprimento: Record<string, number> = {};

          for (const entrada of entradasSaidasSuprimento) {
            const nome = entrada.suprimento.nome;
            if (entrada.quantidade > 0) {
              entradasPorSuprimento[nome] =
                (entradasPorSuprimento[nome] || 0) + entrada.quantidade;
            } else if (entrada.quantidade < 0) {
              saidasPorSuprimento[nome] =
                (saidasPorSuprimento[nome] || 0) + entrada.quantidade;
            }
          }

          // Unifica todos os nomes de suprimento
          const nomesUnicosSuprimento = new Set([
            ...Object.keys(entradasPorSuprimento),
            ...Object.keys(saidasPorSuprimento),
          ]);

          // Monta o corpo da tabela
          const resumoBodySuprimento = Array.from(nomesUnicosSuprimento).map(
            (nome) => ({
              suprimento: nome,
              entradas: entradasPorSuprimento[nome] || 0,
              saidas: saidasPorSuprimento[nome] || 0,
            })
          );

          // --- Tabela 2 Suprimento: Resumo de Entradas e Saídas ---
          autoTable(doc, {
            startY: (doc as any).lastAutoTable.finalY + 10,
            columns: [
              { header: "Suprimento", dataKey: "suprimento" },
              { header: "Total de Entradas", dataKey: "entradas" },
              { header: "Total de Saídas", dataKey: "saidas" },
            ],
            body: resumoBodySuprimento,
            styles: { halign: "center", valign: "middle" },
            headStyles: { fillColor: "#46c8f2", textColor: "#ffffff" },
          });
        }

        doc.save("relatorio.pdf");
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
    <View style={globalStyles.background}>
      <MenuSuperior />
      <Text style={globalStyles.title}>GERAR RELATÓRIO</Text>

      <Animatable.View
        animation="fadeInUp"
        duration={800}
        style={[globalStyles.mainContent, { gap: 40, marginTop: -20 }]}
      >
        {/* Seleção de datas */}
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 30,
          }}
        >
          {[
            {
              label: "Data Inicial",
              value: dataInicial,
              setValue: setDataInicial,
              mostrar: mostrarPickerInicial,
              setMostrar: setMostrarPickerInicial,
            },
            {
              label: "Data Final",
              value: dataFinal,
              setValue: setDataFinal,
              mostrar: mostrarPickerFinal,
              setMostrar: setMostrarPickerFinal,
            },
          ].map(({ label, value, setValue, mostrar, setMostrar }, index) => (
            <View key={index} style={styles.dateCard}>
              <Text
                style={[
                  styles.dateLabel,
                  { color: theme === "light" ? "#000" : "#fff" },
                ]}
              >
                {label}
              </Text>
              {Platform.OS === "web" ? (
                <input
                  type="date"
                  value={value.toISOString().split("T")[0]}
                  onChange={(e) => {
                    const novaData = new Date(e.target.value);
                    if (!isNaN(novaData.getTime())) setValue(novaData);
                  }}
                  style={globalStyles.dataPicker}
                />
              ) : (
                <>
                  <TouchableOpacity
                    onPress={() => setMostrar(true)}
                    style={[
                      styles.dateTouchable,
                      theme === "light"
                        ? styles.lightBorder
                        : styles.darkBorder,
                    ]}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        color: theme === "light" ? "#000" : "#fff",
                      }}
                    >
                      {value.toLocaleDateString("pt-BR")}
                    </Text>
                  </TouchableOpacity>
                  <DateTimePickerModal
                    isVisible={mostrar}
                    mode="date"
                    date={value}
                    onConfirm={(date) => {
                      setValue(date);
                      setMostrar(false);
                    }}
                    onCancel={() => setMostrar(false)}
                    locale="pt-BR"
                    display={Platform.OS === "ios" ? "inline" : "default"}
                  />
                </>
              )}
            </View>
          ))}
        </View>

        {/* Botões de gerar */}
        <View style={styles.downloadContainer}>
          <TouchableOpacity
            style={[styles.downloadButton, { backgroundColor: "#e74c3c" }]}
            onPress={() => gerarRelatorio("PDF")}
          >
            <AntDesign name="pdffile1" size={24} color="#fff" />
            <Text style={styles.downloadButtonText}>Gerar PDF</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.downloadButton, { backgroundColor: "#2ecc71" }]}
            onPress={() => gerarRelatorio("XLSX")}
          >
            <MaterialCommunityIcons
              name="microsoft-excel"
              size={28}
              color="#fff"
            />
            <Text style={styles.downloadButtonText}>Gerar XLSX</Text>
          </TouchableOpacity>
        </View>
      </Animatable.View>

      {carregando && <Carregando />}
      <MenuLateral
        visivel={isMenuLateralVisivel}
        setVisivel={setIsMenuLateralVisivel}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  dateCard: {
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    width: 160,
    gap: 10,
    elevation: 3,
  },
  dateLabel: {
    fontSize: 18,
    fontWeight: "bold",
  },
  dateTouchable: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  lightBorder: {
    borderColor: "#000",
    backgroundColor: "#fff",
  },
  darkBorder: {
    borderColor: "#fff",
    backgroundColor: "#2a2a2a",
  },
  downloadContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 30,
    flexWrap: "wrap",
  },
  downloadButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    minWidth: 160,
    justifyContent: "center",
  },
  downloadButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
