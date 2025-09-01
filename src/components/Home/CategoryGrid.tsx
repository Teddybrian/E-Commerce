import React from 'react';
import { Link } from 'react-router-dom';
const categories = [{
  name: 'Laptops',
  image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1650&q=80',
  description: 'Powerful machines for work and play',
  path: '/products?category=laptops'
}, {
  name: 'Desktops',
  image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1642&q=80',
  description: 'High-performance computing solutions',
  path: '/products?category=desktops'
}, {
  name: 'Smartphones',
  image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02ff9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1680&q=80',
  description: 'Stay connected with the latest mobile technology',
  path: '/products?category=smartphones'
}, {
  name: 'Accessories',
  image: 'https://images.unsplash.com/photo-1625466987120-056c76207f19?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1650&q=80',
  description: 'Enhance your tech experience',
  path: '/products?category=accessories'
}];
const CategoryGrid = () => {
  return <div className="bg-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-8">
          Shop by Category
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map(category => <Link key={category.name} to={category.path} className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="h-64 w-full overflow-hidden">
                <img src={category.image} alt={category.name} className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-xl font-bold text-white">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-300 mt-1">
                  {category.description}
                </p>
              </div>
            </Link>)}
        </div>
      </div>
    </div>;
};
export default CategoryGrid;