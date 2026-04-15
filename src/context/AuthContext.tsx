import React, { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "user" | "admin";

interface User {
  username: string;
  email: string;
  role: UserRole;
  joinedDate: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => void;
  signup: (username: string, email: string, password: string, role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, _password: string, role: UserRole) => {
    setUser({
      username: email.split("@")[0],
      email,
      role,
      joinedDate: "2025-01-15",
    });
  };

  const signup = (username: string, email: string, _password: string, role: UserRole) => {
    setUser({ username, email, role, joinedDate: new Date().toISOString().split("T")[0] });
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};