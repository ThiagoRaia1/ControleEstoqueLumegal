import { router } from "expo-router";
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
  tipoItem?:
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
  tipoItem,
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
                  return itens.map((item, index) => {
                    const key = `${tipoItem}-${index}`;
                    return (
                      <View
                        key={key}
                        style={[
                          styles.itemCard,
                          {
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                          },
                        ]}
                      >
                        <View style={styles.itemInfo}>
                          <Text style={styles.itemTitulo}>
                            {item.nome ||
                              item.tipo ||
                              item.categoria ||
                              item.cidade ||
                              "Sem nome"}
                          </Text>
                          {item.quantidade !== undefined && (
                            <Text style={styles.itemSub}>
                              Quantidade: {item.quantidade}
                            </Text>
                          )}
                          {item.enderecos?.[0]?.cidade && (
                            <Text style={styles.itemSub}>
                              Endereço principal: {item.enderecos[0].cidade}
                            </Text>
                          )}
                        </View>
                        <TouchableOpacity
                          style={styles.editarBotao}
                          onPress={() => {
                            router.push({
                              pathname: "/menus/registrarItem/editar",
                              params: {
                                tipoItem,
                                item: JSON.stringify(item), // precisa serializar o objeto
                              },
                            });
                          }}
                        >
                          <Text style={styles.editarTexto}>Editar</Text>
                        </TouchableOpacity>
                      </View>
                    );
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
  itemInfo: {
    flex: 1,
    paddingRight: 10,
  },
  editarBotao: {
    backgroundColor: "#007BFF",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  editarTexto: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 14,
  },
});
