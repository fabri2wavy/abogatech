export type FirmRole = 'admin' | 'finanzas' | 'asociado_senior' | 'abogado' | 'cliente';
export type MembershipStatus = 'invitado' | 'activo' | 'suspendido';

export interface FirmSummary {
  id: string;
  nombre: string;
  slug: string;
  status: string;
}

export interface FirmMembershipContext {
  membershipId: string;
  firmId: string;
  userId: string;
  role: FirmRole;
  status: 'activo';
  firm: FirmSummary;
}

export interface CurrentSaaSUser {
  userId: string;
  email: string;
  nombreCompleto: string;
  memberships: FirmMembershipContext[];
}

type InactiveFirm = { firmId: null; firm: null; membership: null; role: null };
export type FirmContextState =
  | (InactiveFirm & { status: 'unauthenticated'; user: null; memberships: [] })
  | (InactiveFirm & { status: 'error'; user: null; memberships: []; message: string })
  | (InactiveFirm & {
      status: 'no_membership' | 'firm_selection_required';
      user: CurrentSaaSUser;
      memberships: FirmMembershipContext[];
    })
  | {
      status: 'ready';
      user: CurrentSaaSUser;
      memberships: FirmMembershipContext[];
      firmId: string;
      firm: FirmSummary;
      membership: FirmMembershipContext;
      role: FirmRole;
    };

export const inactiveFirm = { firmId: null, firm: null, membership: null, role: null };

/** La preferencia nunca autoriza: solo se acepta un membership activo del usuario. */
export function resolveActiveFirm(user: CurrentSaaSUser, preferredFirmId?: string): FirmContextState {
  const memberships = user.memberships.filter(
    (membership) => membership.status === 'activo' && membership.userId === user.userId,
  );
  const currentUser = { ...user, memberships };
  const membership = memberships.length === 1
    ? memberships[0]
    : memberships.find((item) => item.firmId === preferredFirmId);

  if (!membership) {
    return {
      ...inactiveFirm,
      status: memberships.length === 0 ? 'no_membership' : 'firm_selection_required',
      user: currentUser,
      memberships,
    };
  }
  return {
    status: 'ready', user: currentUser, memberships, membership,
    firmId: membership.firmId, firm: membership.firm, role: membership.role,
  };
}
