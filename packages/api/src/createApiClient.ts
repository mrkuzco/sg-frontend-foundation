export interface ApiClientConfig {
  baseUrl: string;
  headers?: Record<string, string>;
}

export function createApiClient(config: ApiClientConfig) {
  const { baseUrl, headers: defaultHeaders = {} } = config;

  async function request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  return {
    get: <T>(endpoint: string) => request<T>(endpoint),
    post: <T>(endpoint: string, body: unknown) =>
      request<T>(endpoint, {
        method: "POST",
        body: JSON.stringify(body),
      }),
    put: <T>(endpoint: string, body: unknown) =>
      request<T>(endpoint, {
        method: "PUT",
        body: JSON.stringify(body),
      }),
    delete: <T>(endpoint: string) =>
      request<T>(endpoint, { method: "DELETE" }),
  };
}
