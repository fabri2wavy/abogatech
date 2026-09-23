export interface MiembroEquipo {
  id: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  email: string | null;
  telefono: string | null;
  rol: string;
  cargo: string;
  especialidad: string | null;
  estadoLaboral: 'activo' | 'inactivo' | 'vacaciones';
}
