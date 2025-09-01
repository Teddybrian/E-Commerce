import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Login from '../components/Auth/Login';
import SignUp from '../components/Auth/SignUp';
const AuthPage = () => {
  const location = useLocation();
  const {
    currentUser,
    isLoading
  } = useAuth();
  // Get the current auth mode from the URL path
  const isSignUp = location.pathname === '/auth/signup';
  // If user is already logged in, redirect to home
  if (!isLoading && currentUser) {
    return <Navigate to="/" replace />;
  }
  return <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {isSignUp ? 'Sign up to start shopping and track your orders' : 'Sign in to access your account and orders'}
          </p>
        </div>
        {isSignUp ? <SignUp /> : <Login />}
      </div>
    </div>;
};
export default AuthPage;