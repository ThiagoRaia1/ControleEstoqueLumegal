import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useThemeContext } from "../../../context/ThemeContext";
import BotaoLogout from "../../components/BotaoLogout";
import MenuInferior from "../../components/MenuInferior";
import { useState } from "react";
import { Picker } from "@react-native-picker/picker";

export default function RegistrarEpi() {
  const { theme } = useThemeContext();

  const [nome, setNome] = useState("");
  const [certificadoAprovacao, setCertificadoAprovacao] = useState("");
  const [descricao, setDescricao] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [quantidadeParaAviso, setQuantidadeParaAviso] = useState("");
  const [tipoUnidade, setTipoUnidade] = useState("");

  const tiposDeUnidadeDisponiveis = ["Unidade", "Par"];

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
          Registrar EPI
        </Text>
        <View style={styles.mainContent}>
          <View style={styles.labelInputContainer}>
            <Text
              style={[
                styles.label,
                theme === "light" ? { color: "black" } : { color: "white" },
              ]}
            >
              NOME:
            </Text>
            <TextInput
              style={[
                styles.input,
                { outline: "none" } as any,
                theme === "light"
                  ? { color: "black", borderColor: "black" }
                  : { color: "white", borderColor: "white" },
              ]}
              placeholder="Nome do EPI"
              placeholderTextColor="#ccc"
              onChangeText={(text) => setNome(text)}
            />
          </View>

          <View style={styles.labelInputContainer}>
            <Text
              style={[
                styles.label,
                theme === "light" ? { color: "black" } : { color: "white" },
              ]}
            >
              CERTIFICADO DE APROVAÇÃO:
            </Text>
            <TextInput
              style={[
                styles.input,
                { outline: "none" } as any,
                theme === "light"
                  ? { color: "black", borderColor: "black" }
                  : { color: "white", borderColor: "white" },
              ]}
              placeholder="C.A. do EPI"
              placeholderTextColor="#ccc"
              onChangeText={(text) => setCertificadoAprovacao(text)}
            />
          </View>

          <View style={styles.labelInputContainer}>
            <Text
              style={[
                styles.label,
                theme === "light" ? { color: "black" } : { color: "white" },
              ]}
            >
              DESCRIÇÃO:
            </Text>
            <TextInput
              style={[
                styles.input,
                { outline: "none" } as any,
                theme === "light"
                  ? { color: "black", borderColor: "black" }
                  : { color: "white", borderColor: "white" },
              ]}
              placeholder="Descrição do EPI"
              placeholderTextColor="#ccc"
              onChangeText={(text) => setDescricao(text)}
            />
          </View>

          <View style={styles.labelInputContainer}>
            <Text
              style={[
                styles.label,
                { color: theme === "light" ? "black" : "white" },
              ]}
            >
              Tipo de unidade:
            </Text>

            <View
              style={[
                styles.pickerContainer,
                {
                  backgroundColor: theme === "light" ? "#fff" : "#2a2a2a", // fundo claro ou escuro
                  borderColor: theme === "light" ? "black" : "white",
                },
              ]}
            >
              <Picker
                selectedValue={tipoUnidade}
                onValueChange={(tipo) => setTipoUnidade(tipo)}
                style={[
                  styles.input,
                  tipoUnidade === "" && { color: "#ccc" }, // cor do placeholder
                  { outline: "none" } as any,
                  {
                    backgroundColor: theme === "light" ? "#F0F3FA" : "#1C1C1C", // fundo do picker
                    borderWidth: 0,
                  },
                ]}
                mode="dropdown"
                dropdownIconColor={theme === "light" ? "black" : "white"} // cor do ícone (Web/Android)
              >
                <Picker.Item
                  label="Tipo de unidade"
                  value=""
                  color={theme === "light" ? "black" : "#ccc"} // texto do placeholder
                />
                {tiposDeUnidadeDisponiveis.map((tipo) => (
                  <Picker.Item
                    key={tipo}
                    label={tipo}
                    value={tipo}
                    color={theme === "light" ? "black" : "white"} // cor de cada item
                  />
                ))}
              </Picker>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 20,
            }}
          >
            <View style={[styles.labelInputContainer, { flex: 1 }]}>
              <Text
                style={[
                  styles.label,
                  theme === "light" ? { color: "black" } : { color: "white" },
                ]}
              >
                QUANTIDADE:
              </Text>
              <TextInput
                style={[
                  styles.input,
                  { outline: "none" } as any,
                  theme === "light"
                    ? { color: "black", borderColor: "black" }
                    : { color: "white", borderColor: "white" },
                ]}
                placeholder="Quantidade inicial do EPI"
                placeholderTextColor="#ccc"
                onChangeText={(text) => setQuantidade(text)}
              />
            </View>
            <View style={[styles.labelInputContainer, { flex: 1 }]}>
              <Text
                style={[
                  styles.label,
                  theme === "light" ? { color: "black" } : { color: "white" },
                ]}
              >
                QUANTIDADE PARA AVISO:
              </Text>
              <TextInput
                style={[
                  styles.input,
                  { outline: "none" } as any,
                  theme === "light"
                    ? { color: "black", borderColor: "black" }
                    : { color: "white", borderColor: "white" },
                ]}
                placeholder="Quantidade para o item ser exibido no aviso"
                placeholderTextColor="#ccc"
                onChangeText={(text) => setQuantidadeParaAviso(text)}
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              // Adicionar a lógica para registrar o EPI
              console.log("EPI registrado:", {
                nome,
                certificadoAprovacao,
                descricao,
                quantidade,
                quantidadeParaAviso,
                tipoUnidade,
              });
            }}
          >
            <Text style={styles.buttonText}>Salvar</Text>
          </TouchableOpacity>
        </View>
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
  title: {
    fontSize: 30,
    fontWeight: "700",
    textAlign: "center",
  },
  mainContent: {
    height: "100%",
    width: "100%",
    justifyContent: "center",
    padding: 20,
    gap: 20,
  },
  labelInputContainer: {
    gap: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
  },
  input: {
    height: 50,
    width: "100%",
    fontSize: 16,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
  },
  pickerContainer: {
    width: "100%",
    alignSelf: "center",
    backgroundColor: "#aaa",
    borderRadius: 10,
    borderWidth: 1,
  },
  button: {
    height: 50,
    justifyContent: "center",
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#0033A0",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});
