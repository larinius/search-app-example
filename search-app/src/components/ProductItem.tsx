// file:components/ProductItem.tsx
import React from "react";
import ModalImage from "react-modal-image";

interface ProductItemProps {
  product: {
    id: string;
    name: string;
    model: string;
    description?: string;
    price?: number;
    images?: Array<{
      url: string;
      altText?: string;
    }>;
    category?: string;
    brand?: string;
  };
}

const ProductItem: React.FC<ProductItemProps> = ({ product }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        {product.images?.[0]?.url && (
          <div className="flex-shrink-0">
            <ModalImage
              small={product.images[0].url}
              large={product.images[0].url}
              alt={product.images[0].altText || product.name}
              hideDownload
              hideZoom={false}
              className="object-cover w-24 h-24 cursor-pointer transition-opacity duration-300 hover:opacity-90"
              imageBackgroundColor="transparent"
            />
          </div>
        )}

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
          {product.model && <p className="text-sm text-gray-600">Model: {product.model}</p>}
          {product.brand && <p className="text-sm text-gray-600">Brand: {product.brand}</p>}
          {product.price && <p className="text-sm font-medium text-indigo-600 mt-1">${product.price.toFixed(2)}</p>}
          {product.description && <p className="mt-2 text-sm text-gray-700">{product.description}</p>}
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
