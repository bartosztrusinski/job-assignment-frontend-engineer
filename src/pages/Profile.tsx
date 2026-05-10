import { useQuery } from "@tanstack/react-query";
import { RouteComponentProps } from "react-router-dom";

import type { Profile as ProfileType } from "types";
import userImagePlaceholder from "assets/user-image-placeholder.png";

export function Profile({ match }: RouteComponentProps<{ username: string }>) {
  const { username } = match.params;
  const { data, isLoading } = useQuery<{ profile: ProfileType }>({
    queryKey: ["profile", username],
    queryFn: async () => {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/profiles/${username}`);
      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }
      return response.json();
    },
  });

  return (
    <div className="profile-page">
      <div className="user-info">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              {data ? (
                <>
                  <img src={data.profile.image || userImagePlaceholder} className="user-img" />
                  <h4>{data.profile.username}</h4>
                  <p>{data.profile.bio}</p>
                  <button className="btn btn-sm btn-outline-secondary action-btn">
                    <i className="ion-plus-round" />
                    &nbsp; Follow {data.profile.username}
                  </button>
                </>
              ) : isLoading ? (
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

            <div className="article-preview">
              <div className="article-meta">
                <a href="/#/profile/ericsimmons">
                  <img src="http://i.imgur.com/Qr71crq.jpg" />
                </a>
                <div className="info">
                  <a href="/#/profile/ericsimmons" className="author">
                    Eric Simons
                  </a>
                  <span className="date">January 20th</span>
                </div>
                <button className="btn btn-outline-primary btn-sm pull-xs-right">
                  <i className="ion-heart" /> 29
                </button>
              </div>
              <a href="/#/how-to-build-webapps-that-scale" className="preview-link">
                <h1>How to build webapps that scale</h1>
                <p>This is the description for the post.</p>
                <span>Read more...</span>
              </a>
            </div>

            <div className="article-preview">
              <div className="article-meta">
                <a href="/#/profile/albertpai">
                  <img src="http://i.imgur.com/N4VcUeJ.jpg" />
                </a>
                <div className="info">
                  <a href="/#/profile/albertpai" className="author">
                    Albert Pai
                  </a>
                  <span className="date">January 20th</span>
                </div>
                <button className="btn btn-outline-primary btn-sm pull-xs-right">
                  <i className="ion-heart" /> 32
                </button>
              </div>
              <a href="/#/the-song-you-wont-ever-stop-singing" className="preview-link">
                <h1>The song you won&lsquo;t ever stop singing. No matter how hard you try.</h1>
                <p>This is the description for the post.</p>
                <span>Read more...</span>
                <ul className="tag-list">
                  <li className="tag-default tag-pill tag-outline">Music</li>
                  <li className="tag-default tag-pill tag-outline">Song</li>
                </ul>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
