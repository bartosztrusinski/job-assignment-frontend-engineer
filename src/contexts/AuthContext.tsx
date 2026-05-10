import { createContext, ReactNode, useContext, useState } from "react";

import type { User } from "types";

type AuthContext = {
  currentUser: User | null;
  setCurrentUser: (user: User) => void;
  logOut: () => void;
};

const USER_KEY = "auth-user";

const AuthContext = createContext<AuthContext | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<User | null>(() => {
    const storedUser = localStorage.getItem(USER_KEY);

    if (storedUser) {
      try {
        return JSON.parse(storedUser) as User;
      } catch {
        localStorage.removeItem(USER_KEY);
      }
    }

    return null;
  });

  const setCurrentUser = (nextUser: User) => {
    setCurrentUserState(nextUser);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
  };

  const logOut = () => {
    setCurrentUserState(null);
    localStorage.removeItem(USER_KEY);
  };

  return <AuthContext.Provider value={{ currentUser, setCurrentUser, logOut }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
