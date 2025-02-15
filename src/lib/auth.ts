import { create } from "zustand";
import { supabase } from "./supabase";

type UserRole = "parent" | "child";

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  parentId?: string;
  age?: number;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (
    email: string,
    password: string,
    name: string,
    role: UserRole,
    parentEmail?: string,
    age?: number,
  ) => Promise<void>;
  linkChildAccount: (childEmail: string, parentId: string) => Promise<void>;
  getChildAccounts: (parentId: string) => Promise<User[]>;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    try {
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (authError) throw authError;

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authData.user.id)
        .single();

      if (profileError) throw profileError;

      const user: User = {
        id: authData.user.id,
        email: authData.user.email!,
        name: profileData.name,
        role: profileData.role,
        parentId: profileData.parent_id,
        age: profileData.age,
      };

      set({ user, isAuthenticated: true });
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  },

  logout: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null, isAuthenticated: false });
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  },

  register: async (
    email: string,
    password: string,
    name: string,
    role: UserRole,
    parentEmail?: string,
    age?: number,
  ) => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("User registration failed");

      let parentId = null;
      if (role === "child" && parentEmail) {
        const { data: parentData, error: parentError } = await supabase
          .from("profiles")
          .select("id")
          .eq("email", parentEmail)
          .eq("role", "parent")
          .single();

        if (parentError || !parentData) {
          throw new Error("Parent account not found");
        }
        parentId = parentData.id;
      }

      const { error: profileError } = await supabase.from("profiles").insert([
        {
          id: authData.user.id,
          name,
          role,
          parent_id: parentId,
          email,
          age: age || null,
        },
      ]);

      if (profileError) throw profileError;

      const user: User = {
        id: authData.user.id,
        email,
        name,
        role,
        parentId,
        age,
      };

      set({ user, isAuthenticated: true });
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  },

  linkChildAccount: async (childEmail: string, parentId: string) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ parent_id: parentId })
        .eq("email", childEmail)
        .eq("role", "child");

      if (error) throw error;
    } catch (error) {
      console.error("Failed to link child account:", error);
      throw error;
    }
  },

  getChildAccounts: async (parentId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("parent_id", parentId)
        .eq("role", "child");

      if (error) throw error;

      return data.map((profile) => ({
        id: profile.id,
        email: profile.email,
        name: profile.name,
        role: profile.role,
        parentId: profile.parent_id,
        age: profile.age,
      }));
    } catch (error) {
      console.error("Failed to get child accounts:", error);
      throw error;
    }
  },
}));

// Initialize auth state from session
const initializeAuth = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (session?.user) {
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    if (profileData) {
      const user: User = {
        id: session.user.id,
        email: session.user.email!,
        name: profileData.name,
        role: profileData.role,
        parentId: profileData.parent_id,
        age: profileData.age,
      };
      useAuth.setState({ user, isAuthenticated: true });
    }
  }
};

initializeAuth();

// Listen for auth changes
supabase.auth.onAuthStateChange(async (event, session) => {
  if (event === "SIGNED_IN" && session?.user) {
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    if (profileData) {
      const user: User = {
        id: session.user.id,
        email: session.user.email!,
        name: profileData.name,
        role: profileData.role,
        parentId: profileData.parent_id,
        age: profileData.age,
      };
      useAuth.setState({ user, isAuthenticated: true });
    }
  } else if (event === "SIGNED_OUT") {
    useAuth.setState({ user: null, isAuthenticated: false });
  }
});
