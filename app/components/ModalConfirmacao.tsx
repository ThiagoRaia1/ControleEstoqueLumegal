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
  itens?: any[];
  tipoItens?:
    | "epi"
    | "suprimento"
    | "tipoUnidade"
    | "fornecedor"
    | "categoriaFornecedor"
    | "endereco";
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
                    const key = `${tipoItens}-${index}`;
                    switch (tipoItens) {
                      case "suprimento":
                        return (
                          <View key={key} style={styles.itemCard}>
                            <Text style={styles.itemTitulo}>
                              {item.nome || "Sem nome"}
                            </Text>
                            <Text style={styles.itemSub}>
                              Quantidade: {item.quantidade ?? "0"}
                            </Text>
                          </View>
                        );
                      case "epi":
                        return (
                          <View key={key} style={styles.itemCard}>
                            <Text style={styles.itemTitulo}>
                              {item.nome || "Sem nome"}
                            </Text>
                            <Text style={styles.itemSub}>
                              Quantidade: {item.quantidade ?? "0"}
                            </Text>
                          </View>
                        );
                      case "tipoUnidade":
                        return (
                          <View key={key} style={styles.itemCard}>
                            <Text style={styles.itemTitulo}>
                              {item.tipo || "Sem tipo"}
                            </Text>
                          </View>
                        );
                      case "fornecedor":
                        return (
                          <View key={key} style={styles.itemCard}>
                            <Text style={styles.itemTitulo}>
                              {item.nome || "Sem nome"}
                            </Text>
                            <Text style={styles.itemSub}>
                              Endereço principal:{" "}
                              {item.enderecos?.[0]?.cidade ?? "N/A"}
                            </Text>
                          </View>
                        );
                      case "categoriaFornecedor":
                        return (
                          <View key={key} style={styles.itemCard}>
                            <Text style={styles.itemTitulo}>
                              {item.categoria || "Sem nome"}
                            </Text>
                          </View>
                        );
                      case "endereco":
                        return (
                          <View key={key} style={styles.itemCard}>
                            <Text style={styles.itemTitulo}>
                              {item.cidade || "Sem nome"}
                            </Text>
                          </View>
                        );
                      default:
                        return (
                          <View key={key} style={styles.itemCard}>
                            <Text style={styles.itemTitulo}>
                              Item desconhecido
                            </Text>
                          </View>
                        );
                    }
                  });
                })()}
              </View>
            ) : (
              <View style={styles.lista}>
                <Text style={styles.itemTitulo}>Não há registros.</Text>
              </View>
            )}
          </ScrollView>

          <View style={styles.botoes}>
            {onConfirmar && (
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
    paddingHorizontal: 16,
  },
  container: {
    width: "100%",
    maxWidth: 700,
    maxHeight: "80%",
    backgroundColor: "#FFF",
    borderRadius: 16,
    overflow: "hidden",
    paddingBottom: 10,
  },
  scrollContent: {
    padding: 20,
    gap: 10,
  },
  mensagem: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  lista: {
    gap: 12,
  },
  itemCard: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 12,
    padding: 16,
    backgroundColor: "#F9F9F9",
  },
  itemTitulo: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },
  itemSub: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  botoes: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#EEE",
  },
  botao: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelar: {
    backgroundColor: "#555",
  },
  confirmar: {
    backgroundColor: "#0033A0",
  },
  textoBotao: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});
