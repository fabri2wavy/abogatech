"use client";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Honorario } from "@/domain/entities/Finanzas";

interface ComprobanteImpresionProps {
  honorario: Honorario;
  expediente: any;
}

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

export default function ComprobanteImpresion({ honorario, expediente }: ComprobanteImpresionProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const abogadoNombre = expediente?.abogado_nombre || "____________________";
  const clienteNombre = expediente?.cliente?.nombres
    ? `${expediente.cliente.nombres} ${expediente.cliente.apellido_paterno} ${expediente.cliente.apellido_materno}`
    : "____________________";

  const formatear = (num: number) => num.toLocaleString("es-BO", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const letrasBs = convertirNumeroALetras(montoBolivianos);
  const letrasUsd = convertirNumeroALetras(montoDolares);

  const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const fecha = new Date();
  const fechaFormateada = `${fecha.getDate()} de ${meses[fecha.getMonth()]} de ${fecha.getFullYear()}`;

  const content = (
    <>
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 0;
          }

          /* 1. Ocultar absolutamente todo en el body excepto nuestro comprobante que está en la raíz */
          body > *:not(.comprobante-print-root) {
            display: none !important;
          }

          /* 2. Posicionar el comprobante en el origen exacto (0,0) de la hoja física */
          .comprobante-print-root {
            display: block !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            box-sizing: border-box !important;
            margin: 0 !important;
            padding: 8mm 10mm !important;
            background: white !important;
          }
        }
      `}</style>

      <div className="hidden print:block comprobante-print-root w-full text-black bg-white" style={{ fontFamily: "Arial, sans-serif" }}>
        {/* Cabecera */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="font-bold text-base italic">ITURRI & ASOCIADOS</h1>
            <p className="italic text-xs">La Paz, Bolivia</p>
          </div>
          <div className="border border-black px-6 py-1 font-bold text-lg">
            8
          </div>
        </div>

        <h2 className="text-center font-bold text-lg uppercase tracking-widest mb-4">
          Comprobante de Egreso
        </h2>

        {/* Datos descriptivos */}
        <table className="w-full text-xs mb-3">
          <tbody>
            <tr>
              <td className="font-bold w-32 align-top py-1">Lugar y Fecha:</td>
              <td className="align-top py-1">La Paz, {fechaFormateada}</td>
            </tr>
            <tr>
              <td className="font-bold align-top py-1">Pagado a:</td>
              <td className="align-top py-1">
                {abogadoNombre}, pago Honorarios Profesionales de {clienteNombre}.<br />
                por presentacion y seguimiento de notificaciones, memoriales y correspondencia.
              </td>
            </tr>
            <tr>
              <td className="font-bold align-top py-1">Concepto:</td>
              <td className="align-top py-1">Pago de Honorarios profesionales, Impuestos de Ley, Fondos en custodia.</td>
            </tr>
          </tbody>
        </table>

        {/* Tipo de Cambio */}
        <div className="flex justify-end mb-2 text-xs">
          <table className="border-collapse border border-black">
            <tbody>
              <tr>
                <td className="border-b border-black px-6 py-1 text-center font-bold bg-gray-50">T.C.</td>
              </tr>
              <tr>
                <td className="px-6 py-1 text-center font-bold">6,96</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Tabla Contable */}
        <table className="w-full border-collapse text-xs text-right border border-black mb-2">
          <thead>
            <tr>
              <th className="border border-black px-2 py-2 text-center bg-white font-bold w-24" rowSpan={2}>CODIGO</th>
              <th className="border border-black px-2 py-2 text-center bg-white font-bold" rowSpan={2}>NOMBRE CUENTA</th>
              <th className="border border-black px-2 py-1 text-center bg-white font-bold w-24" colSpan={2}>BOLIVIANOS</th>
              <th className="border border-black px-2 py-1 text-center bg-white font-bold w-24" colSpan={2}>DÓLAR</th>
            </tr>
            <tr>
              <th className="border border-black px-2 py-1 text-center bg-white font-bold">DEBE</th>
              <th className="border border-black px-2 py-1 text-center bg-white font-bold">HABER</th>
              <th className="border border-black px-2 py-1 text-center bg-white font-bold">DEBE</th>
              <th className="border border-black px-2 py-1 text-center bg-white font-bold">HABER</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border-l border-r border-black px-2 py-1 text-right">510201</td>
              <td className="border-l border-r border-black px-2 py-1 text-left"><span className="underline">REMUNERACIONES</span></td>
              <td className="border-l border-r border-black px-2 py-1"></td>
              <td className="border-l border-r border-black px-2 py-1"></td>
              <td className="border-l border-r border-black px-2 py-1"></td>
              <td className="border-l border-r border-black px-2 py-1"></td>
            </tr>
            <tr>
              <td className="border-l border-r border-black px-2 py-1 text-right">5102010010</td>
              <td className="border-l border-r border-black px-2 py-1 text-left">
                Honorarios Profesionales<br />
                <span>{abogadoNombre}</span>
              </td>
              <td className="border-l border-r border-black px-2 py-1 align-top">{formatear(honorarioAbogadoBs)}</td>
              <td className="border-l border-r border-black px-2 py-1"></td>
              <td className="border-l border-r border-black px-2 py-1 align-top">{formatear(honorarioAbogadoUsd)}</td>
              <td className="border-l border-r border-black px-2 py-1"></td>
            </tr>
            <tr>
              <td className="border-l border-r border-black px-2 py-1 text-right">510202</td>
              <td className="border-l border-r border-black px-2 py-1 text-left"><span className="underline">IMPUESTOS Y PATENTES</span></td>
              <td className="border-l border-r border-black px-2 py-1"></td>
              <td className="border-l border-r border-black px-2 py-1"></td>
              <td className="border-l border-r border-black px-2 py-1"></td>
              <td className="border-l border-r border-black px-2 py-1"></td>
            </tr>
            <tr>
              <td className="border-l border-r border-black px-2 py-1 text-right">5102020002</td>
              <td className="border-l border-r border-black px-2 py-1 text-left">Impuesto a las Transacciones &nbsp;3%</td>
              <td className="border-l border-r border-black px-2 py-1">{formatear(itBs)}</td>
              <td className="border-l border-r border-black px-2 py-1"></td>
              <td className="border-l border-r border-black px-2 py-1">{formatear(itUsd)}</td>
              <td className="border-l border-r border-black px-2 py-1"></td>
            </tr>
            <tr>
              <td className="border-l border-r border-black px-2 py-1 text-right">5102020002</td>
              <td className="border-l border-r border-black px-2 py-1 text-left">Impuesto al Valor Agregado &nbsp;13%</td>
              <td className="border-l border-r border-black px-2 py-1">{formatear(ivaBs)}</td>
              <td className="border-l border-r border-black px-2 py-1"></td>
              <td className="border-l border-r border-black px-2 py-1">{formatear(ivaUsd)}</td>
              <td className="border-l border-r border-black px-2 py-1"></td>
            </tr>
            <tr>
              <td className="border-l border-r border-black px-2 py-1 text-right">5102020002</td>
              <td className="border-l border-r border-black px-2 py-1 text-left">Impuesto Utilidades Empresa &nbsp;12,5%</td>
              <td className="border-l border-r border-black px-2 py-1">{formatear(iueBs)}</td>
              <td className="border-l border-r border-black px-2 py-1"></td>
              <td className="border-l border-r border-black px-2 py-1">{formatear(iueUsd)}</td>
              <td className="border-l border-r border-black px-2 py-1"></td>
            </tr>
            <tr>
              <td className="border-l border-r border-black px-2 py-1 text-right">110101</td>
              <td className="border-l border-r border-black px-2 py-1 text-left"><span className="underline">CAJA</span></td>
              <td className="border-l border-r border-black px-2 py-1"></td>
              <td className="border-l border-r border-black px-2 py-1"></td>
              <td className="border-l border-r border-black px-2 py-1"></td>
              <td className="border-l border-r border-black px-2 py-1"></td>
            </tr>
            <tr>
              <td className="border-l border-r border-black px-2 py-1 text-right">1101010004</td>
              <td className="border-l border-r border-black px-2 py-1 text-left">Fondos en Custodia</td>
              <td className="border-l border-r border-black px-2 py-1">{formatear(oficinaBs)}</td>
              <td className="border-l border-r border-black px-2 py-1"></td>
              <td className="border-l border-r border-black px-2 py-1">{formatear(oficinaUsd)}</td>
              <td className="border-l border-r border-black px-2 py-1"></td>
            </tr>
            <tr>
              <td className="border-l border-r border-black px-2 py-1 text-right">110101</td>
              <td className="border-l border-r border-black px-2 py-1 text-left"><span className="underline">CAJA</span></td>
              <td className="border-l border-r border-black px-2 py-1"></td>
              <td className="border-l border-r border-black px-2 py-1"></td>
              <td className="border-l border-r border-black px-2 py-1"></td>
              <td className="border-l border-r border-black px-2 py-1"></td>
            </tr>
            <tr>
              <td className="border-l border-r border-black px-2 py-1 text-right pb-4">1101010001</td>
              <td className="border-l border-r border-black px-2 py-1 text-left pb-4">Caja Moneda Nacional</td>
              <td className="border-l border-r border-black px-2 py-1 pb-4"></td>
              <td className="border-l border-r border-black px-2 py-1 pb-4">{formatear(montoBolivianos)}</td>
              <td className="border-l border-r border-black px-2 py-1 pb-4"></td>
              <td className="border-l border-r border-black px-2 py-1 pb-4">{formatear(montoDolares)}</td>
            </tr>

            {/* Totales */}
            <tr className="font-bold">
              <td className="border border-black px-2 py-2 text-right" colSpan={2}>TOTALES</td>
              <td className="border border-black px-2 py-2 text-right">{formatear(montoBolivianos)}</td>
              <td className="border border-black px-2 py-2 text-right">{formatear(montoBolivianos)}</td>
              <td className="border border-black px-2 py-2 text-right">{formatear(montoDolares)}</td>
              <td className="border border-black px-2 py-2 text-right">{formatear(montoDolares)}</td>
            </tr>
          </tbody>
        </table>

        {/* Footer text (Monto en literales) */}
        <div className="mt-2 text-xs uppercase tracking-wide border-b border-black pb-2">
          <p>SON : {letrasBs} BOLIVIANOS.</p>
          <p>SON : {letrasUsd} DOLARES.</p>
        </div>

        {/* Firmas */}
        <div className="grid grid-cols-[1fr_1fr_1.5fr] text-xs text-center mt-3 gap-0 border-l border-r border-b border-black">
          <div className="border-r border-black min-h-[60px] flex flex-col justify-end p-2 font-bold uppercase">
            ELABORADO
          </div>
          <div className="border-r border-black min-h-[60px] flex flex-col justify-end p-2 font-bold uppercase">
            AUTORIZADO
          </div>
          <div className="min-h-[60px] flex flex-col justify-between">
            <div className="p-2 pt-2 space-y-1.5 text-left px-4 text-xs flex-1 font-mono">
              <div className="flex justify-between items-end">
                <span>Nombre</span>
                <span className="w-48 border-b-2 border-dotted border-black inline-block"></span>
              </div>
              <div className="flex justify-between items-end">
                <span>C.I.</span>
                <span className="w-48 border-b-2 border-dotted border-black inline-block"></span>
              </div>
              <div className="flex justify-between items-end">
                <span>Firma</span>
                <span className="w-48 border-b-2 border-dotted border-black inline-block"></span>
              </div>
            </div>
            <div className="text-center font-bold py-1 uppercase border-t border-black bg-white">
              RECIBI CONFORME
            </div>
          </div>
        </div>
      </div>
    </>
  );

  if (!mounted) return null;

  return createPortal(content, document.body);
}
