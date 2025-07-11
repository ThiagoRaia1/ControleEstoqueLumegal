import React from "react";
import { useTipoAcessoContext } from "../../context/tipoAcessoContext";

interface PermissaoProps {
  children: React.ReactNode;
  permitidos: string[]; // Tipos permitidos
}

export default function Permissao({ children, permitidos }: PermissaoProps) {
  const { tipoAcesso } = useTipoAcessoContext();

  if (!permitidos.includes(tipoAcesso)) {
    return null;
  }

  return <>{children}</>;
}
