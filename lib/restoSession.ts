export type RestoSession = {
  tableCode: string;
  customerName?: string;
  orderId?: string;
};

const KEY = "dinerflow_session";

export function getSession(): RestoSession | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export function setSession(s: RestoSession) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(s));
}

export function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
  localStorage.removeItem("dinerflow_cart");
}
