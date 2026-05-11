import { useQuery } from "@tanstack/react-query";
import { Link, RouteComponentProps } from "react-router-dom";

import type { Article, Profile as ProfileType } from "types";
import userImagePlaceholder from "assets/user-image-placeholder.png";
import { format } from "date-fns";
import { useAuth } from "contexts/AuthContext";
import { useFavoriteArticleMutation } from "hooks/useFavoriteArticleMutation";
import { useFollowUserMutation } from "hooks/useFollowUserMutation";

export function Profile({ match }: RouteComponentProps<{ username: string }>) {
  const { username } = match.params;
  const { currentUser } = useAuth();
  const { data: profileData, isLoading: isProfileLoading } = useQuery<{ profile: ProfileType }>({
    queryKey: ["profile", username],
    queryFn: async () => {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/profiles/${username}`, {
        headers: currentUser ? { Authorization: `Token ${currentUser.token}` } : undefined,
      });
      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }
      return response.json();
    },
  });
  const { data: articlesData, isLoading: isArticlesLoading } = useQuery<{ articles: Article[] }>({
    queryKey: ["articles", username],
    keepPreviousData: true,
    queryFn: async () => {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/articles?author=${username}`, {
        headers: currentUser ? { Authorization: `Token ${currentUser.token}` } : undefined,
      });
      if (!response.ok) {
        throw new Error("Failed to fetch articles");
      }
      return response.json();
    },
  });
  const favoriteMutation = useFavoriteArticleMutation();
  const followMutation = useFollowUserMutation();

  const hasNoArticles = articlesData?.articles.length === 0;

  return (
    <div className="profile-page">
      <div className="user-info">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              {profileData ? (
                <>
                  <img src={profileData.profile.image || userImagePlaceholder} className="user-img" />
                  <h4>{profileData.profile.username}</h4>
                  <p>{profileData.profile.bio}</p>
                  <button
                    className={`btn btn-sm action-btn ${
                      profileData.profile.following ? "btn-secondary" : "btn-outline-secondary"
                    }`}
                    onClick={() => followMutation.mutate(profileData.profile)}
                    disabled={
                      !currentUser ||
                      currentUser.username === profileData.profile.username ||
                      (followMutation.isLoading && followMutation.variables?.username === profileData.profile.username)
                    }
                  >
                    <i className={profileData.profile.following ? "ion-minus-round" : "ion-plus-round"} />
                    &nbsp; {profileData.profile.following ? "Unfollow" : "Follow"} {profileData.profile.username}
                  </button>
                </>
              ) : isProfileLoading ? (
                <p>Loading profile...</p>
              ) : (
                <p>Could not load profile. Please try again.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-10 offset-md-1">
            <div className="articles-toggle">
              <ul className="nav nav-pills outline-active">
                <li className="nav-item">
                  <a className="nav-link active" href="">
                    My Articles
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="">
                    Favorited Articles
                  </a>
                </li>
              </ul>
            </div>

            {hasNoArticles ? (
              <div className="article-preview">No articles found.</div>
            ) : articlesData ? (
              articlesData.articles.map(article => (
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
                      className={`btn btn-sm pull-xs-right ${
                        article.favorited ? "btn-primary" : "btn-outline-primary"
                      }`}
                      onClick={() => favoriteMutation.mutate({ slug: article.slug, favorited: article.favorited })}
                      disabled={
                        !currentUser ||
                        (favoriteMutation.isLoading && favoriteMutation.variables?.slug === article.slug)
                      }
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
              ))
            ) : isArticlesLoading ? (
              <div className="article-preview">Loading articles...</div>
            ) : (
              <div className="article-preview">Unable to load articles. Please try again.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
