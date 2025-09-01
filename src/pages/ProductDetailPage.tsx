import React, { useState, memo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { StarIcon, ShoppingCartIcon, HeartIcon, TruckIcon, ShieldIcon } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../services/firebase';
// Mock data for a single product
const productData = {
  id: '1',
  name: 'MacBook Pro 16"',
  description: 'The most powerful MacBook Pro ever is here. With the blazing-fast M1 Pro chip — the first Apple silicon designed for pros — you get groundbreaking performance and amazing battery life. Add to that a stunning Liquid Retina XDR display, the best camera and audio ever in a Mac notebook, and all the ports you need.',
  price: 2399,
  image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1626&q=80',
  additionalImages: ['https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1650&q=80', 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1650&q=80', 'https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1650&q=80'],
  category: 'laptops',
  rating: 4.9,
  reviews: 256,
  inStock: true,
  features: ['Apple M1 Pro chip with 10-core CPU and 16-core GPU', '16GB unified memory', '512GB SSD storage', '16-inch Liquid Retina XDR display', 'Three Thunderbolt 4 ports, HDMI port, SDXC card slot, MagSafe 3 port', 'Magic Keyboard with Touch ID', 'Force Touch trackpad', 'Up to 21 hours of battery life'],
  specifications: {
    processor: 'Apple M1 Pro',
    memory: '16GB unified memory',
    storage: '512GB SSD',
    display: '16-inch Liquid Retina XDR display (3456 x 2234)',
    graphics: '16-core GPU',
    battery: 'Up to 21 hours',
    weight: '4.7 pounds (2.1 kg)',
    dimensions: '0.66 x 14.01 x 9.77 inches'
  }
};
// Mock data for related products
const relatedProducts = [{
  id: '4',
  name: 'Dell XPS 15',
  description: 'Intel i9, 32GB RAM, 1TB SSD, RTX 3050 Ti',
  price: 2199,
  image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1626&q=80',
  category: 'laptops',
  rating: 4.6,
  inStock: true
}, {
  id: '9',
  name: 'Lenovo ThinkPad X1 Carbon',
  description: 'Intel i7, 16GB RAM, 512GB SSD',
  price: 1699,
  image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1650&q=80',
  category: 'laptops',
  rating: 4.5,
  inStock: true
}, {
  id: '10',
  name: 'HP Spectre x360',
  description: 'Intel i7, 16GB RAM, 1TB SSD, 2-in-1 Convertible',
  price: 1499,
  image: 'https://images.unsplash.com/photo-1544731612-de7f96afe55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1650&q=80',
  category: 'laptops',
  rating: 4.4,
  inStock: false
}];
const ProductDetailPage = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [activeImage, setActiveImage] = useState(productData.image);
  const [addedToCart, setAddedToCart] = useState(false);
  const {
    addToCart
  } = useCart();
  const {
    currentUser
  } = useAuth();
  // In a real app, you would fetch the product data based on the ID
  // For this demo, we'll just use our mock data
  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQuantity(parseInt(e.target.value));
  };
  const handleAddToCart = async () => {
    try {
      await addToCart(productData, quantity);
      // Add to browsing history in Firestore if user is logged in
      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        await updateDoc(userRef, {
          browsingHistory: arrayUnion({
            productId: productData.id,
            name: productData.name,
            image: productData.image,
            viewedAt: new Date().toISOString()
          })
        });
      }
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };
  const handleRelatedProductAddToCart = (product: any) => {
    addToCart(product, 1);
  };
  return <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link to="/" className="text-gray-500 hover:text-gray-700 text-sm">
                Home
              </Link>
            </li>
            <li className="flex items-center">
              <span className="text-gray-400 mx-2">/</span>
              <Link to="/products" className="text-gray-500 hover:text-gray-700 text-sm">
                Products
              </Link>
            </li>
            <li className="flex items-center">
              <span className="text-gray-400 mx-2">/</span>
              <Link to={`/products?category=${productData.category}`} className="text-gray-500 hover:text-gray-700 text-sm capitalize">
                {productData.category}
              </Link>
            </li>
            <li className="flex items-center">
              <span className="text-gray-400 mx-2">/</span>
              <span className="text-gray-900 text-sm">{productData.name}</span>
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product images */}
          <div className="space-y-4">
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden bg-gray-100">
              <img src={activeImage} alt={productData.name} className="w-full h-full object-contain" />
            </div>
            <div className="grid grid-cols-4 gap-4">
              <button onClick={() => setActiveImage(productData.image)} className={`aspect-w-1 aspect-h-1 rounded-md overflow-hidden ${activeImage === productData.image ? 'ring-2 ring-indigo-500' : 'ring-1 ring-gray-200'}`}>
                <img src={productData.image} alt={`${productData.name} thumbnail`} className="w-full h-full object-cover" />
              </button>
              {productData.additionalImages.map((image, index) => <button key={index} onClick={() => setActiveImage(image)} className={`aspect-w-1 aspect-h-1 rounded-md overflow-hidden ${activeImage === image ? 'ring-2 ring-indigo-500' : 'ring-1 ring-gray-200'}`}>
                  <img src={image} alt={`${productData.name} thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                </button>)}
            </div>
          </div>

          {/* Product info */}
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
              {productData.name}
            </h1>
            <div className="mt-2 flex items-center">
              <div className="flex items-center">
                {[0, 1, 2, 3, 4].map(rating => <StarIcon key={rating} className={`h-5 w-5 ${productData.rating > rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" />)}
              </div>
              <span className="ml-2 text-gray-600 text-sm">
                {productData.rating} ({productData.reviews} reviews)
              </span>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold text-gray-900">
                ${productData.price.toLocaleString()}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Free shipping on orders over $100
              </p>
            </div>
            <div className="mt-6 space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  Availability
                </h3>
                <p className={`mt-1 ${productData.inStock ? 'text-green-600' : 'text-red-600'}`}>
                  {productData.inStock ? 'In stock' : 'Out of stock'}
                </p>
              </div>
              {productData.inStock && <div>
                  <label htmlFor="quantity" className="text-sm font-medium text-gray-900">
                    Quantity
                  </label>
                  <select id="quantity" name="quantity" value={quantity} onChange={handleQuantityChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                    {[1, 2, 3, 4, 5].map(num => <option key={num} value={num}>
                        {num}
                      </option>)}
                  </select>
                </div>}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button onClick={handleAddToCart} disabled={!productData.inStock || addedToCart} className={`w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${addedToCart ? 'bg-green-600' : productData.inStock ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-400 cursor-not-allowed'}`}>
                  <ShoppingCartIcon className="h-5 w-5 mr-2" />
                  {addedToCart ? 'Added to Cart!' : 'Add to Cart'}
                </button>
                <button className="w-full flex items-center justify-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <HeartIcon className="h-5 w-5 mr-2" />
                  Add to Wishlist
                </button>
              </div>
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center mb-4">
                  <TruckIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-500">
                    Free shipping within US
                  </span>
                </div>
                <div className="flex items-center">
                  <ShieldIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-500">1 year warranty</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product tabs */}
        <div className="mt-12">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {['description', 'features', 'specifications'].map(tab => <button key={tab} onClick={() => setActiveTab(tab)} className={`
                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize
                    ${activeTab === tab ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                  `}>
                  {tab}
                </button>)}
            </nav>
          </div>
          <div className="py-6">
            {activeTab === 'description' && <p className="text-gray-700 leading-relaxed">
                {productData.description}
              </p>}
            {activeTab === 'features' && <ul className="list-disc pl-5 space-y-2 text-gray-700">
                {productData.features.map((feature, index) => <li key={index}>{feature}</li>)}
              </ul>}
            {activeTab === 'specifications' && <div className="border rounded-md overflow-hidden">
                {Object.entries(productData.specifications).map(([key, value], index) => <div key={key} className={`grid grid-cols-2 px-4 py-3 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                      <div className="font-medium text-gray-900 capitalize">
                        {key}
                      </div>
                      <div className="text-gray-700">{value}</div>
                    </div>)}
              </div>}
          </div>
        </div>

        {/* Related products */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Related Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map(product => <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
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
                  <p className="text-sm text-gray-500 mt-1">
                    {product.description}
                  </p>
                  <div className="flex items-center mt-2">
                    <div className="flex items-center">
                      {[0, 1, 2, 3, 4].map(rating => <StarIcon key={rating} className={`h-4 w-4 ${product.rating > rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" />)}
                    </div>
                    <span className="text-xs text-gray-500 ml-2">
                      ({product.rating})
                    </span>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">
                      ${product.price.toLocaleString()}
                    </span>
                    <button onClick={() => handleRelatedProductAddToCart(product)} className={`p-2 rounded-full ${product.inStock ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`} disabled={!product.inStock}>
                      <ShoppingCartIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>)}
          </div>
        </div>
      </div>
    </div>;
};
export default ProductDetailPage;