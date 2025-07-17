import { View, ActivityIndicator, StyleSheet, Modal } from "react-native";

export default function Carregando() {
  return (
    <Modal transparent={true} statusBarTranslucent={true}>
      <View style={styles.overlay}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
});
