import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

interface SearchContextType {
  searchHistory: string[];
  addToHistory: (query: string) => void;
  clearHistory: () => void;
}

const SearchContext = createContext<SearchContextType>(null!);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const savedHistory = localStorage.getItem("searchHistory");
      try {
        return savedHistory ? JSON.parse(savedHistory) : [];
      } catch (e) {
        console.error("Failed to parse search history", e);
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    }
  }, [searchHistory]);

  const addToHistory = (query: string) => {
    if (!query.trim()) return;

    setSearchHistory((prev) => {
      const newHistory = [query.trim(), ...prev.filter((item) => item.toLowerCase() !== query.trim().toLowerCase())].slice(0, 10);
      return newHistory;
    });
  };

  const clearHistory = () => {
    setSearchHistory([]);
  };

  return <SearchContext.Provider value={{ searchHistory, addToHistory, clearHistory }}>{children}</SearchContext.Provider>;
};

export const useSearch = () => useContext(SearchContext);
