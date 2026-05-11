import { NavLink, useLocation } from "react-router-dom";

import { useAuth } from "contexts/AuthContext";
import { useArticles } from "hooks/useArticles";
import { ArticlePreviewCard } from "components/articles/ArticlePreviewCard";

const POPULAR_TAGS = ["programming", "javascript", "emberjs", "angularjs", "react", "mean", "node", "rails"];
const TABS = ["feed", "global"] as const;

function useSearchParam(param: string) {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  return queryParams.get(param);
}

export function ArticleList() {
  const { currentUser } = useAuth();
  const tabParam = useSearchParam("tab");
  const activeTab = TABS.find(tab => tabParam === tab) ?? "global";
  const { data, isLoading, isFetching, isPreviousData } = useArticles(activeTab);
  const hasNoArticles = data?.articles.length === 0;
  const isSwitchingTab = isPreviousData && isFetching;

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
                <li className="nav-item">
                  <NavLink
                    to={{ pathname: "/", search: "?tab=feed" }}
                    className={`nav-link ${!currentUser ? "disabled" : ""}`}
                    isActive={() => activeTab === "feed"}
                    onClick={event => !currentUser && event.preventDefault()}
                  >
                    Your Feed
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to={{ pathname: "/", search: "?tab=global" }}
                    className="nav-link"
                    isActive={() => activeTab === "global"}
                  >
                    Global Feed
                  </NavLink>
                </li>
              </ul>
            </div>

            {hasNoArticles ? (
              <div className="article-preview">No articles found.</div>
            ) : data ? (
              <div style={{ opacity: isSwitchingTab ? 0.7 : 1, pointerEvents: isSwitchingTab ? "none" : "auto" }}>
                {data.articles.map(article => (
                  <ArticlePreviewCard
                    key={article.slug}
                    article={article}
                  />
                ))}
              </div>
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
