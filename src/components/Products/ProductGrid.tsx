import React from 'react';
import ProductCard from './ProductCard';
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  inStock: boolean;
}
interface ProductGridProps {
  products: Product[];
}
const ProductGrid: React.FC<ProductGridProps> = ({
  products
}) => {
  return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map(product => <ProductCard key={product.id} product={product} />)}
    </div>;
};
export default ProductGrid;