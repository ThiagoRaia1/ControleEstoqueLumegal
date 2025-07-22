import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

interface Props {
  visivel: boolean;
  onConfirmar?: () => void;
  onCancelar: () => void;
  mensagem?: string;
  textoConfirmar?: string;
  textoCancelar?: string;
  itens?: any[]; // pode ser IEpi[], ISuprimento[], IFornecedor[] etc.
  tipoItens?:
    | "epi"
    | "suprimento"
    | "tipoUnidade"
    | "fornecedor"
    | "categoriaFornecedor"
    | "endereco"; // indica qual tipo está sendo passado
}

export default function ModalConfirmacao({
  visivel,
  onConfirmar,
  onCancelar,
  mensagem,
  textoConfirmar = "Confirmar",
  textoCancelar = "Cancelar",
  itens,
  tipoItens,
}: Props) {
  return (
    <Modal
      visible={visivel}
      transparent
      animationType="fade"
      onRequestClose={onCancelar}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {mensagem && <Text style={styles.mensagem}>{mensagem}</Text>}

            {itens && itens.length > 0 ? (
              <View style={styles.lista}>
                {(() => {
                  let itensOrdenados = [...itens];
                  switch (tipoItens) {
                    case "suprimento":
                    case "epi":
                    case "fornecedor":
                      itensOrdenados.sort((a, b) =>
                        a.nome.localeCompare(b.nome, "pt-BR", {
                          sensitivity: "base",
                        })
                      );
                      break;
                    case "tipoUnidade":
                      itensOrdenados.sort((a, b) =>
                        a.tipo.localeCompare(b.tipo, "pt-BR", {
                          sensitivity: "base",
                        })
                      );
                      break;
                    case "categoriaFornecedor":
                      itensOrdenados.sort((a, b) =>
                        a.categoria.localeCompare(b.categoria, "pt-BR", {
                          sensitivity: "base",
                        })
                      );
                      break;
                    case "endereco":
                      itensOrdenados.sort((a, b) =>
                        a.cidade.localeCompare(b.cidade, "pt-BR", {
                          sensitivity: "base",
                        })
                      );
                      break;
                  }

                  return itensOrdenados.map((item, index) => {
                    switch (tipoItens) {
                      case "suprimento":
                        return (
                          <View style={styles.itemRow}>
                            <Text key={index} style={styles.item}>
                              {`Nome do suprimento: ${item.nome || "Sem nome"}`}
                            </Text>
                            <Text
                              key={index}
                              style={[styles.item, { textAlign: "right" }]}
                            >
                              {`Quantidade: ${item.quantidade ?? ""}`}
                            </Text>
                          </View>
                        );
                      case "epi":
                        return (
                          <View style={styles.itemRow}>
                            <Text key={index} style={styles.item}>
                              {`Nome do EPI: ${item.nome || "Sem nome"}`}
                            </Text>
                            <Text
                              key={index}
                              style={[styles.item, { textAlign: "right" }]}
                            >
                              {`Quantidade: ${item.quantidade ?? ""}`}
                            </Text>
                          </View>
                        );
                      case "tipoUnidade":
                        return (
                          <View style={styles.itemRow}>
                            <Text key={index} style={styles.item}>
                              {`Tipo: ${item.tipo || "Sem tipo"}`}
                            </Text>
                          </View>
                        );
                      case "fornecedor":
                        return (
                          <View style={styles.itemRow}>
                            <Text key={index} style={styles.item}>
                              {`Nome do fornecedor: ${
                                item.nome || "Sem nome"
                              } \nEndereço principal: ${
                                item.enderecos?.[0].cidade ?? ""
                              }`}
                            </Text>
                          </View>
                        );
                      case "categoriaFornecedor":
                        return (
                          <View style={styles.itemRow}>
                            <Text key={index} style={styles.item}>
                              {`Categoria: ${item.categoria || "Sem nome"}`}
                            </Text>
                          </View>
                        );
                      case "endereco":
                        return (
                          <View style={styles.itemRow}>
                            <Text key={index} style={styles.item}>
                              {`Cidade: ${item.cidade || "Sem nome"}`}
                            </Text>
                          </View>
                        );
                      default:
                        return (
                          <Text key={index} style={styles.item}>
                            Item desconhecido
                          </Text>
                        );
                    }
                  });
                })()}
              </View>
            ) : (
              <View style={styles.lista}>
                <Text style={styles.item}>Não há registros.</Text>
              </View>
            )}
          </ScrollView>

          <View style={styles.botoes}>
            {onConfirmar !== undefined && (
              <TouchableOpacity
                style={[styles.botao, styles.confirmar]}
                onPress={onConfirmar}
              >
                <Text style={styles.textoBotao}>{textoConfirmar}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.botao, styles.cancelar]}
              onPress={onCancelar}
            >
              <Text style={styles.textoBotao}>{textoCancelar}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  container: {
    width: "100%",
    maxWidth: 900,
    maxHeight: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
  },
  scrollContent: {
    padding: 20,
  },
  mensagem: {
    fontSize: 16,
    marginBottom: 10,
  },
  lista: {
    marginBottom: -20,
  },
  item: {
    flex: 1,
    fontSize: 18,
    marginVertical: 5,
    textAlign: "left",
    padding: 20,
  },
  itemRow: {
    flexDirection: "row",
    width: "100%",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
  },
  botoes: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    padding: 15,
  },
  botao: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelar: {
    backgroundColor: "gray",
  },
  confirmar: {
    backgroundColor: "#0033A0",
  },
  textoBotao: {
    color: "white",
    fontWeight: "bold",
  },
});
