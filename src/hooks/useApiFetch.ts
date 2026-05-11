import { useAuth } from "contexts/AuthContext";
import { apiFetch } from "utils/apiFetch";

export function useApiFetch() {
  const { currentUser } = useAuth();
  return (path: string, init?: RequestInit) => apiFetch(path, init, currentUser?.token);
}
