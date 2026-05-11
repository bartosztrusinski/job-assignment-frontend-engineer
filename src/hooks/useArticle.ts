import { useQuery } from "@tanstack/react-query";
import type { Article } from "types";
import { useApiFetch } from "hooks/useApiFetch";

type SingleArticleResponse = { article: Article };

export function useArticle(slug: string) {
  const apiFetch = useApiFetch();

  return useQuery<SingleArticleResponse>({
    queryKey: ["article", slug],
    queryFn: async () => {
      const response = await apiFetch(`/articles/${slug}`);
      if (!response.ok) {
        throw new Error("Failed to fetch article");
      }
      return response.json();
    },
  });
}
