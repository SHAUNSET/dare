import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export type UserRole = "user" | "admin";

interface User {
  username: string;
  email: string;
  role: UserRole;
  plan: "free" | "pro";
  joinedDate: string;
  city: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
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

  // 🔥 SYNC WITH SUPABASE
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        const u = data.session.user;

        setUser({
          username: u.email?.split("@")[0] || "user",
          email: u.email || "",
          role: "user", // temp (we’ll fix later)
          plan: "free",
          joinedDate: new Date().toISOString().split("T")[0],
          city: "Unknown",
        });
      }
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          const u = session.user;

          setUser({
            username: u.email?.split("@")[0] || "user",
            email: u.email || "",
            role: "user",
            plan: "free",
            joinedDate: new Date().toISOString().split("T")[0],
            city: "Unknown",
          });
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, logout }}>
      {children}
    </AuthContext.Provider>
  );
};