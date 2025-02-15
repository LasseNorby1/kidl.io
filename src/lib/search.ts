import { create } from "zustand";
import { supabase } from "./supabase";

interface SearchState {
  query: string;
  results: {
    subjects: any[];
    lessons: any[];
  };
  loading: boolean;
  search: (query: string) => Promise<void>;
  clearSearch: () => void;
}

export const useSearch = create<SearchState>((set) => ({
  query: "",
  results: {
    subjects: [],
    lessons: [],
  },
  loading: false,

  search: async (query: string) => {
    if (!query.trim()) {
      set({
        query: "",
        results: { subjects: [], lessons: [] },
        loading: false,
      });
      return;
    }

    set({ query, loading: true });

    try {
      // Search subjects
      const { data: subjects } = await supabase
        .from("subjects")
        .select("*")
        .ilike("name", `%${query}%`);

      // Search lessons
      const { data: lessons } = await supabase
        .from("lessons")
        .select("*, subjects(*)")
        .or(`title.ilike.%${query}%, description.ilike.%${query}%`);

      set({
        results: {
          subjects: subjects || [],
          lessons: lessons || [],
        },
        loading: false,
      });
    } catch (error) {
      console.error("Search failed:", error);
      set({ results: { subjects: [], lessons: [] }, loading: false });
    }
  },

  clearSearch: () => {
    set({ query: "", results: { subjects: [], lessons: [] }, loading: false });
  },
}));
