import { StyleSheet } from "react-native";

export const getGlobalStyles = (theme: "light" | "dark") =>
  StyleSheet.create({
    // Base
    background: {
      position: "absolute",
      width: "100%",
      height: "100%",
      backgroundColor: theme === "light" ? "#f0f3fa" : "#1c1c1c",
    },
    title: {
      fontSize: 30,
      fontWeight: "700",
      textAlign: "center",
      color: theme === "light" ? "black" : "white",
      marginBottom: 20,
    },
    mainContent: {
      flex: 1,
      width: "100%",
      maxWidth: 800,
      alignSelf: "center",
      alignItems: "center",
      justifyContent: "center",
      gap: 20,
      paddingHorizontal: 20,
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
    },
    //Botoes
    button: {
      width: "100%",
      height: 50,
      backgroundColor: "#0033a0",
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
    },
    buttonText: {
      color: "white",
      fontWeight: 600,
      fontSize: 18,
      paddingHorizontal: 30,
    },
    optionButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      minWidth: 300,
      height: 50,
      gap: 10,
      paddingHorizontal: 20,
      borderWidth: 2,
      borderRadius: 100,
      borderColor: theme === "light" ? "black" : "white",
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
    },
    dataPicker: {
      padding: 10,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme === "light" ? "black" : "white",
      backgroundColor: theme === "light" ? "#fff" : "#2a2a2a",
      color: theme === "light" ? "black" : "white",
      fontSize: 16,
    },
    // Scroll
    itensScroll: {
      flex: 1,
      borderRadius: 20,
      borderWidth: 3,
      borderColor: "#888",
      alignSelf: "center",
      width: "100%",
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: "flex-start",
      backgroundColor: theme === "light" ? "white" : "#5e5e5e",
    },
    scrollContentForm: {
      flex: 1,
      gap: 20,
      justifyContent: "center",
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
  });
