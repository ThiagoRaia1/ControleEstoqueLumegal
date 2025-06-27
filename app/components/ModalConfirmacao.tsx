import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface Props {
  visivel: boolean;
  onConfirmar: () => void;
  onCancelar: () => void;
  mensagem: string;
  textoConfirmar?: string;
  textoCancelar?: string;
}

export default function ModalConfirmacao({
  visivel,
  onConfirmar,
  onCancelar,
  mensagem,
  textoConfirmar = "Confirmar",
  textoCancelar = "Cancelar",
}: Props) {
  return (
    <Modal
      visible={visivel}
      transparent
      animationType="fade"
      onRequestClose={onCancelar}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.mensagem}>{mensagem}</Text>
          <View style={styles.botoes}>
            <TouchableOpacity
              style={[styles.botao, styles.confirmar]}
              onPress={onConfirmar}
            >
              <Text style={styles.textoBotao}>{textoConfirmar}</Text>
            </TouchableOpacity>
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
  modal: {
    width: "100%",
    maxWidth: 800,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  mensagem: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  botoes: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  botao: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelar: {
    backgroundColor: "gray",
  },
  confirmar: {
    backgroundColor: "#b30f02",
  },
  textoBotao: {
    color: "white",
    fontWeight: "bold",
  },
});
