import { useAuth } from "contexts/AuthContext";
import userImagePlaceholder from "assets/user-image-placeholder.png";

export function Navbar() {
  const { currentUser } = useAuth();

  return (
    <nav className="navbar navbar-light">
      <div className="container">
        <a className="navbar-brand" href="/#">
          conduit
        </a>
        <ul className="nav navbar-nav pull-xs-right">
          <li className="nav-item">
            {/* Add "active" class when you're on that page" */}
            <a className="nav-link active" href="/#">
              Home
            </a>
          </li>

          {currentUser ? (
            <>
              <li className="nav-item">
                <a className="nav-link" href="/#/editor">
                  <i className="ion-compose" />
                  &nbsp;New Article
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/#/settings">
                  <i className="ion-gear-a" />
                  &nbsp;Settings
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href={`/#/profile/${currentUser.username}`}>
                  <img src={currentUser.image || userImagePlaceholder} className="user-pic" alt="" />
                  {currentUser.username}
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/#/logout">
                  Logout
                </a>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <a className="nav-link" href="/#/login">
                  Sign in
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/#/register">
                  Sign up
                </a>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
