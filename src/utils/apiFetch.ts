import { User } from "types";

const API_BASE_URL = `${process.env.REACT_APP_API_URL}/api`;

export function apiFetch(path: string, init?: RequestInit, token?: User["token"]) {
  const headers = new Headers(init?.headers);

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Token ${token}`);
  }

  return fetch(`${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`, {
    ...init,
    headers,
  });
}
