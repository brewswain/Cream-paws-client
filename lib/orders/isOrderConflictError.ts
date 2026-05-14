import axios from "axios";

export function isOrderConflictError(error: unknown): boolean {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    (error as { response?: { status?: number } }).response?.status === 409
  ) {
    return true;
  }
  if (axios.isAxiosError(error)) {
    return error.response?.status === 409;
  }
  if (error instanceof Error) {
    const m = error.message.toLowerCase();
    return m.includes("conflict") || m.includes("409") || m.includes("stale");
  }
  return false;
}
