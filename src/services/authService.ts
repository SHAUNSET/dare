import { supabase } from "../lib/supabase";

// 🔥 SIGN UP
export const signUp = async (
  email: string,
  password: string,
  username: string,
  role: "user" | "admin",
  plan: "free" | "pro"
) => {
  // 1. Create auth user
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;

  // 2. Insert into your users table
  if (data.user) {
    const { error: dbError } = await supabase.from("users").insert({
      id: data.user.id,
      email: data.user.email,
      username: username,
      role: role,
      plan: plan,
      created_at: new Date().toISOString(),
    });

    if (dbError) {
      console.error("DB ERROR:", dbError);
      throw dbError;
    }
  }

  return data;
};

// 🔥 SIGN IN
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  return data;
};

// 🔥 LOGOUT
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};