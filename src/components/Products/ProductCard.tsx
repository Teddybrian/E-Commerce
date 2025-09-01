import React from 'react';
import { Link } from 'react-router-dom';
import { StarIcon, ShoppingCartIcon } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
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
interface ProductCardProps {
  product: Product;
}
const ProductCard: React.FC<ProductCardProps> = ({
  product
}) => {
  const {
    addToCart
  } = useCart();
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.inStock) {
      addToCart(product, 1);
    }
  };
  return <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg">
      <Link to={`/products/${product.id}`}>
        <div className="h-48 overflow-hidden">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-300" />
        </div>
      </Link>
      <div className="p-4">
        <Link to={`/products/${product.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 hover:text-indigo-600">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center mt-2">
          <div className="flex items-center">
            {[0, 1, 2, 3, 4].map(rating => <StarIcon key={rating} className={`h-4 w-4 ${product.rating > rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" />)}
          </div>
          <span className="text-xs text-gray-500 ml-2">({product.rating})</span>
        </div>
        <div className="flex justify-between items-center mt-4">
          <span className="text-lg font-bold text-gray-900">
            ${product.price.toLocaleString()}
          </span>
          <button onClick={handleAddToCart} className={`p-2 rounded-full ${product.inStock ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`} disabled={!product.inStock}>
            <ShoppingCartIcon className="h-5 w-5" />
          </button>
        </div>
        {!product.inStock && <span className="block text-sm text-red-600 mt-2">Out of stock</span>}
      </div>
    </div>;
};
export default ProductCard;