const REFERRAL_KEY = "pf_pending_referral";

export function savePendingReferral(code: string) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(REFERRAL_KEY, code.trim().toUpperCase());
}

export function getPendingReferral(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(REFERRAL_KEY);
}

export function clearPendingReferral() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(REFERRAL_KEY);
}
