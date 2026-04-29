export const ACTIVE_STATUSES = new Set(['trialing', 'active', 'past_due']);

export function isActiveStatus(status: string | null | undefined): boolean {
  return !!status && ACTIVE_STATUSES.has(status);
}
