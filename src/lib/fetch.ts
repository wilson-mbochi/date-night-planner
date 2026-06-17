const USER_AGENT = "DateNightPlanner/1.0 (date planning app)";

export function getUserAgent(): string {
  return USER_AGENT;
}

export async function fetchWithUserAgent(
  url: string,
  init?: RequestInit
): Promise<Response> {
  return fetch(url, {
    ...init,
    headers: {
      "User-Agent": USER_AGENT,
      Accept: "application/json",
      ...init?.headers,
    },
  });
}
