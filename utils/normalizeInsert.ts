export default function normalizeInsert(text: string) {
  return text
    .normalize("NFD") // separa letras de acentos
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .toUpperCase(); // transforma em maiúsculas
}
