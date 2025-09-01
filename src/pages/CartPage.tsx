import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlusIcon, MinusIcon, XIcon, CreditCardIcon, TruckIcon } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { doc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
const CartPage = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartTotal
  } = useCart();
  const {
    currentUser
  } = useAuth();
  const navigate = useNavigate();
  const shipping = cartTotal > 100 ? 0 : 10;
  const tax = cartTotal * 0.08; // Assuming 8% tax
  const total = cartTotal + shipping + tax;
  const handleCheckout = async () => {
    if (!currentUser) {
      // Redirect to login if not authenticated
      navigate('/auth/login');
      return;
    }
    try {
      // Create an order in Firestore
      const orderId = `ORD-${Date.now()}`;
      const orderItems = cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      }));
      // Add to purchase history
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        purchaseHistory: arrayUnion({
          orderId,
          date: new Date().toISOString(),
          total,
          items: orderItems,
          status: 'processing'
        })
      });
      // Clear the cart
      await clearCart();
      // Show confirmation (in a real app, redirect to order confirmation page)
      alert(`Order ${orderId} placed successfully!`);
      // Redirect to home
      navigate('/');
    } catch (error) {
      console.error('Error processing order:', error);
      alert('Failed to process your order. Please try again.');
    }
  };
  return <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-8">
          Shopping Cart
        </h1>
        {cartItems.length > 0 ? <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* Cart items */}
              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {cartItems.map(item => <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                              <img src={item.image} alt={item.name} className="h-full w-full object-cover object-center" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {item.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {item.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            ${item.price.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 rounded-md text-gray-500 hover:bg-gray-100">
                              <MinusIcon className="h-4 w-4" />
                            </button>
                            <span className="mx-2 text-gray-700 w-8 text-center">
                              {item.quantity}
                            </span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 rounded-md text-gray-500 hover:bg-gray-100">
                              <PlusIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${(item.price * item.quantity).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button onClick={() => removeFromCart(item.id)} className="text-red-600 hover:text-red-900">
                            <XIcon className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>)}
                  </tbody>
                </table>
              </div>
              {/* Continue shopping */}
              <div className="mt-6">
                <Link to="/products" className="text-indigo-600 hover:text-indigo-500 flex items-center">
                  <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Continue Shopping
                </Link>
              </div>
            </div>
            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Order Summary
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <div className="text-sm text-gray-600">Subtotal</div>
                    <div className="text-sm font-medium text-gray-900">
                      ${cartTotal.toLocaleString()}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-sm text-gray-600">Shipping</div>
                    <div className="text-sm font-medium text-gray-900">
                      {shipping === 0 ? 'Free' : `$${shipping.toLocaleString()}`}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-sm text-gray-600">Tax</div>
                    <div className="text-sm font-medium text-gray-900">
                      ${tax.toFixed(2)}
                    </div>
                  </div>
                  <div className="border-t border-gray-200 pt-4 flex justify-between">
                    <div className="text-base font-medium text-gray-900">
                      Total
                    </div>
                    <div className="text-base font-medium text-gray-900">
                      ${total.toFixed(2)}
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <button onClick={handleCheckout} className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    {currentUser ? 'Checkout' : 'Sign in to Checkout'}
                  </button>
                </div>
                <div className="mt-6 space-y-4">
                  <div className="flex items-center">
                    <TruckIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-500">
                      Free shipping on orders over $100
                    </span>
                  </div>
                  <div className="flex items-center">
                    <CreditCardIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-500">
                      Secure payment processing
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div> : <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h2 className="mt-2 text-lg font-medium text-gray-900">
              Your cart is empty
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Looks like you haven't added any products to your cart yet.
            </p>
            <div className="mt-6">
              <Link to="/products" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Start Shopping
              </Link>
            </div>
          </div>}
      </div>
    </div>;
};
export default CartPage;