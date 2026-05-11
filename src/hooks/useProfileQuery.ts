import { useQuery } from "@tanstack/react-query";
import type { Profile } from "types";
import { useApiFetch } from "hooks/useApiFetch";

type ProfileResponse = { profile: Profile };

export function useProfileQuery(username: string) {
  const apiFetch = useApiFetch();

  return useQuery<ProfileResponse>({
    queryKey: ["profile", username],
    queryFn: async () => {
      const response = await apiFetch(`/profiles/${username}`);
      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }
      return response.json();
    },
  });
}
