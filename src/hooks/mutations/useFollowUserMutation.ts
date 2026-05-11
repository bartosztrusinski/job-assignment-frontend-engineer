import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { QueryKey } from "@tanstack/react-query";

import { useAuth } from "contexts/AuthContext";
import type { Article, Profile } from "types";
import { useApiFetch } from "hooks/useApiFetch";

type ProfileResponse = { profile: Profile };
type ArticleResponse = { article: Article };

type FollowMutationVariables = {
  username: string;
  following: boolean;
};

type FollowMutationContext = {
  previousProfileResponses: Array<{ queryKey: QueryKey; data?: ProfileResponse }>;
  previousArticleResponses: Array<{ queryKey: QueryKey; data?: ArticleResponse }>;
};

function updateArticleAuthorFollowing(article: Article, username: string, following: boolean) {
  if (article.author.username !== username) {
    return article;
  }

  return { ...article, author: { ...article.author, following } };
}

export function useFollowUserMutation() {
  const queryClient = useQueryClient();
  const { currentUser } = useAuth();
  const apiFetch = useApiFetch();

  return useMutation<ProfileResponse, Error, FollowMutationVariables, FollowMutationContext>({
    mutationFn: async ({ username, following }): Promise<ProfileResponse> => {
      if (!currentUser) {
        throw new Error("You need to be logged in to follow users.");
      }

      if (currentUser.username === username) {
        throw new Error("You cannot follow yourself.");
      }

      const response = await apiFetch(`/profiles/${username}/follow`, { method: following ? "DELETE" : "POST" });

      if (!response.ok) {
        throw new Error(following ? "Failed to unfollow user." : "Failed to follow user.");
      }

      return response.json();
    },
    onMutate: async ({ username, following }): Promise<FollowMutationContext> => {
      if (currentUser?.username === username) {
        throw new Error("You cannot follow yourself.");
      }

      await queryClient.cancelQueries({ queryKey: ["profile"] });
      await queryClient.cancelQueries({ queryKey: ["article"] });

      const previousProfileResponses = queryClient
        .getQueriesData<ProfileResponse>({ queryKey: ["profile"] })
        .map(([queryKey, data]) => ({ queryKey, data }));
      const previousArticleResponses = queryClient
        .getQueriesData<ArticleResponse>({ queryKey: ["article"] })
        .map(([queryKey, data]) => ({ queryKey, data }));

      for (const { queryKey, data } of previousProfileResponses) {
        if (data?.profile.username !== username) {
          continue;
        }

        queryClient.setQueryData<ProfileResponse>(queryKey, {
          profile: {
            ...data.profile,
            following: !following,
          },
        });
      }

      for (const { queryKey, data } of previousArticleResponses) {
        if (!data) {
          continue;
        }

        queryClient.setQueryData<ArticleResponse>(queryKey, {
          article: updateArticleAuthorFollowing(data.article, username, !following),
        });
      }

      return { previousProfileResponses, previousArticleResponses };
    },
    onError: (_error, variables, context) => {
      if (!context) {
        return;
      }

      for (const previousProfileResponse of context.previousProfileResponses) {
        if (previousProfileResponse.data?.profile.username === variables.username) {
          queryClient.setQueryData(previousProfileResponse.queryKey, previousProfileResponse.data);
        }
      }

      for (const previousArticleResponse of context.previousArticleResponses) {
        queryClient.setQueryData(previousArticleResponse.queryKey, previousArticleResponse.data);
      }
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["profile"] });
      await queryClient.invalidateQueries({ queryKey: ["article"] });
    },
  });
}
