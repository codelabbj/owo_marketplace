import { env } from "@/lib/config/env";

export class ApiError extends Error {
  status: number;
  data: unknown;
  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export type FetchOptions = {
  searchParams?: Record<string, string | number | undefined | null>;
  signal?: AbortSignal;
  revalidate?: number | false;
  tags?: string[];
  method?: "GET" | "POST";
  jsonBody?: unknown;
};

function buildUrl(path: string, searchParams?: FetchOptions["searchParams"]): string {
  const base = env.apiBaseUrl.replace(/\/+$/, "");
  const url = new URL(`${base}${path.startsWith("/") ? path : `/${path}`}`);
  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (value === undefined || value === null || value === "") continue;
      url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

export async function apiFetch<T = unknown>(
  path: string,
  options: FetchOptions = {},
): Promise<T> {
  const url = buildUrl(path, options.searchParams);

  const method = options.method ?? "GET";
  const init: RequestInit & { next?: { revalidate?: number; tags?: string[] } } = {
    method,
    headers: {
      Accept: "application/json",
      ...(method !== "GET" && options.jsonBody !== undefined
        ? { "Content-Type": "application/json" }
        : {}),
    },
    signal: options.signal,
    ...(method !== "GET" && options.jsonBody !== undefined
      ? { body: JSON.stringify(options.jsonBody) }
      : {}),
  };

  if (options.revalidate !== undefined || options.tags) {
    init.next = {};
    if (typeof options.revalidate === "number") init.next.revalidate = options.revalidate;
    if (options.tags) init.next.tags = options.tags;
  }

  const res = await fetch(url, init);
  const text = await res.text();
  let json: unknown = undefined;
  try {
    json = text ? JSON.parse(text) : undefined;
  } catch {
    // text was not JSON
  }
  if (!res.ok) {
    throw new ApiError(
      `Request failed with status ${res.status}`,
      res.status,
      json ?? text,
    );
  }
  return json as T;
}
