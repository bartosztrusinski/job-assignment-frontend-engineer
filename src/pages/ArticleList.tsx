import { useQuery } from "@tanstack/react-query";
import { Link, NavLink, useLocation } from "react-router-dom";
import { format } from "date-fns";

import type { Article } from "types";
import userImagePlaceholder from "assets/user-image-placeholder.png";
import { useAuth } from "contexts/AuthContext";
import { useFavoriteArticleMutation } from "../hooks/useFavoriteArticleMutation";

const POPULAR_TAGS = ["programming", "javascript", "emberjs", "angularjs", "react", "mean", "node", "rails"];
const BASE_URL = `${process.env.REACT_APP_API_URL}/api/articles`;
const DEFAULT_TAB = "global";
const TABS = [
  { label: "Your Feed", value: "feed" },
  { label: "Global Feed", value: DEFAULT_TAB },
] as const;

function useSearchParam(param: string) {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  return queryParams.get(param);
}

export function ArticleList() {
  const { currentUser } = useAuth();
  const tabParam = useSearchParam("tab");
  const activeTab = TABS.find(tab => tabParam === tab.value)?.value ?? DEFAULT_TAB;
  const articlesUrl = activeTab === "feed" ? `${BASE_URL}/feed` : BASE_URL;
  const { data, isLoading } = useQuery<{ articles: Article[] }>({
    queryKey: ["articles", activeTab],
    keepPreviousData: true,
    queryFn: async () => {
      const response = await fetch(articlesUrl, {
        headers: currentUser ? { Authorization: `Token ${currentUser.token}` } : undefined,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch articles");
      }

      return response.json();
    },
  });
  const favoriteMutation = useFavoriteArticleMutation();
  const hasNoArticles = data?.articles.length === 0;

  return (
    <div className="home-page">
      <div className="banner">
        <div className="container">
          <h1 className="logo-font">conduit</h1>
          <p>A place to share your knowledge.</p>
        </div>
      </div>

      <div className="container page">
        <div className="row">
          <div className="col-md-9">
            <div className="feed-toggle">
              <ul className="nav nav-pills outline-active">
                {TABS.map(tab => {
                  const isDisabled = tab.value === "feed" && !currentUser;
                  return (
                    <li key={tab.value} className="nav-item">
                      <NavLink
                        to={{ pathname: "/", search: `?tab=${tab.value}` }}
                        className={`nav-link ${isDisabled ? "disabled" : ""}`}
                        isActive={() => activeTab === tab.value}
                        onClick={event => isDisabled && event.preventDefault()}
                      >
                        {tab.label}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>

            {hasNoArticles ? (
              <div className="article-preview">No articles found.</div>
            ) : data ? (
              data.articles.map(article => (
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
            ) : isLoading ? (
              <div className="article-preview">Loading articles...</div>
            ) : (
              <div className="article-preview">Unable to load articles. Please try again.</div>
            )}
          </div>

          <div className="col-md-3">
            <div className="sidebar">
              <p>Popular Tags</p>
              <div className="tag-list">
                {POPULAR_TAGS.map(tag => (
                  <a key={tag} href="" className="tag-pill tag-default">
                    {tag}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
