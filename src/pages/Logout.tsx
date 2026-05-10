import { useEffect } from "react";
import { useHistory } from "react-router-dom";

import { useAuth } from "contexts/AuthContext";

export function Logout() {
  const { logOut } = useAuth();
  const history = useHistory();

  useEffect(() => {
    logOut();
    history.push("/");
  }, [logOut, history]);

  return null;
}
