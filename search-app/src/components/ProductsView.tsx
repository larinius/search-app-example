// file:components/ProductsView.tsx
import React from "react";
import ProductItem from "./ProductItem";

interface ProductsViewProps {
  products: any[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const ProductsView: React.FC<ProductsViewProps> = ({ products, loading, currentPage, totalPages, onPageChange }) => {
  if (loading)
    return (
      <div className="p-4 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
        <p className="mt-2">Loading products...</p>
      </div>
    );

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden mt-6 flex flex-col min-h-[300px]">
      {/* Products list container */}
      <div className="flex-1 overflow-y-auto p-4">
        {products.length > 0 ? (
          <div className="space-y-4">
            {products.map((product) => (
              <ProductItem key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">No products found. Try a different search.</div>
        )}
      </div>

      {/* Pagination - copied exactly from old CommentsView */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="px-6 py-3 flex items-center justify-between">
          <div className="flex-1 flex justify-between items-center">
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
            </span>
            <button
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsView;
