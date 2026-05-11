import { FormEvent } from "react";
import { Redirect } from "react-router-dom";

import { useAuth } from "contexts/AuthContext";
import { useLoginMutation } from "hooks/useLoginMutation";

export function Login() {
  const { currentUser } = useAuth();
  const loginMutation = useLoginMutation();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    loginMutation.mutate({ email, password });
  }

  if (currentUser) {
    return <Redirect to="/" />;
  }

  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Sign in</h1>

            {loginMutation.isError && (
              <ul className="error-messages">
                <li>
                  {loginMutation.error instanceof Error
                    ? loginMutation.error.message
                    : "Something went wrong. Please try again."}
                </li>
              </ul>
            )}

            <form onSubmit={handleSubmit}>
              <fieldset className="form-group">
                <input
                  className="form-control form-control-lg"
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                />
              </fieldset>
              <fieldset className="form-group">
                <input
                  className="form-control form-control-lg"
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                />
              </fieldset>
              <button type="submit" className="btn btn-lg btn-primary pull-xs-right" disabled={loginMutation.isLoading}>
                Sign in
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
