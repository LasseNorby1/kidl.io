import { create } from "zustand";
import { supabase } from "./supabase";

type UserRole = "parent" | "child";

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  parentId?: string;
  birthday?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (
    email: string,
    password: string,
    name: string,
    role: UserRole,
    parentId?: string,
    birthday?: string,
    autoLogin?: boolean,
  ) => Promise<User>;
  linkChildAccount: (childEmail: string, parentId: string) => Promise<void>;
  getChildAccounts: (parentId: string) => Promise<User[]>;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isInitialized: false,

  login: async (email: string, password: string) => {
    try {
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (authError) throw authError;
      if (!authData?.user) throw new Error("No user data returned");

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authData.user.id)
        .single();

      if (profileData) {
        const user: User = {
          id: authData.user.id,
          email: authData.user.email!,
          name: profileData.name,
          role: profileData.role,
          parentId: profileData.parent_id,
          birthday: profileData.birthday,
        };
        set({ user, isAuthenticated: true });
      }

      return true;
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null, isAuthenticated: false });
    } catch (error) {
      throw error;
    }
  },

  register: async (
    email: string,
    password: string,
    name: string,
    role: UserRole,
    parentId?: string,
    birthday?: string,
    autoLogin: boolean = true,
  ) => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;
      if (!authData?.user) throw new Error("Registration failed");

      const { error: profileError } = await supabase.from("profiles").insert({
        id: authData.user.id,
        email,
        name,
        role,
        parent_id: parentId,
        birthday,
      });

      if (profileError) throw profileError;

      const newUser: User = {
        id: authData.user.id,
        email,
        name,
        role,
        parentId,
        birthday,
      };

      // Only set the auth state if autoLogin is true
      if (autoLogin) {
        set({ user: newUser, isAuthenticated: true });
      }

      return newUser;
    } catch (error) {
      throw error;
    }
  },

  linkChildAccount: async (childEmail: string, parentId: string) => {
    const { error } = await supabase
      .from("profiles")
      .update({ parent_id: parentId })
      .eq("email", childEmail)
      .eq("role", "child");

    if (error) throw error;
  },

  getChildAccounts: async (parentId: string) => {
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
      birthday: profile.birthday,
    }));
  },
}));

let initialized = false;

export const initAuth = async () => {
  if (initialized) return;
  initialized = true;

  try {
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
        useAuth.setState({
          user: {
            id: session.user.id,
            email: session.user.email!,
            name: profileData.name,
            role: profileData.role,
            parentId: profileData.parent_id,
            birthday: profileData.birthday,
          },
          isAuthenticated: true,
          isInitialized: true,
        });
        return;
      }
    }
  } catch (error) {
    console.error("Auth initialization error:", error);
  }

  useAuth.setState({ user: null, isAuthenticated: false, isInitialized: true });

  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === "SIGNED_IN" && session?.user) {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (profileData) {
        useAuth.setState({
          user: {
            id: session.user.id,
            email: session.user.email!,
            name: profileData.name,
            role: profileData.role,
            parentId: profileData.parent_id,
            birthday: profileData.birthday,
          },
          isAuthenticated: true,
          isInitialized: true,
        });
      }
    } else if (event === "SIGNED_OUT") {
      useAuth.setState({
        user: null,
        isAuthenticated: false,
        isInitialized: true,
      });
    }
  });
};
