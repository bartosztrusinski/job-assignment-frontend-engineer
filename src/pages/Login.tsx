import { useMutation } from "@tanstack/react-query";
import { Redirect, useHistory } from "react-router-dom";
import type { User } from "types";

import { useAuth } from "contexts/AuthContext";
import { FormEvent } from "react";

type LoginUser = {
  email: string;
  password: string;
};

type LoginResponse = {
  user: User;
};

export function Login() {
  const { currentUser, setCurrentUser } = useAuth();
  const history = useHistory();
  const mutation = useMutation<LoginResponse, Error, LoginUser>({
    mutationFn: async user => {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user }),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      return response.json();
    },
    onSuccess: ({ user }) => {
      setCurrentUser(user);
      history.push("/");
    },
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    mutation.mutate({ email, password });
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

            {mutation.isError && (
              <ul className="error-messages">
                <li>
                  {mutation.error instanceof Error ? mutation.error.message : "Something went wrong. Please try again."}
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
              <button type="submit" className="btn btn-lg btn-primary pull-xs-right" disabled={mutation.isLoading}>
                Sign in
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
