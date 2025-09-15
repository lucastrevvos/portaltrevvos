// apps/web/src/lib/api.ts
const API = process.env.NEXT_PUBLIC_API_URL!;
const APP = process.env.NEXT_PUBLIC_APP_SLUG || "portal";

export type ApiError = {
  message: string;
  statusCode?: number;
  code?: string;
  fields?: string[];
};

// ✅ classe concreta para usar com `instanceof`
export class ApiHttpError extends Error {
  statusCode?: number;
  code?: string;
  fields?: string[];

  constructor(
    message: string,
    opts?: { statusCode?: number; code?: string; fields?: string[] }
  ) {
    super(message);
    this.name = "ApiHttpError";
    this.statusCode = opts?.statusCode;
    this.code = opts?.code;
    this.fields = opts?.fields;
  }
}

type FetchOptions<TBody = unknown> = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  accessToken?: string;
  body?: TBody;
  headers?: Record<string, string>;
  rawText?: boolean;
};

export async function apiFetch<TResponse = unknown, TBody = unknown>(
  path: string,
  opts: FetchOptions<TBody> = {}
): Promise<TResponse> {
  const headers: Record<string, string> = {
    "x-app-slug": APP,
    ...(opts.headers || {}),
  };
  if (opts.body) headers["content-type"] = "application/json";
  if (opts.accessToken) headers.Authorization = `Bearer ${opts.accessToken}`;

  const res = await fetch(`${API}${path}`, {
    method: opts.method ?? "GET",
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    let parsed: ApiError | null = null;
    try {
      parsed = text ? (JSON.parse(text) as ApiError) : null;
    } catch {
      /* ignore */
    }

    // ✅ lançar instância da classe com metadados
    throw new ApiHttpError(parsed?.message || text || `HTTP ${res.status}`, {
      statusCode: parsed?.statusCode ?? res.status,
      code: parsed?.code,
      fields: parsed?.fields,
    });
  }

  if (opts.rawText) {
    return (await res.text()) as unknown as TResponse;
  }
  const data = (await res.json()) as TResponse;
  return data;
}
