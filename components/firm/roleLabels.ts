import type { FirmRole } from '@/domain/entities/FirmContext';

export const roleLabels: Record<FirmRole, string> = {
  admin: 'Administrador',
  finanzas: 'Finanzas',
  asociado_senior: 'Asociado Senior',
  abogado: 'Abogado',
  cliente: 'Cliente',
};
