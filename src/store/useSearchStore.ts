import { create } from "zustand";
import { IBlog } from "../types";

interface SearchStore {
  searchQuery: string;
  timeFilter: string;
  commentFilter: string;
  isSearching: boolean;
  searchResults: IBlog[]; // Replace with the actual type of your search results
  error: string | null;

  setSearchQuery: (query: string) => void;
  setTimeFilter: (timeFilter: string) => void;
  setCommentFilter: (commentFilter: string) => void;
  setIsSearching: (isSearching: boolean) => void;
  setSearchResults: (result: IBlog[]) => void;
  setError: (error: string | null) => void;
  clearSearch: () => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  searchQuery: "",
  timeFilter: "All",
  commentFilter: "All",
  isSearching: false,
  searchResults: [], // Initialize with an empty array
  error: null,

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },
  setTimeFilter: (timeFilter: string) => {
    set({ timeFilter });
  },
  setCommentFilter: (commentFilter: string) => {
    set({ commentFilter });
  },
  setIsSearching: (isSearching: boolean) => {
    set({ isSearching });
  },
  setSearchResults: (result) => {
    set({ searchResults: result });
  },
  setError: (error: string | null) => {
    set({ error });
  },
  clearSearch: () => {
    set({ searchQuery: "", timeFilter: "All", commentFilter: "All", isSearching: false, searchResults: [], error: null });
  },
}));
