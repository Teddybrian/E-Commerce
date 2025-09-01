import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SearchIcon, ShoppingCartIcon, MenuIcon, XIcon, UserIcon, LogOutIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const {
    currentUser,
    logout
  } = useAuth();
  const {
    cartItems
  } = useCart();
  // Count total items in cart
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const handleLogout = async () => {
    try {
      await logout();
      setIsProfileMenuOpen(false);
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };
  return <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-indigo-600">
                TechShop
              </span>
            </Link>
          </div>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium">
              Home
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium">
              Products
            </Link>
            <div className="relative group">
              <button className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium">
                Categories
              </button>
              <div className="absolute z-10 hidden group-hover:block bg-white shadow-lg rounded-md w-48 py-2">
                <Link to="/products?category=computers" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50">
                  Computers
                </Link>
                <Link to="/products?category=laptops" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50">
                  Laptops
                </Link>
                <Link to="/products?category=smartphones" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50">
                  Smartphones
                </Link>
                <Link to="/products?category=accessories" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50">
                  Accessories
                </Link>
              </div>
            </div>
          </nav>
          {/* Search, Cart, and User Icons */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <input type="text" placeholder="Search products..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
              <div className="absolute left-3 top-2.5">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            <Link to="/cart" className="text-gray-700 hover:text-indigo-600 relative">
              <ShoppingCartIcon className="h-6 w-6" />
              {cartItemCount > 0 && <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>}
            </Link>
            {currentUser ? <div className="relative">
                <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="text-gray-700 hover:text-indigo-600 flex items-center">
                  <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                    {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : <UserIcon className="h-5 w-5" />}
                  </div>
                </button>
                {isProfileMenuOpen && <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 z-10">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {currentUser.displayName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {currentUser.email}
                      </p>
                    </div>
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50" onClick={() => setIsProfileMenuOpen(false)}>
                      Your Profile
                    </Link>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50">
                      <div className="flex items-center">
                        <LogOutIcon className="h-4 w-4 mr-2" />
                        Sign out
                      </div>
                    </button>
                  </div>}
              </div> : <Link to="/auth/login" className="text-gray-700 hover:text-indigo-600">
                <UserIcon className="h-6 w-6" />
              </Link>}
          </div>
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700 hover:text-indigo-600">
              {isMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      {isMenuOpen && <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link to="/" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-indigo-50 rounded-md" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            <Link to="/products" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-indigo-50 rounded-md" onClick={() => setIsMenuOpen(false)}>
              Products
            </Link>
            <button className="w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:bg-indigo-50 rounded-md">
              Categories
            </button>
            <div className="pl-6 space-y-1">
              <Link to="/products?category=computers" className="block px-3 py-2 text-sm text-gray-700 hover:bg-indigo-50 rounded-md" onClick={() => setIsMenuOpen(false)}>
                Computers
              </Link>
              <Link to="/products?category=laptops" className="block px-3 py-2 text-sm text-gray-700 hover:bg-indigo-50 rounded-md" onClick={() => setIsMenuOpen(false)}>
                Laptops
              </Link>
              <Link to="/products?category=smartphones" className="block px-3 py-2 text-sm text-gray-700 hover:bg-indigo-50 rounded-md" onClick={() => setIsMenuOpen(false)}>
                Smartphones
              </Link>
              <Link to="/products?category=accessories" className="block px-3 py-2 text-sm text-gray-700 hover:bg-indigo-50 rounded-md" onClick={() => setIsMenuOpen(false)}>
                Accessories
              </Link>
            </div>
          </div>
          <div className="px-5 py-4 border-t border-gray-200">
            <div className="flex items-center">
              {currentUser ? <div className="w-full">
                  <div className="flex items-center mb-3">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                      {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : <UserIcon className="h-6 w-6" />}
                    </div>
                    <div>
                      <div className="text-base font-medium text-gray-800">
                        {currentUser.displayName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {currentUser.email}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Link to="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-indigo-50" onClick={() => setIsMenuOpen(false)}>
                      Your Profile
                    </Link>
                    <Link to="/cart" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-indigo-50" onClick={() => setIsMenuOpen(false)}>
                      Cart ({cartItemCount})
                    </Link>
                    <button onClick={handleLogout} className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-indigo-50">
                      Sign out
                    </button>
                  </div>
                </div> : <div className="w-full">
                  <Link to="/auth/login" className="block px-3 py-2 rounded-md text-base font-medium text-indigo-600 hover:bg-indigo-50" onClick={() => setIsMenuOpen(false)}>
                    Sign in
                  </Link>
                  <Link to="/auth/signup" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-indigo-50" onClick={() => setIsMenuOpen(false)}>
                    Create account
                  </Link>
                </div>}
            </div>
          </div>
        </div>}
    </header>;
};
export default Header;