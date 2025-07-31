import React from "react";
import { View, TouchableOpacity, Text } from "react-native";

export type TipoFiltro = "todos" | "epi" | "suprimento";

interface FiltroTipoItemProps {
  valorSelecionado: TipoFiltro;
  onSelecionar: (tipo: TipoFiltro) => void;
}

export default function FiltroTipoItem({
  valorSelecionado,
  onSelecionar,
}: FiltroTipoItemProps) {
  const opcoes: TipoFiltro[] = ["todos", "epi", "suprimento"];

  return (
    <View
      style={{
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-evenly",
        paddingVertical: 5,
        gap: 20,
      }}
    >
      {opcoes.map((tipo) => (
        <TouchableOpacity
          key={tipo}
          onPress={() => onSelecionar(tipo)}
          style={{
            flex: 1,
            backgroundColor: valorSelecionado === tipo ? "#0033A0" : "#ddd",
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 20,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: valorSelecionado === tipo ? "white" : "black",
              fontWeight: 600,
              fontSize: 18,
            }}
          >
            {tipo === "todos"
              ? "Todos"
              : tipo === "epi"
              ? "EPIs"
              : "Suprimentos"}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
