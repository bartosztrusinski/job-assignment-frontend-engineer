import { Link } from "react-router-dom";
import { format } from "date-fns";

import type { Article } from "types";
import { useAuth } from "contexts/AuthContext";
import { useFavoriteArticleMutation } from "hooks/mutations/useFavoriteArticleMutation";
import userImagePlaceholder from "assets/user-image-placeholder.png";

type Props = {
  article: Article;
};

export function ArticlePreviewCard({ article }: Props) {
  const { currentUser } = useAuth();
  const favoriteMutation = useFavoriteArticleMutation();

  return (
    <div key={article.slug} className="article-preview">
      <div className="article-meta">
        <Link to={`/profile/${article.author.username}`}>
          <img src={article.author.image || userImagePlaceholder} alt={article.author.username} />
        </Link>
        <div className="info">
          <Link to={`/profile/${article.author.username}`} className="author">
            {article.author.username}
          </Link>
          <span className="date">{format(new Date(article.createdAt), "MMMM do")}</span>
        </div>
        <button
          className={`btn btn-sm pull-xs-right ${article.favorited ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => favoriteMutation.mutate({ slug: article.slug, favorited: article.favorited })}
          disabled={!currentUser || (favoriteMutation.isLoading && favoriteMutation.variables?.slug === article.slug)}
        >
          <i className="ion-heart" /> {article.favoritesCount}
        </button>
      </div>
      <Link to={`/${article.slug}`} className="preview-link">
        <h1>{article.title}</h1>
        <p>{article.description}</p>
        <span>Read more...</span>
      </Link>
    </div>
  );
}
