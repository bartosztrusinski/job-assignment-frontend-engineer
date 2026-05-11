import { useQuery } from "@tanstack/react-query";
import type { Article } from "types";
import { useApiFetch } from "hooks/useApiFetch";

type ArticlesResponse = { articles: Article[] };

export function useArticlesQuery(tab: "feed" | "global") {
  const apiFetch = useApiFetch();

  return useQuery<ArticlesResponse>({
    queryKey: ["articles", tab],
    keepPreviousData: true,
    queryFn: async () => {
      const response = await apiFetch(tab === "feed" ? `/articles/feed` : `/articles`);
      if (!response.ok) {
        throw new Error("Failed to fetch articles");
      }
      return response.json();
    },
  });
}
