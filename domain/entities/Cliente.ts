export interface Cliente {
  id: string;
  nombreCompleto: string;
  email: string;
  telefono: string;
  rol: string;

  tipoCliente?: 'persona' | 'empresa';
  etapaComercial?: 'potencial' | 'activo';
  nombreEmpresa?: string | null;
  nit?: string;
  representanteLegal?: string | null;
  areaEspecialidad?: string | null;
  abogadoContacto?: string;

  nombresLegales?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  ci?: string;
  expedido?: string;
  nacionalidad?: string;
  fechaNacimiento?: string;
  estadoCivil?: string;
  profesion?: string;
  direccion?: string;

  /** Nombre o descripción de quien refirió al cliente a la firma. */
  referidoPor?: string;
  /** Teléfono, email u otro dato de contacto del referidor. */
  contactoReferidor?: string;

  telefonoLaboral?: string;
  direccionOficina?: string;
}
