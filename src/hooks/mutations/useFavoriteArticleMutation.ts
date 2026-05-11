import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { QueryKey } from "@tanstack/react-query";

import { useAuth } from "contexts/AuthContext";
import type { Article } from "types";

import { useApiFetch } from "hooks/useApiFetch";

type ArticleResponse = { article: Article };
type ArticleListResponse = { articles: Article[] };
type FavoriteMutationVariables = {
  slug: string;
  favorited: boolean;
};
type FavoriteMutationContext = {
  previousArticleResponses: Array<{ queryKey: QueryKey; data?: ArticleResponse }>;
  previousListResponses: Array<{ queryKey: QueryKey; data?: ArticleListResponse }>;
};

function applyOptimisticFavorite(article: Article, favorited: boolean) {
  const favoritesCount =
    favorited && !article.favorited
      ? article.favoritesCount + 1
      : !favorited && article.favorited
      ? Math.max(0, article.favoritesCount - 1)
      : article.favoritesCount;

  return { ...article, favorited, favoritesCount };
}

export function useFavoriteArticleMutation() {
  const queryClient = useQueryClient();
  const { currentUser } = useAuth();
  const apiFetch = useApiFetch();

  return useMutation<ArticleResponse, Error, FavoriteMutationVariables, FavoriteMutationContext>({
    mutationFn: async ({ slug, favorited }): Promise<ArticleResponse> => {
      if (!currentUser) {
        throw new Error("You need to be logged in to favorite posts.");
      }

      const response = await apiFetch(`/articles/${slug}/favorite`, { method: favorited ? "DELETE" : "POST" });

      if (!response.ok) {
        throw new Error(favorited ? "Failed to remove post from favorites." : "Failed to add post to favorites.");
      }

      return response.json();
    },
    onMutate: async ({ slug, favorited }): Promise<FavoriteMutationContext> => {
      await queryClient.cancelQueries({ queryKey: ["article"] });
      await queryClient.cancelQueries({ queryKey: ["articles"] });

      const previousArticleResponses = queryClient
        .getQueriesData<ArticleResponse>({ queryKey: ["article"] })
        .map(([queryKey, data]) => ({ queryKey, data }));
      const previousListResponses = queryClient
        .getQueriesData<ArticleListResponse>({ queryKey: ["articles"] })
        .map(([queryKey, data]) => ({ queryKey, data }));

      for (const { queryKey, data } of previousArticleResponses) {
        if (data?.article.slug === slug) {
          queryClient.setQueryData<ArticleResponse>(queryKey, {
            article: applyOptimisticFavorite(data.article, !favorited),
          });
        }
      }

      for (const { queryKey, data } of previousListResponses) {
        if (!data) {
          continue;
        }

        queryClient.setQueryData<ArticleListResponse>(queryKey, {
          ...data,
          articles: data.articles.map(article =>
            article.slug === slug ? applyOptimisticFavorite(article, !favorited) : article
          ),
        });
      }

      return { previousArticleResponses, previousListResponses };
    },
    onError: (_error, { slug }, context) => {
      if (!context) {
        return;
      }

      for (const previousArticleResponse of context.previousArticleResponses) {
        if (previousArticleResponse.data?.article.slug === slug) {
          queryClient.setQueryData(previousArticleResponse.queryKey, previousArticleResponse.data);
        }
      }

      for (const previousListResponse of context.previousListResponses) {
        queryClient.setQueryData(previousListResponse.queryKey, previousListResponse.data);
      }
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["article"] });
      await queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });
}
