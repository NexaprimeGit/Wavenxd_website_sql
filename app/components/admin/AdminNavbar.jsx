'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminNavbar() {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // Check if admin is logged in on component mount and listen for auth changes
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('adminToken');
      setIsLoggedIn(!!token);
    };

    // Check on mount
    checkAuth();

    // Listen for custom login event
    window.addEventListener('adminLoginSuccess', checkAuth);

    // Listen for storage changes (from other tabs)
    window.addEventListener('storage', checkAuth);

    return () => {
      window.removeEventListener('adminLoginSuccess', checkAuth);
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      // Call logout API
      const res = await fetch('/api/admin/logout', {
        method: 'POST',
      });

      if (res.ok) {
        // Clear the token from localStorage
        localStorage.removeItem('adminToken');
        
        // Update logged in state
        setIsLoggedIn(false);
        
        // Close the confirmation dialog
        setShowLogoutConfirm(false);
        
        // Small delay to ensure UI updates before redirect
        setTimeout(() => {
          router.replace('/admin-7f4b9c/login');
        }, 100);
      } else {
        alert('Logout failed');
        setShowLogoutConfirm(false);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Logout error:', error);
      alert('Logout failed');
      setShowLogoutConfirm(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border-b shadow-sm w-full">
      <div className="flex items-center justify-between px-4 md:px-8 py-3">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/admin-7f4b9c/dashboard">
            <Image src="/logo.png" alt="WaveNxD" width={180} height={80} />
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-6 text-sm font-semibold text-gray-700">
          <Link href="/admin-7f4b9c/dashboard" className="hover:text-green-600">
            Dashboard
          </Link>

          <Link href="/admin-7f4b9c/enquiries" className="hover:text-green-600">
            Enquiries
          </Link>

          <Link href="/admin-7f4b9c/products" className="hover:text-green-600">
            Products
          </Link>

          <Link
            href="/admin-7f4b9c/accessories"
            className="hover:text-green-600"
          >
            Accessories
          </Link>

          <Link href="/admin-7f4b9c/careers" className="hover:text-green-600">
            Careers
          </Link>

          <Link
            href="/admin-7f4b9c/industries"
            className="hover:text-green-600"
          >
            Industries
          </Link>

          {/* Logout Button - Only show when logged in */}
          {isLoggedIn && (
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-md transition font-bold"
            >
              Logout
            </button>
          )}
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Confirm Logout
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to logout? You will be redirected to the login page.
            </p>

            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                disabled={isLoading}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition disabled:opacity-50 font-semibold"
              >
                {isLoading ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
