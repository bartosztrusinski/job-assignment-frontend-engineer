import { Link } from "react-router-dom";
import { format } from "date-fns";

import type { Article } from "types";
import { useAuth } from "contexts/AuthContext";
import { useFavoriteArticleMutation } from "hooks/mutations/useFavoriteArticleMutation";
import { useFollowUserMutation } from "hooks/mutations/useFollowUserMutation";
import userImagePlaceholder from "assets/user-image-placeholder.png";

type Props = {
  article: Article;
};

export function ArticleMeta({ article }: Props) {
  const { currentUser } = useAuth();
  const favoriteMutation = useFavoriteArticleMutation();
  const followMutation = useFollowUserMutation();

  return (
    <div className="article-meta">
      <Link to={`/profile/${article.author.username}`}>
        <img src={article.author.image || userImagePlaceholder} alt="" />
      </Link>
      <div className="info">
        <Link to={`/profile/${article.author.username}`} className="author">
          {article.author.username}
        </Link>
        <span className="date">{format(new Date(article.createdAt), "MMMM do")}</span>
      </div>
      <button
        className={`btn btn-sm ${article.author.following ? "btn-secondary" : "btn-outline-secondary"}`}
        onClick={() => followMutation.mutate(article.author)}
        disabled={
          !currentUser ||
          currentUser.username === article.author.username ||
          (followMutation.isLoading && followMutation.variables?.username === article.author.username)
        }
      >
        <i className={article.author.following ? "ion-minus-round" : "ion-plus-round"} />
        &nbsp; {article.author.following ? "Unfollow" : "Follow"} {article.author.username}{" "}
      </button>
      &nbsp;&nbsp;
      <button
        className={`btn btn-sm ${article.favorited ? "btn-primary" : "btn-outline-primary"}`}
        onClick={() => favoriteMutation.mutate(article)}
        disabled={favoriteMutation.isLoading}
      >
        <i className="ion-heart" />
        &nbsp; {article.favorited ? "Unfavorite Post" : "Favorite Post"}{" "}
        <span className="counter">({article.favoritesCount})</span>
      </button>
    </div>
  );
}
