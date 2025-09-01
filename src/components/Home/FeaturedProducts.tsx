import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../Products/ProductCard';
// Mock data for featured products
const featuredProducts = [{
  id: '1',
  name: 'MacBook Pro 16"',
  description: 'Apple M1 Pro, 16GB RAM, 512GB SSD',
  price: 2399,
  image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1626&q=80',
  category: 'laptops',
  rating: 4.9,
  inStock: true
}, {
  id: '2',
  name: 'iPhone 14 Pro',
  description: '256GB, Deep Purple',
  price: 1099,
  image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1626&q=80',
  category: 'smartphones',
  rating: 4.8,
  inStock: true
}, {
  id: '3',
  name: 'Samsung Galaxy S23 Ultra',
  description: '512GB, Phantom Black',
  price: 1299,
  image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1626&q=80',
  category: 'smartphones',
  rating: 4.7,
  inStock: true
}, {
  id: '4',
  name: 'Dell XPS 15',
  description: 'Intel i9, 32GB RAM, 1TB SSD, RTX 3050 Ti',
  price: 2199,
  image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1626&q=80',
  category: 'laptops',
  rating: 4.6,
  inStock: true
}];
const FeaturedProducts = () => {
  return <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Featured Products
          </h2>
          <Link to="/products" className="text-indigo-600 hover:text-indigo-500 font-medium">
            View all products
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map(product => <ProductCard key={product.id} product={product} />)}
        </div>
      </div>
    </div>;
};
export default FeaturedProducts;