import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { useThemeContext } from "../../../context/ThemeContext";
import BotaoLogout from "../../components/BotaoLogout";
import MenuInferior from "../../components/MenuInferior";
import Carregando from "../../components/Carregando";
import { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { ICriarEpi, IEpi, registrarEpiApi } from "../../../services/registrarEpiApi";

export default function RegistrarEpi() {
  const { theme } = useThemeContext();
  const [carregando, setCarregando] = useState(false);

  const [nome, setNome] = useState("");
  const [certificadoAprovacao, setCertificadoAprovacao] = useState("");
  const [descricao, setDescricao] = useState("");
  const [tipoUnidade, setTipoUnidade] = useState("");
  const [fornecedores, setFornecedores] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [quantidadeParaAviso, setQuantidadeParaAviso] = useState("");

  const tiposDeUnidadeDisponiveis = ["Unidade", "Par"];

  const registrarEpi = async () => {
    if (
      !nome ||
      !nome.trim() ||
      !tipoUnidade ||
      !tipoUnidade.trim() ||
      !quantidade ||
      !quantidade.trim() ||
      !quantidadeParaAviso ||
      !quantidadeParaAviso.trim()
    ) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      setCarregando(true);
      if (!parseInt(quantidade, 10) || parseInt(quantidade, 10) < 0) {
        throw new Error("Quantidade deve ser um número válido.");
      }
      if (
        !parseInt(quantidadeParaAviso, 10) ||
        parseInt(quantidadeParaAviso, 10) < 0
      ) {
        throw new Error("Quantidade para Aviso deve ser um número válido.");
      }

      const epi: ICriarEpi = {
        nome: nome.trim(),
        descricao: descricao.trim(),
        certificadoAprovacao: certificadoAprovacao.trim(),
        quantidade: parseInt(quantidade.trim(), 10),
        quantidadeParaAviso: parseInt(quantidadeParaAviso.trim(), 10),
        tipoUnidade: tipoUnidade.trim(),
        fornecedor: fornecedores.trim(),
      };

      const retornoDaApi = await registrarEpiApi(epi);

      alert("EPI registrado com sucesso!");
      // Limpa os campos após o registro
      setNome("");
      setCertificadoAprovacao("");
      setDescricao("");
      setTipoUnidade("");
      setFornecedores("");
      setQuantidade("");
      setQuantidadeParaAviso("");
    } catch (erro: any) {
      alert(erro.message);
    } finally {
      setCarregando(false);
    }
  };

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
        <Animatable.View
          animation="fadeInUp"
          duration={1000}
          style={styles.mainContent}
        >
          <View style={styles.labelInputContainer}>
            <Text
              style={[
                styles.label,
                theme === "light" ? { color: "black" } : { color: "white" },
              ]}
            >
              NOME: *
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
              placeholderTextColor="#888"
              value={nome}
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
              placeholderTextColor="#888"
              value={certificadoAprovacao}
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
              placeholderTextColor="#888"
              value={descricao}
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
              TIPO DE UNIDADE: *
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
                  { outline: "none" } as any,
                  {
                    color:
                      tipoUnidade === ""
                        ? theme === "light"
                          ? "#888"
                          : "#aaa"
                        : theme === "light"
                        ? "black"
                        : "white",
                  },
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
                  color={theme === "light" ? "black" : "#888"} // texto do placeholder
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

          <View style={styles.labelInputContainer}>
            <Text
              style={[
                styles.label,
                theme === "light" ? { color: "black" } : { color: "white" },
              ]}
            >
              FORNECEDOR:
            </Text>
            <TextInput
              style={[
                styles.input,
                { outline: "none" } as any,
                theme === "light"
                  ? { color: "black", borderColor: "black" }
                  : { color: "white", borderColor: "white" },
              ]}
              placeholder="Fornecedores do EPI"
              placeholderTextColor="#888"
              value={fornecedores}
              onChangeText={(text) => setFornecedores(text)}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-end",
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
                QUANTIDADE: *
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
                placeholderTextColor="#888"
                value={quantidade}
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
                QUANTIDADE PARA AVISO: *
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
                placeholderTextColor="#888"
                value={quantidadeParaAviso}
                onChangeText={(text) => setQuantidadeParaAviso(text)}
              />
            </View>
          </View>

          <TouchableOpacity style={styles.button} onPress={registrarEpi}>
            <Text style={styles.buttonText}>Salvar</Text>
          </TouchableOpacity>
        </Animatable.View>
      </View>
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
    justifyContent: "center",
    height: "90%",
    width: "100%",
    maxWidth: 800,
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
    paddingHorizontal: 10,
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
