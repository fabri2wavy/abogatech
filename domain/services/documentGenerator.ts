/* ══════════════════════════════════════════════════════════════
   Servicio de Dominio: Motor de Generación de Documentos
   ──────────────────────────────────────────────────────────────
   Función pura que realiza reemplazo de tags dinámicos sobre
   un string de contenido utilizando datos de un expediente.
   Reubicado desde util/ a domain/services/ por ser lógica
   de negocio pura sin dependencias de infraestructura.
   ══════════════════════════════════════════════════════════════ */

export interface DatosExpediente {
  nombreCliente: string;
  ciCliente: string;
  numeroCaso: string;
  materia: string;
  juzgado: string;
  domicilioCliente: string;
}

/** Tags dinámicos soportados por el motor de generación. */
export const TAGS_DISPONIBLES = [
  '{{NOMBRE_CLIENTE}}',
  '{{CI_CLIENTE}}',
  '{{NUMERO_EXPEDIENTE}}',
  '{{MATERIA}}',
  '{{JUZGADO}}',
  '{{DOMICILIO_CLIENTE}}',
  '{{FECHA_ACTUAL}}',
] as const;

/**
 * Procesa un string de contenido reemplazando los tags dinámicos
 * con los datos reales del expediente.
 *
 * @param contenido - String crudo con tags {{TAG}}.
 * @param datos - Objeto con los valores de inyección.
 * @returns El documento final con todos los tags resueltos.
 */
export function procesarPlantilla(
  contenido: string,
  datos: DatosExpediente
): string {
  const fechaActual = new Date().toLocaleDateString('es-BO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const variablesReemplazo: Record<string, string> = {
    '{{NOMBRE_CLIENTE}}': datos.nombreCliente || '',
    '{{CI_CLIENTE}}': datos.ciCliente || '',
    '{{NUMERO_EXPEDIENTE}}': datos.numeroCaso || '',
    '{{MATERIA}}': datos.materia || '',
    '{{JUZGADO}}': datos.juzgado || '',
    '{{DOMICILIO_CLIENTE}}': datos.domicilioCliente || '',
    '{{FECHA_ACTUAL}}': fechaActual,
  };

  let documentoGenerado = contenido;

  for (const [tag, valor] of Object.entries(variablesReemplazo)) {
    /* Escape de caracteres especiales regex en el tag */
    const tagEscapado = tag.replace(/[{}]/g, '\\$&');
    const regex = new RegExp(tagEscapado, 'g');
    documentoGenerado = documentoGenerado.replace(regex, valor);
  }

  return documentoGenerado;
}
