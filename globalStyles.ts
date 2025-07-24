import { Platform, StyleSheet } from "react-native";

export const getBoxShadow = (theme: "light" | "dark") => {
  if (Platform.OS !== "web") return {};

  return {
    boxShadow:
      theme === "light"
        ? "0px 5px 10px rgba(0, 0, 0, 0.8)"
        : "0px 5px 10px rgba(140, 140, 140, 0.8)",
  };
};

export const getGlobalStyles = (theme: "light" | "dark") =>
  StyleSheet.create({
    // Base
    background: {
      position: "absolute",
      width: "100%",
      height: "100%",
      backgroundColor: theme === "light" ? "#f0f3fa" : "#1c1c1c",
    },
    loginInputContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "white",
      elevation: 20,
      paddingHorizontal: 15,
      gap: 15,
      marginBottom: 20,
      width: "100%",
      borderWidth: 1,
      borderColor: "#0033A0",
      borderRadius: 10,
      justifyContent: "space-between",
      ...getBoxShadow(theme),
    },
    title: {
      fontSize: 30,
      fontWeight: "700",
      textAlign: "center",
      color: theme === "light" ? "black" : "white",
    },
    mainContent: {
      flex: 1,
      width: "90%",
      maxWidth: 1000,
      alignSelf: "center",
      alignItems: "center",
      justifyContent: "center",
      gap: 20,
      marginBottom: 20,
    },
    // Pesquisa
    searchBar: {
      width: "100%",
      flexDirection: "row",
      borderWidth: 2,
      borderRadius: 20,
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderColor: "#888",
      backgroundColor: theme === "light" ? "white" : "#1C1C1C",
      ...getBoxShadow(theme),
    },
    //Botoes
    button: {
      width: "100%",
      height: 50,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
      elevation: 20,
      backgroundColor: "#0033a0",
      boxShadow: "0px 5px 5px #000c27ff",
    },
    buttonCancelar: {
      width: "100%",
      height: 50,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
      elevation: 20,
      backgroundColor: "#B30F03",
      boxShadow: "0px 5px 5px #290300ff",
    },
    buttonText: {
      color: "white",
      fontWeight: 600,
      fontSize: 18,
      paddingHorizontal: 30,
    },
    buttonRowContainer: {
      flexDirection: "row",
      gap: 20,
      width: "100%",
      paddingHorizontal: 10,
    },
    optionButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      flex: 1,
      minWidth: 300,
      height: 50,
      gap: 10,
      paddingHorizontal: 20,
      borderWidth: 2,
      borderRadius: 100,
      borderColor: theme === "light" ? "black" : "white",
      ...getBoxShadow(theme),
    },
    optionButtonText: {
      fontSize: 20,
      color: theme === "light" ? "black" : "white",
    },
    // Label
    labelInputContainer: {
      gap: 10,
    },
    label: {
      fontSize: 18,
      fontWeight: "600",
      color: theme === "light" ? "black" : "white",
    },
    // Input
    inputEditar: {
      height: 50,
      width: "100%",
      fontSize: 16,
      borderWidth: 1,
      paddingHorizontal: 10,
      borderRadius: 10,
      color: theme === "light" ? "black" : "white",
      borderColor: theme === "light" ? "black" : "white",
      outlineStyle: "none" as any,
      ...getBoxShadow(theme),
    },
    dataPicker: {
      padding: 10,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme === "light" ? "black" : "white",
      backgroundColor: theme === "light" ? "#fff" : "#2a2a2a",
      color: theme === "light" ? "black" : "white",
      fontSize: 16,
      ...getBoxShadow(theme),
    },
    pickerContainer: {
      width: "100%",
      height: 50,
      backgroundColor: "#aaa",
      borderRadius: 10,
      borderWidth: 1,
    },
    // Scroll
    itensScroll: {
      flex: 1,
      borderRadius: 20,
      borderWidth: 3,
      borderColor: "#888",
      alignSelf: "center",
      width: "100%",
      ...getBoxShadow(theme),
      overflow: "hidden",
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: "flex-start",
      backgroundColor: theme === "light" ? "white" : "#5e5e5e",
    },
    scrollContentForm: {
      flexGrow: 1,
      gap: 20,
      paddingHorizontal: 10,
      justifyContent: "center",
      marginBottom: 20,
    },
    // Exibição
    item: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      padding: 10,
      gap: 10,
      borderWidth: 1,
      borderRadius: 20,
      borderColor: "#888",
      width: "100%",
      height: 200,
      backgroundColor: theme === "light" ? "white" : "#c7c7c7",
    },
    dadosEpiText: {
      textAlign: "left",
      fontSize: 14,
      color: "black",
      fontWeight: "500",
      marginBottom: 10,
    },
    leftSide: {
      flex: 1,
      justifyContent: "center",
      height: "100%",
      paddingVertical: 5,
      gap: 10,
    },
    rightSide: {
      flex: 1,
      height: "100%",
      justifyContent: "space-evenly",
      paddingVertical: 5,
      gap: 10,
    },
    itemTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme === "light" ? "#000" : "#fff",
      marginBottom: 4,
    },

    itemDetail: {
      fontSize: 14,
      color: theme === "light" ? "#333" : "#ccc",
    },

    card: {
      backgroundColor: theme === "light" ? "#fff" : "#2b2b2b",
    },

    dadosItem: {
      color: theme === "light" ? "#333" : "#aaa",
      fontSize: 14,
      marginBottom: 4,
    },
  });
