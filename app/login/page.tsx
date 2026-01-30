'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('user', JSON.stringify(data.user));
        // Dispatch custom event to update Navbar
        window.dispatchEvent(new Event('user-update'));
        router.push('/');
      } else {
        alert('Login failed');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
      <div className="bg-gray-900 p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-800">
        <h2 className="text-2xl font-bold mb-6 text-center text-yellow-400">Welcome to NanoGen</h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:ring-2 focus:ring-yellow-500 focus:outline-none text-white"
              placeholder="Enter your email"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded transition disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Sign In / Register'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-500">
          (This is a mock login. Just enter any email.)
        </p>
      </div>
    </div>
  );
}
