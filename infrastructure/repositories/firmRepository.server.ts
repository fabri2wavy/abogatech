import 'server-only';

import { cache } from 'react';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { createClient } from '@/infrastructure/supabase/server';
import { inactiveFirm, resolveActiveFirm } from '@/domain/entities/FirmContext';
import type { FirmContextState, FirmMembershipContext } from '@/domain/entities/FirmContext';

export const ACTIVE_FIRM_COOKIE = 'active_firm_id';

const profileSchema = z.object({ id: z.string(), nombres: z.string().nullable() });
const membershipSchema = z.object({
  id: z.string(), firm_id: z.string(), user_id: z.string(),
  role: z.enum(['admin', 'finanzas', 'asociado_senior', 'abogado', 'cliente']),
  status: z.literal('activo'),
});
const firmSchema = z.object({
  id: z.string(), nombre: z.string(), slug: z.string(), status: z.string(),
});

/** Deduplicación por request; nunca almacena identidades entre usuarios o requests. */
export const obtenerContextoUsuarioActualServer = cache(async (): Promise<FirmContextState> => {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError && authError.name !== 'AuthSessionMissingError' && authError.status !== 401 && authError.status !== 403) {
      throw authError;
    }
    if (!user) return { ...inactiveFirm, status: 'unauthenticated', user: null, memberships: [] };

    const [profileResult, membershipsResult] = await Promise.all([
      supabase.from('profiles').select('id, nombres').eq('id', user.id).maybeSingle(),
      supabase.from('firm_memberships').select('id, firm_id, user_id, role, status')
        .eq('user_id', user.id).eq('status', 'activo'),
    ]);
    if (profileResult.error) throw profileResult.error;
    if (membershipsResult.error) throw membershipsResult.error;
    const profile = profileSchema.parse(profileResult.data);
    if (profile.id !== user.id) throw new Error('El profile no corresponde al usuario autenticado.');
    const rows = z.array(membershipSchema).parse(membershipsResult.data);
    const firmIds = [...new Set(rows.map((row) => row.firm_id))];
    const memberships: FirmMembershipContext[] = [];

    if (firmIds.length > 0) {
      // Sin asumir nombres de FK o RPC; siempre bajo la sesión y RLS del usuario.
      const { data, error } = await supabase.from('firms')
        .select('id, nombre, slug, status').in('id', firmIds);
      if (error) throw error;
      const firms = new Map(z.array(firmSchema).parse(data).map((firm) => [firm.id, firm]));
      for (const row of rows) {
        const firm = firms.get(row.firm_id);
        // Una firma que RLS no permite ver no produce un contexto operativo.
        if (!firm || row.user_id !== user.id) continue;
        memberships.push({
          membershipId: row.id, firmId: row.firm_id, userId: row.user_id,
          role: row.role, status: row.status,
          firm: { id: firm.id, nombre: firm.nombre, slug: firm.slug, status: firm.status },
        });
      }
    }

    const preferredFirmId = (await cookies()).get(ACTIVE_FIRM_COOKIE)?.value;
    return resolveActiveFirm({
      userId: user.id, email: user.email ?? '',
      nombreCompleto: profile.nombres?.trim() || 'Sin registrar', memberships,
    }, preferredFirmId);
  } catch (error) {
    console.error('[firmRepository] No se pudo resolver el contexto SaaS:', error);
    return {
      ...inactiveFirm, status: 'error', user: null, memberships: [],
      message: 'No se pudo cargar tu perfil o tus firmas. Intenta nuevamente.',
    };
  }
});

/** Solo llamar desde Server Actions o Route Handlers, donde se pueden escribir cookies. */
export async function persistirPreferenciaFirma(context: FirmContextState): Promise<void> {
  if (context.status === 'error') return;
  const cookieStore = await cookies();
  const firmId = context.status === 'ready' ? context.firmId : undefined;
  if (cookieStore.get(ACTIVE_FIRM_COOKIE)?.value === firmId) return;
  if (!firmId) {
    cookieStore.delete(ACTIVE_FIRM_COOKIE);
    return;
  }
  cookieStore.set(ACTIVE_FIRM_COOKIE, firmId, {
    httpOnly: true, secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 30,
  });
}
