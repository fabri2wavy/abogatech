import * as XLSX from "xlsx";
import { Honorario } from "@/domain/entities/Finanzas";

const Unidades = ["", "UN", "DOS", "TRES", "CUATRO", "CINCO", "SEIS", "SIETE", "OCHO", "NUEVE"];
const Decenas = ["", "DIEZ", "VEINTE", "TREINTA", "CUARENTA", "CINCUENTA", "SESENTA", "SETENTA", "OCHENTA", "NOVENTA"];
const DiezAlDiecinueve = ["DIEZ", "ONCE", "DOCE", "TRECE", "CATORCE", "QUINCE", "DIECISEIS", "DIECISIETE", "DIECIOCHO", "DIECINUEVE"];
const Centenas = ["", "CIENTO", "DOSCIENTOS", "TRESCIENTOS", "CUATROCIENTOS", "QUINIENTOS", "SEISCIENTOS", "SETECIENTOS", "OCHOCIENTOS", "NOVECIENTOS"];

function convertirNumeroALetras(numero: number): string {
  if (numero === 0) return "CERO";

  const partes = numero.toFixed(2).split(".");
  const entero = parseInt(partes[0], 10);
  const decimal = partes[1];

  function convertirGrupo(n: number): string {
    let letras = "";
    const c = Math.floor(n / 100);
    const d = Math.floor((n % 100) / 10);
    const u = n % 10;

    if (c === 1 && d === 0 && u === 0) letras += "CIEN ";
    else if (c > 0) letras += Centenas[c] + " ";

    if (d === 1) {
      letras += DiezAlDiecinueve[u] + " ";
      return letras;
    } else if (d === 2) {
      if (u === 0) letras += "VEINTE ";
      else letras += "VEINTI" + Unidades[u] + " ";
    } else if (d > 2) {
      letras += Decenas[d] + " ";
      if (u > 0) letras += "Y " + Unidades[u] + " ";
    } else if (u > 0) {
      letras += Unidades[u] + " ";
    }

    return letras;
  }

  let letrasEntero = "";
  if (entero >= 1000000) {
    const millones = Math.floor(entero / 1000000);
    letrasEntero += millones === 1 ? "UN MILLON " : convertirGrupo(millones) + "MILLONES ";
  }
  const miles = Math.floor((entero % 1000000) / 1000);
  if (miles > 0) {
    letrasEntero += miles === 1 ? "UN MIL " : convertirGrupo(miles) + "MIL ";
  }
  const unidades = entero % 1000;
  if (unidades > 0) {
    letrasEntero += convertirGrupo(unidades);
  }

  letrasEntero = letrasEntero.trim();
  if (letrasEntero === "") letrasEntero = "CERO";

  return `${letrasEntero} ${decimal}/100`;
}

export function exportarComprobanteExcel(honorario: Honorario, expediente: any) {
  const montoBolivianos = honorario.moneda === "BS" ? honorario.montoTotal : honorario.montoTotal * 6.96;
  const montoDolares = honorario.moneda === "USD" ? honorario.montoTotal : honorario.montoTotal / 6.96;

  const pctFondo = (honorario.porcentajeFondo ?? 10) / 100;

  const itBs = montoBolivianos * 0.03;
  const itUsd = montoDolares * 0.03;
  const ivaBs = montoBolivianos * 0.13;
  const ivaUsd = montoDolares * 0.13;
  const iueBs = montoBolivianos * 0.125;
  const iueUsd = montoDolares * 0.125;
  const oficinaBs = montoBolivianos * pctFondo;
  const oficinaUsd = montoDolares * pctFondo;

  const honorarioAbogadoBs = montoBolivianos - (itBs + ivaBs + iueBs + oficinaBs);
  const honorarioAbogadoUsd = montoDolares - (itUsd + ivaUsd + iueUsd + oficinaUsd);

  const abogadoNombre = expediente?.abogado_nombre || "N/A";
  const clienteNombre = expediente?.cliente?.nombres
    ? `${expediente.cliente.nombres} ${expediente.cliente.apellido_paterno || ""} ${expediente.cliente.apellido_materno || ""}`.trim()
    : "N/A";

  const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const fecha = new Date();
  const fechaFormateada = `${fecha.getDate()} de ${meses[fecha.getMonth()]} de ${fecha.getFullYear()}`;

  const letrasBs = convertirNumeroALetras(montoBolivianos);
  const letrasUsd = convertirNumeroALetras(montoDolares);

  // Construir filas para la hoja de Excel
  const data = [
    ["ITURRI & ASOCIADOS", "", "", "", "", "Nº 8"],
    ["La Paz, Bolivia", "", "", "", "", ""],
    [],
    ["COMPROBANTE DE EGRESO"],
    [],
    ["Lugar y Fecha:", `La Paz, ${fechaFormateada}`],
    ["Pagado a:", `${abogadoNombre}, pago Honorarios Profesionales de ${clienteNombre}. por presentacion y seguimiento de notificaciones, memoriales y correspondencia.`],
    ["Concepto:", "Pago de Honorarios profesionales, Impuestos de Ley, Fondos en custodia."],
    [],
    ["", "", "", "T.C.", 6.96],
    [],
    ["CODIGO", "NOMBRE CUENTA", "BOLIVIANOS (DEBE)", "BOLIVIANOS (HABER)", "DÓLAR (DEBE)", "DÓLAR (HABER)"],
    ["510201", "REMUNERACIONES", "", "", "", ""],
    ["5102010010", `Honorarios Profesionales - ${abogadoNombre}`, Number(honorarioAbogadoBs.toFixed(2)), "", Number(honorarioAbogadoUsd.toFixed(2)), ""],
    ["510202", "IMPUESTOS Y PATENTES", "", "", "", ""],
    ["5102020002", "Impuesto a las Transacciones 3%", Number(itBs.toFixed(2)), "", Number(itUsd.toFixed(2)), ""],
    ["5102020002", "Impuesto al Valor Agregado 13%", Number(ivaBs.toFixed(2)), "", Number(ivaUsd.toFixed(2)), ""],
    ["5102020002", "Impuesto Utilidades Empresa 12.5%", Number(iueBs.toFixed(2)), "", Number(iueUsd.toFixed(2)), ""],
    ["110101", "CAJA", "", "", "", ""],
    ["1101010004", "Fondos en Custodia", Number(oficinaBs.toFixed(2)), "", Number(oficinaUsd.toFixed(2)), ""],
    ["110101", "CAJA", "", "", "", ""],
    ["1101010001", "Caja Moneda Nacional", "", Number(montoBolivianos.toFixed(2)), "", Number(montoDolares.toFixed(2))],
    [],
    ["", "TOTALES", Number(montoBolivianos.toFixed(2)), Number(montoBolivianos.toFixed(2)), Number(montoDolares.toFixed(2)), Number(montoDolares.toFixed(2))],
    [],
    [`SON : ${letrasBs} BOLIVIANOS.`],
    [`SON : ${letrasUsd} DOLARES.`],
    [],
    ["ELABORADO", "AUTORIZADO", "RECIBI CONFORME"]
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(data);

  // Configurar anchos de columnas
  worksheet["!cols"] = [
    { wch: 16 }, // CODIGO
    { wch: 45 }, // NOMBRE CUENTA
    { wch: 20 }, // BS DEBE
    { wch: 20 }, // BS HABER
    { wch: 18 }, // USD DEBE
    { wch: 18 }  // USD HABER
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Comprobante Egreso");

  // Descargar archivo
  XLSX.writeFile(workbook, `Comprobante_Egreso_${honorario.id || "8"}.xlsx`);
}
