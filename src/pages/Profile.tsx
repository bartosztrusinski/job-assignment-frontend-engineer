import { RouteComponentProps } from "react-router-dom";

import userImagePlaceholder from "assets/user-image-placeholder.png";
import { useAuth } from "contexts/AuthContext";
import { useFollowUserMutation } from "hooks/useFollowUserMutation";
import { useProfileQuery } from "hooks/useProfileQuery";
import { useArticlesByAuthorQuery } from "hooks/useArticlesByAuthorQuery";
import { ArticlePreviewCard } from "components/articles/ArticlePreviewCard";

export function Profile({ match }: RouteComponentProps<{ username: string }>) {
  const { username } = match.params;
  const { currentUser } = useAuth();
  const { data: profileData, isLoading: isProfileLoading } = useProfileQuery(username);
  const { data: articlesData, isLoading: isArticlesLoading } = useArticlesByAuthorQuery(username);
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
              articlesData.articles.map(article => <ArticlePreviewCard key={article.slug} article={article} />)
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
