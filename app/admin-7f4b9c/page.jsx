'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminRegister() {
  const router = useRouter();

  const [adminExists, setAdminExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function checkAdmin() {
      try {
        const res = await fetch('/api/admin');
        const data = await res.json();
        if (data.exists) setAdminExists(true);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    checkAdmin();
  }, []);

  useEffect(() => {
    if (adminExists) router.replace('/admin-7f4b9c/login');
  }, [adminExists, router]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (data.success) router.push('/admin-7f4b9c/login');
      else setError(data.error || 'Registration failed');
    } catch {
      setError('Registration failed');
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (adminExists) return null;

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100 pt-24">
      <form
        onSubmit={handleRegister}
        className="bg-white w-full max-w-sm rounded-xl border border-gray-200 shadow-lg px-8 py-10 space-y-6"
      >
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-semibold text-gray-800">
            Admin Registration
          </h2>
          <p className="text-sm text-gray-500">Create secure admin access</p>
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-4 py-2 text-center">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/40"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/40"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2.5 rounded-lg font-medium hover:bg-green-700 transition"
        >
          Register
        </button>
      </form>
    </div>
  );
}
