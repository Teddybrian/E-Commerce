import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { UserIcon, LogOutIcon, TrashIcon, ShoppingBagIcon, ClockIcon } from 'lucide-react';
interface PurchaseHistory {
  orderId: string;
  date: string;
  total: number;
  items: any[];
  status: string;
}
interface BrowsingHistoryItem {
  productId: string;
  name: string;
  image: string;
  viewedAt: string;
}
const ProfilePage = () => {
  const {
    currentUser,
    logout,
    deleteAccount,
    isLoading
  } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [purchaseHistory, setPurchaseHistory] = useState<PurchaseHistory[]>([]);
  const [browsingHistory, setBrowsingHistory] = useState<BrowsingHistoryItem[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) return;
      try {
        setIsDataLoading(true);
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.purchaseHistory) {
            setPurchaseHistory(userData.purchaseHistory);
          }
          if (userData.browsingHistory) {
            setBrowsingHistory(userData.browsingHistory);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsDataLoading(false);
      }
    };
    fetchUserData();
  }, [currentUser]);
  // Redirect to login if not authenticated
  if (!isLoading && !currentUser) {
    return <Navigate to="/auth/login" replace />;
  }
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };
  const handleDeleteAccount = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }
    try {
      await deleteAccount();
    } catch (error) {
      console.error('Failed to delete account', error);
    }
  };
  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>;
  }
  return <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-8">
          My Account
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
              <div className="flex items-center space-x-4 mb-6 p-2">
                <div className="bg-indigo-100 p-3 rounded-full">
                  <UserIcon className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <p className="font-medium">{currentUser?.displayName}</p>
                  <p className="text-sm text-gray-500">{currentUser?.email}</p>
                </div>
              </div>
              <nav className="space-y-1">
                <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'profile' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                  <UserIcon className="h-5 w-5 mr-3" />
                  Profile
                </button>
                <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'orders' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                  <ShoppingBagIcon className="h-5 w-5 mr-3" />
                  Order History
                </button>
                <button onClick={() => setActiveTab('browsing')} className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'browsing' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                  <ClockIcon className="h-5 w-5 mr-3" />
                  Browsing History
                </button>
                <hr className="my-4 border-gray-200" />
                <button onClick={handleLogout} className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md">
                  <LogOutIcon className="h-5 w-5 mr-3" />
                  Sign Out
                </button>
                <button onClick={handleDeleteAccount} className="w-full flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md">
                  <TrashIcon className="h-5 w-5 mr-3" />
                  {deleteConfirm ? 'Confirm Delete Account' : 'Delete Account'}
                </button>
              </nav>
            </div>
          </div>
          {/* Main content */}
          <div className="md:col-span-3">
            {activeTab === 'profile' && <div className="bg-white shadow-sm rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Profile Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <p className="mt-1 text-gray-900">
                      {currentUser?.displayName}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <p className="mt-1 text-gray-900">{currentUser?.email}</p>
                  </div>
                </div>
                {/* We could add profile editing functionality here in the future */}
              </div>}
            {activeTab === 'orders' && <div className="bg-white shadow-sm rounded-lg">
                <h2 className="text-xl font-semibold text-gray-900 p-6 border-b">
                  Order History
                </h2>
                {isDataLoading ? <div className="p-6 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600 mb-2"></div>
                    <p className="text-gray-500">Loading order history...</p>
                  </div> : purchaseHistory.length > 0 ? <div className="divide-y divide-gray-200">
                    {purchaseHistory.map(order => <div key={order.orderId} className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="font-medium">
                              Order #{order.orderId}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(order.date).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : order.status === 'shipped' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {order.items.map((item, index) => <div key={index} className="flex items-center space-x-4">
                              <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                <img src={item.image} alt={item.name} className="h-full w-full object-cover object-center" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">
                                  {item.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Qty: {item.quantity}
                                </p>
                              </div>
                              <div className="text-sm font-medium text-gray-900">
                                ${(item.price * item.quantity).toFixed(2)}
                              </div>
                            </div>)}
                        </div>
                        <div className="mt-4 border-t border-gray-200 pt-4 flex justify-between">
                          <span className="text-sm font-medium text-gray-900">
                            Total
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            ${order.total.toFixed(2)}
                          </span>
                        </div>
                      </div>)}
                  </div> : <div className="p-6 text-center">
                    <p className="text-gray-500">
                      You haven't placed any orders yet.
                    </p>
                  </div>}
              </div>}
            {activeTab === 'browsing' && <div className="bg-white shadow-sm rounded-lg">
                <h2 className="text-xl font-semibold text-gray-900 p-6 border-b">
                  Recently Viewed Products
                </h2>
                {isDataLoading ? <div className="p-6 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600 mb-2"></div>
                    <p className="text-gray-500">Loading browsing history...</p>
                  </div> : browsingHistory.length > 0 ? <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6">
                    {browsingHistory.sort((a, b) => new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime()).slice(0, 10) // Show only the 10 most recent
              .map((item, index) => <div key={index} className="flex items-center space-x-4 p-3 border rounded-lg">
                          <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                            <img src={item.image} alt={item.name} className="h-full w-full object-cover object-center" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {item.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              Viewed on{' '}
                              {new Date(item.viewedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>)}
                  </div> : <div className="p-6 text-center">
                    <p className="text-gray-500">
                      No browsing history available.
                    </p>
                  </div>}
              </div>}
          </div>
        </div>
      </div>
    </div>;
};
export default ProfilePage;