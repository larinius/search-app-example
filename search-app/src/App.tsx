import { useQuery } from "@apollo/client";
import { SEARCH_PRODUCTS } from "./graphql/queries";
import SearchForm from "./components/SearchForm";
import ProductsView from "./components/ProductsView";
import { useState } from "react";
import { SearchProvider } from "./context/SearchContext";
import SearchHistory from "./components/SearchHistory";

const LIMIT = 10;

function AppContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { loading, error, data, refetch } = useQuery(SEARCH_PRODUCTS, {
    variables: {
      query: searchQuery,
      limit: LIMIT,
      offset: (currentPage - 1) * LIMIT,
    },
    skip: !searchQuery,
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    refetch({
      query,
      limit: LIMIT,
      offset: 0,
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    refetch({
      query: searchQuery,
      limit: LIMIT,
      offset: (page - 1) * LIMIT,
    });
  };

  const totalCount = data?.searchProducts?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / LIMIT);
  const products = data?.searchProducts?.products || [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Product Search</h1>
        </header>

        <SearchForm onSubmit={handleSearch} submitText="Search" />
        <SearchHistory onSelect={handleSearch} />

        {error ? (
          <div className="bg-white p-4 rounded shadow text-red-500">Error fetching products: {error.message}</div>
        ) : (
          <ProductsView
            products={products}
            loading={loading}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <SearchProvider>
      <AppContent />
    </SearchProvider>
  );
}
