import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ProductGrid from '../components/Products/ProductGrid';
import { FilterIcon } from 'lucide-react';
// Mock data for products
const allProducts = [{
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
}, {
  id: '5',
  name: 'iPad Pro 12.9"',
  description: 'M2 chip, 256GB, Space Gray',
  price: 1099,
  image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1650&q=80',
  category: 'tablets',
  rating: 4.8,
  inStock: true
}, {
  id: '6',
  name: 'Sony WH-1000XM5',
  description: 'Wireless Noise Cancelling Headphones',
  price: 399,
  image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1626&q=80',
  category: 'accessories',
  rating: 4.9,
  inStock: true
}, {
  id: '7',
  name: 'Custom Gaming PC',
  description: 'RTX 4080, i9-13900K, 64GB RAM, 2TB NVMe',
  price: 3499,
  image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1650&q=80',
  category: 'desktops',
  rating: 4.7,
  inStock: false
}, {
  id: '8',
  name: 'Apple Watch Series 8',
  description: '45mm, Cellular, Stainless Steel Case',
  price: 699,
  image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1652&q=80',
  category: 'accessories',
  rating: 4.5,
  inStock: true
}];
const ProductsPage = () => {
  const [products, setProducts] = useState(allProducts);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    inStock: false
  });
  const location = useLocation();
  // Handle URL query parameters for filtering
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    const onSaleParam = params.get('onSale');
    let filteredProducts = [...allProducts];
    if (categoryParam) {
      filteredProducts = filteredProducts.filter(p => p.category === categoryParam);
      setFilters(prev => ({
        ...prev,
        category: categoryParam
      }));
    }
    if (onSaleParam === 'true') {
      // This is a placeholder for "on sale" items
      // In a real app, you'd have a sale property or a discount calculation
      filteredProducts = filteredProducts.filter(p => p.price < 1000);
    }
    setProducts(filteredProducts);
  }, [location.search]);
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {
      name,
      value,
      type
    } = e.target as HTMLInputElement;
    const isCheckbox = type === 'checkbox';
    setFilters({
      ...filters,
      [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value
    });
  };
  const applyFilters = () => {
    let filteredProducts = [...allProducts];
    if (filters.category) {
      filteredProducts = filteredProducts.filter(p => p.category === filters.category);
    }
    if (filters.minPrice) {
      filteredProducts = filteredProducts.filter(p => p.price >= Number(filters.minPrice));
    }
    if (filters.maxPrice) {
      filteredProducts = filteredProducts.filter(p => p.price <= Number(filters.maxPrice));
    }
    if (filters.inStock) {
      filteredProducts = filteredProducts.filter(p => p.inStock);
    }
    setProducts(filteredProducts);
  };
  const resetFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      inStock: false
    });
    setProducts(allProducts);
  };
  return <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Products
          </h1>
          <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="flex items-center text-sm font-medium text-gray-700 hover:text-indigo-600">
            <FilterIcon className="h-5 w-5 mr-1" />
            Filter
          </button>
        </div>
        {isFilterOpen && <div className="bg-gray-50 rounded-lg p-4 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select id="category" name="category" value={filters.category} onChange={handleFilterChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                <option value="">All Categories</option>
                <option value="laptops">Laptops</option>
                <option value="desktops">Desktops</option>
                <option value="smartphones">Smartphones</option>
                <option value="tablets">Tablets</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>
            <div>
              <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700">
                Min Price
              </label>
              <input type="number" id="minPrice" name="minPrice" value={filters.minPrice} onChange={handleFilterChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="0" />
            </div>
            <div>
              <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700">
                Max Price
              </label>
              <input type="number" id="maxPrice" name="maxPrice" value={filters.maxPrice} onChange={handleFilterChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="5000" />
            </div>
            <div className="flex items-center h-full mt-6">
              <div className="flex items-center">
                <input id="inStock" name="inStock" type="checkbox" checked={filters.inStock} onChange={handleFilterChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                <label htmlFor="inStock" className="ml-2 block text-sm text-gray-700">
                  In Stock Only
                </label>
              </div>
              <div className="ml-auto space-x-2">
                <button onClick={applyFilters} className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Apply
                </button>
                <button onClick={resetFilters} className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Reset
                </button>
              </div>
            </div>
          </div>}
        {products.length > 0 ? <ProductGrid products={products} /> : <div className="text-center py-12">
            <p className="text-lg text-gray-500">
              No products match your filters.
            </p>
            <button onClick={resetFilters} className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Reset Filters
            </button>
          </div>}
      </div>
    </div>;
};
export default ProductsPage;