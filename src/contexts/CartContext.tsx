import React, { useEffect, useState, createContext, useContext } from 'react';
import { doc, setDoc, getDoc, updateDoc, arrayUnion, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from './AuthContext';
interface CartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  quantity: number;
}
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: any, quantity: number) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  isLoading: boolean;
  cartTotal: number;
}
const CartContext = createContext<CartContextType | undefined>(undefined);
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
export const CartProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const {
    currentUser
  } = useAuth();
  // Calculate cart total
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  // Load cart from local storage for non-authenticated users
  // or from Firestore for authenticated users
  useEffect(() => {
    const loadCart = async () => {
      setIsLoading(true);
      if (currentUser) {
        // User is logged in, fetch cart from Firestore
        const cartRef = doc(db, 'carts', currentUser.uid);
        // Check if cart exists, if not create it
        const cartDoc = await getDoc(cartRef);
        if (!cartDoc.exists()) {
          await setDoc(cartRef, {
            items: []
          });
        }
        // Set up real-time listener for cart changes
        const unsubscribe = onSnapshot(cartRef, doc => {
          if (doc.exists() && doc.data().items) {
            setCartItems(doc.data().items);
          } else {
            setCartItems([]);
          }
          setIsLoading(false);
        });
        return () => unsubscribe();
      } else {
        // User is not logged in, use local storage
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
        }
        setIsLoading(false);
      }
    };
    loadCart();
  }, [currentUser]);
  // Save cart to local storage when it changes (for non-authenticated users)
  useEffect(() => {
    if (!currentUser) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, currentUser]);
  // Add item to cart
  const addToCart = async (product: any, quantity: number) => {
    try {
      const newItem: CartItem = {
        id: product.id,
        name: product.name,
        description: product.description || '',
        price: product.price,
        image: product.image,
        quantity: quantity
      };
      // Check if item already exists in cart
      const existingItem = cartItems.find(item => item.id === product.id);
      let updatedCart: CartItem[];
      if (existingItem) {
        // Update quantity if item exists
        updatedCart = cartItems.map(item => item.id === product.id ? {
          ...item,
          quantity: item.quantity + quantity
        } : item);
      } else {
        // Add new item if it doesn't exist
        updatedCart = [...cartItems, newItem];
      }
      if (currentUser) {
        // Update Firestore
        const cartRef = doc(db, 'carts', currentUser.uid);
        await setDoc(cartRef, {
          items: updatedCart
        }, {
          merge: true
        });
        // Add to browsing history
        const userRef = doc(db, 'users', currentUser.uid);
        await updateDoc(userRef, {
          browsingHistory: arrayUnion({
            productId: product.id,
            name: product.name,
            image: product.image,
            viewedAt: new Date().toISOString()
          })
        });
      } else {
        // Update local state
        setCartItems(updatedCart);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };
  // Remove item from cart
  const removeFromCart = async (id: string) => {
    try {
      const updatedCart = cartItems.filter(item => item.id !== id);
      if (currentUser) {
        // Update Firestore
        const cartRef = doc(db, 'carts', currentUser.uid);
        await setDoc(cartRef, {
          items: updatedCart
        }, {
          merge: true
        });
      } else {
        // Update local state
        setCartItems(updatedCart);
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  };
  // Update item quantity
  const updateQuantity = async (id: string, quantity: number) => {
    try {
      if (quantity < 1) return;
      const updatedCart = cartItems.map(item => item.id === id ? {
        ...item,
        quantity
      } : item);
      if (currentUser) {
        // Update Firestore
        const cartRef = doc(db, 'carts', currentUser.uid);
        await setDoc(cartRef, {
          items: updatedCart
        }, {
          merge: true
        });
      } else {
        // Update local state
        setCartItems(updatedCart);
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      throw error;
    }
  };
  // Clear cart
  const clearCart = async () => {
    try {
      if (currentUser) {
        // Update Firestore
        const cartRef = doc(db, 'carts', currentUser.uid);
        await setDoc(cartRef, {
          items: []
        }, {
          merge: true
        });
      } else {
        // Update local state
        setCartItems([]);
        localStorage.removeItem('cart');
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  };
  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isLoading,
    cartTotal
  };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};