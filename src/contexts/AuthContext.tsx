import React, { useEffect, useState, createContext, useContext } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile, deleteUser, User as FirebaseUser } from 'firebase/auth';
import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
}
interface AuthContextType {
  currentUser: UserData | null;
  isLoading: boolean;
  signup: (email: string, password: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  updateUserProfile: (data: {
    displayName?: string;
    photoURL?: string;
  }) => Promise<void>;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
export const AuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // Convert Firebase user to our UserData format
  const formatUser = (user: FirebaseUser): UserData => ({
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL
  });
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      if (user) {
        // Get additional user data from Firestore
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setCurrentUser({
            ...formatUser(user),
            ...userDoc.data()
          } as UserData);
        } else {
          setCurrentUser(formatUser(user));
        }
      } else {
        setCurrentUser(null);
      }
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);
  // Sign up new users
  const signup = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      const {
        user
      } = await createUserWithEmailAndPassword(auth, email, password);
      // Update profile with display name
      await updateProfile(user, {
        displayName: name
      });
      // Store additional user data in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: name,
        createdAt: new Date().toISOString(),
        browsingHistory: [],
        purchaseHistory: []
      });
      setCurrentUser(formatUser(user));
    } finally {
      setIsLoading(false);
    }
  };
  // Login existing users
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
    } finally {
      setIsLoading(false);
    }
  };
  // Logout current user
  const logout = async () => {
    try {
      setIsLoading(true);
      await signOut(auth);
      setCurrentUser(null);
    } finally {
      setIsLoading(false);
    }
  };
  // Delete user account
  const deleteAccount = async () => {
    if (!auth.currentUser) return;
    try {
      setIsLoading(true);
      const uid = auth.currentUser.uid;
      // Delete user data from Firestore
      await deleteDoc(doc(db, 'users', uid));
      await deleteDoc(doc(db, 'carts', uid));
      // Delete Firebase authentication account
      await deleteUser(auth.currentUser);
      setCurrentUser(null);
    } finally {
      setIsLoading(false);
    }
  };
  // Update user profile
  const updateUserProfile = async (data: {
    displayName?: string;
    photoURL?: string;
  }) => {
    if (!auth.currentUser) return;
    try {
      setIsLoading(true);
      await updateProfile(auth.currentUser, data);
      // Update Firestore user document
      if (data.displayName) {
        await setDoc(doc(db, 'users', auth.currentUser.uid), {
          displayName: data.displayName
        }, {
          merge: true
        });
      }
      // Update local state
      if (currentUser) {
        setCurrentUser({
          ...currentUser,
          ...data
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  const value = {
    currentUser,
    isLoading,
    signup,
    login,
    logout,
    deleteAccount,
    updateUserProfile
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};