import { useSearch } from "../context/SearchContext";

const SearchHistory = ({ onSelect }: { onSelect: (query: string) => void }) => {
  const { searchHistory, clearHistory } = useSearch();

  if (searchHistory.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-8 transition-all duration-300">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-gray-700">Recent searches</h3>
        <button onClick={clearHistory} className="text-xs text-indigo-600 hover:text-indigo-800">
          Clear all
        </button>
      </div>
      <ul className="space-y-1">
        {searchHistory.map((query, index) => (
          <li key={index}>
            <button
              onClick={() => onSelect(query)}
              className="w-full text-left px-2 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded hover:text-indigo-600 transition-colors"
            >
              {query}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchHistory;
