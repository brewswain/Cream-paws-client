import type { FieldPath } from "react-hook-form";

import type { CustomerCreateFormValues } from "../../schemas/customerWrite";

function firstStringMessage(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (Array.isArray(value) && value.length > 0) {
    const first = value[0];
    if (typeof first === "string" && first.trim()) return first.trim();
    if (typeof first === "object" && first && "message" in first) {
      const m = (first as { message?: unknown }).message;
      if (typeof m === "string" && m.trim()) return m.trim();
    }
  }
  return null;
}

/**
 * Pulls `{ field: message }` from common API validation JSON shapes.
 * Does not depend on Axios — pass `response.data` when available.
 */
export function extractValidationFieldMessagesFromBody(
  data: unknown
): Record<string, string> {
  if (data == null || typeof data !== "object") return {};
  const o = data as Record<string, unknown>;
  const raw = o.errors ?? o.fieldErrors;
  if (raw == null || typeof raw !== "object") return {};

  const out: Record<string, string> = {};
  for (const [key, val] of Object.entries(raw as Record<string, unknown>)) {
    const msg = firstStringMessage(val);
    if (msg) out[key] = msg;
  }
  return out;
}

export type CustomerWritableFieldPath = FieldPath<CustomerCreateFormValues>;

const ROOT_KEYS = new Set([
  "name",
  "contactNumber",
  "location",
  "city",
  "pets",
]);

/** Maps server keys to RHF paths we support on the customer form. */
export function mapCustomerApiKeysToFormPaths(
  raw: Record<string, string>
): Partial<Record<CustomerWritableFieldPath, string>> {
  const out: Partial<Record<CustomerWritableFieldPath, string>> = {};
  for (const [key, message] of Object.entries(raw)) {
    if (ROOT_KEYS.has(key) || /^pets\.\d+\.(name|breed)$/.test(key)) {
      out[key as CustomerWritableFieldPath] = message;
    }
  }
  return out;
}
