import axios, { type AxiosError, type AxiosInstance } from "axios";

const DEFAULT_MAX_USER_MESSAGE = 280;

export type HttpErrorCategory =
  | "misconfigured"
  | "network"
  | "unauthorized"
  | "validation"
  | "server"
  | "unknown";

/** Thrown from the shared Axios error interceptor after canonical logging. */
export class NormalizedHttpError extends Error {
  readonly category: HttpErrorCategory;
  readonly statusCode: number | null;
  readonly causeError: unknown;

  constructor(opts: {
    message: string;
    category: HttpErrorCategory;
    statusCode: number | null;
    causeError: unknown;
  }) {
    super(opts.message);
    this.name = "NormalizedHttpError";
    this.category = opts.category;
    this.statusCode = opts.statusCode;
    this.causeError = opts.causeError;
  }
}

export function sanitizeApiUserMessage(
  raw: string,
  maxLen = DEFAULT_MAX_USER_MESSAGE
): string {
  let noTags = raw;
  while (/<[^>]*>/.test(noTags)) {
    noTags = noTags.replace(/<[^>]*>/g, " ");
  }
  const collapsed = noTags.replace(/\s+/g, " ").trim();
  return collapsed.length > maxLen ? `${collapsed.slice(0, maxLen)}…` : collapsed;
}

export function extractServerUserMessage(data: unknown): string | null {
  if (data == null) return null;
  if (typeof data === "string") {
    const t = data.trim();
    return t.length ? t : null;
  }
  if (typeof data === "object") {
    const o = data as Record<string, unknown>;
    if (typeof o.message === "string" && o.message.trim()) return o.message.trim();
    if (typeof o.error === "string" && o.error.trim()) return o.error.trim();
    const errs = o.errors;
    if (Array.isArray(errs) && errs.length > 0) {
      const first = errs[0];
      if (typeof first === "string" && first.trim()) return first.trim();
      if (typeof first === "object" && first && "message" in first) {
        const m = (first as { message?: unknown }).message;
        if (typeof m === "string" && m.trim()) return m.trim();
      }
    }
  }
  return null;
}

export function normalizeAxiosError(error: AxiosError): NormalizedHttpError {
  const baseURL = (error.config?.baseURL ?? "").trim();
  if (!baseURL) {
    return new NormalizedHttpError({
      message: "API address is not configured.",
      category: "misconfigured",
      statusCode: null,
      causeError: error,
    });
  }

  const status = error.response?.status ?? null;
  const body = error.response?.data;

  if (!error.response) {
    if (error.code === "ECONNABORTED") {
      return new NormalizedHttpError({
        message: "Request timed out.",
        category: "network",
        statusCode: null,
        causeError: error,
      });
    }
    const msg = /network/i.test(error.message || "")
      ? "Network unavailable."
      : "Could not reach the server.";
    return new NormalizedHttpError({
      message: msg,
      category: "network",
      statusCode: null,
      causeError: error,
    });
  }

  const serverMsg = extractServerUserMessage(body);

  if (status === 401) {
    return new NormalizedHttpError({
      message: "Please sign in again.",
      category: "unauthorized",
      statusCode: 401,
      causeError: error,
    });
  }

  if (status === 400 || status === 422) {
    const msg = serverMsg
      ? sanitizeApiUserMessage(serverMsg)
      : "Request could not be validated.";
    return new NormalizedHttpError({
      message: msg,
      category: "validation",
      statusCode: status,
      causeError: error,
    });
  }

  if (status != null && status >= 500) {
    const msg = serverMsg
      ? sanitizeApiUserMessage(serverMsg)
      : "Server error. Please try again.";
    return new NormalizedHttpError({
      message: msg,
      category: "server",
      statusCode: status,
      causeError: error,
    });
  }

  if (serverMsg) {
    return new NormalizedHttpError({
      message: sanitizeApiUserMessage(serverMsg),
      category: "unknown",
      statusCode: status,
      causeError: error,
    });
  }

  const fallback =
    status != null ? `Request failed (${status}).` : "Request failed.";
  return new NormalizedHttpError({
    message: fallback,
    category: "unknown",
    statusCode: status,
    causeError: error,
  });
}

export function logCanonicalHttpFailure(error: AxiosError): void {
  const method = (error.config?.method ?? "get").toUpperCase();
  const rawUrl = error.config?.url ?? "";
  let path = rawUrl;
  try {
    if (rawUrl.startsWith("http")) {
      const u = new URL(rawUrl);
      path = `${u.pathname}${u.search}`;
    }
  } catch {
    /* keep rawUrl */
  }
  const status = error.response?.status;
  let dataSnippet = "";
  try {
    const d = error.response?.data;
    if (typeof d === "string") dataSnippet = d.slice(0, 500);
    else dataSnippet = JSON.stringify(d ?? null).slice(0, 500);
  } catch {
    dataSnippet = "[unserializable]";
  }

  console.error("[http:failure]", {
    method,
    path,
    baseURL: error.config?.baseURL ?? "",
    status,
    code: error.code,
    dataSnippet,
  });
}

export function getUserVisibleHttpMessage(error: unknown): string {
  if (error instanceof NormalizedHttpError) return error.message;
  if (error instanceof Error) return error.message;
  return String(error ?? "Unknown error");
}

export function attachAxiosErrorInterceptor(instance: AxiosInstance): void {
  instance.interceptors.response.use(
    (response) => response,
    (error: unknown) => {
      if (axios.isAxiosError(error)) {
        logCanonicalHttpFailure(error);
        return Promise.reject(normalizeAxiosError(error));
      }
      return Promise.reject(error);
    }
  );
}
