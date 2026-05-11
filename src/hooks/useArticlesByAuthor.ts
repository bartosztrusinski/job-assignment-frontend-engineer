import { useQuery } from "@tanstack/react-query";
import type { Article } from "types";
import { useApiFetch } from "hooks/useApiFetch";

type ArticlesResponse = { articles: Article[] };

export function useArticlesByAuthor(username: string) {
  const apiFetch = useApiFetch();

  return useQuery<ArticlesResponse>({
    queryKey: ["articles", username],
    keepPreviousData: true,
    queryFn: async () => {
      const response = await apiFetch(`/articles?author=${username}`);
      if (!response.ok) {
        throw new Error("Failed to fetch articles");
      }
      return response.json();
    },
  });
}
