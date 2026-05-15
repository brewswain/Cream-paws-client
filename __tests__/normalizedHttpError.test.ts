/// <reference types="jest" />

import { AxiosError, type AxiosRequestConfig, type AxiosResponse } from "axios";

import {
  extractServerUserMessage,
  normalizeAxiosError,
  sanitizeApiUserMessage,
} from "../lib/api/normalizedHttpError";

function axErr(
  partial: Partial<AxiosError> & {
    config?: AxiosRequestConfig;
    response?: AxiosResponse;
  }
): AxiosError {
  const cfg: AxiosRequestConfig = {
    url: partial.config?.url ?? "/api/x",
    method: partial.config?.method ?? "get",
    baseURL: partial.config?.baseURL ?? "https://api.example.test",
    headers: partial.config?.headers ?? {},
    ...partial.config,
  };
  return new AxiosError(
    partial.message ?? "err",
    partial.code,
    cfg,
    partial.request,
    partial.response
  );
}

describe("sanitizeApiUserMessage", () => {
  it("strips angle-bracket segments and collapses whitespace", () => {
    expect(sanitizeApiUserMessage("  hello  <b>x</b>  world  ")).toBe("hello x world");
  });

  it("truncates long strings", () => {
    const long = "a".repeat(300);
    const out = sanitizeApiUserMessage(long, 50);
    expect(out.length).toBeLessThanOrEqual(52);
    expect(out.endsWith("…")).toBe(true);
  });
});

describe("extractServerUserMessage", () => {
  it("reads message string field", () => {
    expect(extractServerUserMessage({ message: " Bad input " })).toBe("Bad input");
  });

  it("reads error string field", () => {
    expect(extractServerUserMessage({ error: "nope" })).toBe("nope");
  });
});

describe("normalizeAxiosError", () => {
  it("classifies misconfigured base URL", () => {
    const e = axErr({
      config: { baseURL: "   ", url: "/x" },
      response: {
        status: 500,
        data: {},
        statusText: "",
        headers: {},
        config: {},
      },
    });
    const n = normalizeAxiosError(e);
    expect(n.category).toBe("misconfigured");
    expect(n.message).toMatch(/not configured/i);
  });

  it("classifies timeout", () => {
    const e = axErr({
      code: "ECONNABORTED",
      config: { baseURL: "https://api.example.test" },
    });
    const n = normalizeAxiosError(e);
    expect(n.category).toBe("network");
    expect(n.message).toMatch(/timed out/i);
  });

  it("uses server message for 422", () => {
    const e = axErr({
      response: {
        status: 422,
        data: { message: "Email bad" },
        statusText: "",
        headers: {},
        config: {},
      },
      config: { baseURL: "https://api.example.test", url: "/users" },
    });
    const n = normalizeAxiosError(e);
    expect(n.category).toBe("validation");
    expect(n.message).toBe("Email bad");
  });

  it("classifies 401", () => {
    const e = axErr({
      response: {
        status: 401,
        data: {},
        statusText: "",
        headers: {},
        config: {},
      },
      config: { baseURL: "https://api.example.test" },
    });
    expect(normalizeAxiosError(e).message).toMatch(/sign in/i);
  });
});
