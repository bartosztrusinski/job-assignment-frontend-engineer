import { useMutation } from "@tanstack/react-query";
import { useAuth } from "contexts/AuthContext";
import { useHistory } from "react-router-dom";
import { User } from "types";

import { useApiFetch } from "hooks/useApiFetch";

type LoginUser = {
  email: string;
  password: string;
};

type LoginResponse = {
  user: User;
};

export function useLoginMutation() {
  const apiFetch = useApiFetch();
  const { setCurrentUser } = useAuth();
  const history = useHistory();

  return useMutation<LoginResponse, Error, LoginUser>({
    mutationFn: async user => {
      const response = await apiFetch("/users/login", {
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
}
