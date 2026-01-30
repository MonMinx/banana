'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check for stored user
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
    }

    // Listen for storage events (login/logout updates)
    const handleStorage = () => {
      const u = localStorage.getItem('user');
      setUser(u ? JSON.parse(u) : null);
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('user-update', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('user-update', handleStorage);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 font-bold text-xl text-yellow-400">
              NanoGen
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  href="/"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${pathname === '/' ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                >
                  生成
                </Link>
                <Link
                  href="/pricing"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${pathname === '/pricing' ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                >
                  价格
                </Link>
                {user && (
                  <Link
                    href="/profile"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${pathname === '/profile' ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                  >
                    个人中心
                  </Link>
                )}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-yellow-400 font-medium">{user.credits} 积分</span>
                  <span className="text-sm text-gray-400">{user.email}</span>
                  <button onClick={logout} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm">
                    退出
                  </button>
                </div>
              ) : (
                <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium">
                  登录
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
