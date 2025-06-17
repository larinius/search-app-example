import { useState } from "react";
import { useSearch } from "../context/SearchContext";

interface SearchFormProps {
  onSubmit: (query: string) => void;
  submitText?: string;
}

const SearchForm = ({ onSubmit, submitText = "Search" }: SearchFormProps) => {
  const [query, setQuery] = useState("");
  const { addToHistory } = useSearch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSubmit(query);
    addToHistory(query);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-4">
      <form onSubmit={handleSubmit}>
        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
          Search products
        </label>
        <div className="flex gap-2">
          <input
            id="search"
            type="text"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter product name or model - e.g. 'инструмент, пила'"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!query.trim()}
          >
            {submitText}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;
