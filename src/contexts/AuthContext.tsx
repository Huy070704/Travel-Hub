import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { loginRequest, googleLoginRequest } from "@/api/authApi";
import type { AuthUser, LoginCredentials } from "@/types/auth";

type AuthContextValue = {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  googleLogin: (idToken: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readStoredUser() {
  const rawUser = localStorage.getItem("user");

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser) as AuthUser;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState<AuthUser | null>(() => readStoredUser());

  const login = async (credentials: LoginCredentials) => {
    const data = await loginRequest(credentials);
    const loggedInUser: AuthUser = {
      userID: data.userID,
      username: data.username,
      email: data.username || credentials.email,
      role: data.role,
      isPremium: data.isPremium,
    };

    localStorage.setItem("token", data.accessToken);
    if (data.refreshToken) {
      localStorage.setItem("refreshToken", data.refreshToken);
    } else {
      localStorage.removeItem("refreshToken");
    }
    localStorage.setItem("user", JSON.stringify(loggedInUser));

    setToken(data.accessToken);
    setUser(loggedInUser);
  };

  const googleLogin = async (idToken: string) => {
    const data = await googleLoginRequest(idToken);
    const loggedInUser: AuthUser = {
      userID: data.userID,
      username: data.username,
      email: data.username, // using username as email fallback if needed
      role: data.role,
      isPremium: data.isPremium,
    };

    localStorage.setItem("token", data.accessToken);
    if (data.refreshToken) {
      localStorage.setItem("refreshToken", data.refreshToken);
    } else {
      localStorage.removeItem("refreshToken");
    }
    localStorage.setItem("user", JSON.stringify(loggedInUser));

    setToken(data.accessToken);
    setUser(loggedInUser);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      login,
      googleLogin,
      logout,
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
