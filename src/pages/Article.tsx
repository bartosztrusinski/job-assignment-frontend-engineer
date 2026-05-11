import { Link, RouteComponentProps } from "react-router-dom";
import { format } from "date-fns";
import Markdown from "react-markdown";

import userImagePlaceholder from "assets/user-image-placeholder.png";
import { useAuth } from "contexts/AuthContext";
import { useFavoriteArticleMutation } from "hooks/useFavoriteArticleMutation";
import { useFollowUserMutation } from "hooks/useFollowUserMutation";
import { useArticle } from "hooks/useArticle";

export function Article({ match }: RouteComponentProps<{ slug: string }>) {
  const { slug } = match.params;
  const { currentUser } = useAuth();
  const { data, isLoading, isError } = useArticle(slug);
  const favoriteMutation = useFavoriteArticleMutation();
  const followMutation = useFollowUserMutation();

  if (isLoading) {
    return (
      <div className="article-page">
        <div className="container page">Loading article...</div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="article-page">
        <div className="container page">Could not load article. Please try again.</div>
      </div>
    );
  }

  const { article } = data;

  return (
    <div className="article-page">
      <div className="banner">
        <div className="container">
          <h1>{article.title}</h1>

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
              {/* TODO display follower count */}
              &nbsp; {article.author.following ? "Unfollow" : "Follow"} {article.author.username}{" "}
              <span className="counter">(0)</span>
            </button>
            &nbsp;&nbsp;
            <button
              className={`btn btn-sm ${article.favorited ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => favoriteMutation.mutate({ slug, favorited: article.favorited })}
              disabled={favoriteMutation.isLoading}
            >
              <i className="ion-heart" />
              &nbsp; {article.favorited ? "Unfavorite Post" : "Favorite Post"}{" "}
              <span className="counter">({article.favoritesCount})</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container page">
        <div className="row article-content">
          <div className="col-md-12">
            <Markdown>{article.body}</Markdown>
          </div>
        </div>

        <hr />

        <div className="article-actions">
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
              &nbsp; {article.author.following ? "Unfollow" : "Follow"} {article.author.username}
            </button>
            &nbsp;
            <button
              className={`btn btn-sm ${article.favorited ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => favoriteMutation.mutate({ slug, favorited: article.favorited })}
              disabled={favoriteMutation.isLoading}
            >
              <i className="ion-heart" />
              &nbsp; {article.favorited ? "Unfavorite Post" : "Favorite Post"}{" "}
              <span className="counter">({article.favoritesCount})</span>
            </button>
          </div>
        </div>

        <div className="row">
          <div className="col-xs-12 col-md-8 offset-md-2">
            <form className="card comment-form">
              <div className="card-block">
                <textarea className="form-control" placeholder="Write a comment..." rows={3} />
              </div>
              <div className="card-footer">
                <img src="http://i.imgur.com/Qr71crq.jpg" className="comment-author-img" />
                <button className="btn btn-sm btn-primary">Post Comment</button>
              </div>
            </form>

            <div className="card">
              <div className="card-block">
                <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
              </div>
              <div className="card-footer">
                <a href="/#/profile/jacobschmidt" className="comment-author">
                  <img src="http://i.imgur.com/Qr71crq.jpg" className="comment-author-img" />
                </a>
                &nbsp;
                <a href="/#/profile/jacobschmidt" className="comment-author">
                  Jacob Schmidt
                </a>
                <span className="date-posted">Dec 29th</span>
              </div>
            </div>

            <div className="card">
              <div className="card-block">
                <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
              </div>
              <div className="card-footer">
                <a href="/#/profile/jacobschmidt" className="comment-author">
                  <img src="http://i.imgur.com/Qr71crq.jpg" className="comment-author-img" />
                </a>
                &nbsp;
                <a href="/#/profile/jacobschmidt" className="comment-author">
                  Jacob Schmidt
                </a>
                <span className="date-posted">Dec 29th</span>
                <span className="mod-options">
                  <i className="ion-edit" />
                  <i className="ion-trash-a" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
