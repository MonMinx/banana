'use client';
import {
  LightBulbIcon,
  SparklesIcon,
  PhotoIcon,
  VideoCameraIcon,
  CubeIcon,
  UserIcon,
  CurrencyYenIcon,
  QuestionMarkCircleIcon,
  ShieldCheckIcon,
  BoltIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Fetch user from secure session instead of localStorage
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null));

    // Listen for updates (e.g. login, credit change)
    const handleUpdate = () => {
       fetch('/api/auth/me')
         .then(res => res.json())
         .then(data => setUser(data.user || null))
         .catch(() => setUser(null));
    };
    window.addEventListener('user-update', handleUpdate);
    return () => window.removeEventListener('user-update', handleUpdate);
  }, []);

  const handleUserClick = () => {
    if (user) {
      router.push('/profile');
    } else {
      router.push('/login');
    }
  };

  const isActive = (path: string) => pathname === path;

  return (
    <div className="w-16 bg-black border-r border-gray-900 flex flex-col items-center py-4 justify-between h-screen text-gray-400 z-50">
      <div className="flex flex-col items-center space-y-6">
        <div className="text-yellow-400 font-bold text-xl mb-2 cursor-pointer" onClick={() => router.push('/')}>T</div>

        <div
          className={`flex flex-col items-center space-y-1 cursor-pointer group ${isActive('/') ? 'text-yellow-400' : 'hover:text-white'}`}
          onClick={() => router.push('/')}
        >
          <PhotoIcon className="h-6 w-6" />
          <span className="text-[10px]">绘图</span>
        </div>

        <div className="flex flex-col items-center space-y-1 hover:text-white cursor-pointer group" onClick={() => router.push('/profile')}>
          <CubeIcon className="h-6 w-6" />
          <span className="text-[10px]">资产</span>
        </div>

        {user && user.role === 'admin' && (
             <div className="flex flex-col items-center space-y-1 text-red-400 hover:text-red-300 cursor-pointer group" onClick={() => router.push('/admin/users')}>
                <Cog6ToothIcon className="h-6 w-6" />
                <span className="text-[10px]">管理</span>
             </div>
        )}
      </div>

      <div className="flex flex-col items-center space-y-6">
        <div
            className="flex flex-col items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleUserClick}
        >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs text-white font-bold ${user ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : 'bg-gray-700'}`}>
            {user ? user.email[0].toUpperCase() : <UserIcon className="w-4 h-4"/>}
            </div>

            <div className="bg-gray-800 text-gray-400 text-[10px] px-1 py-0.5 rounded text-center leading-tight">
            {user ? '基础会员' : '点击登录'}
            </div>
        </div>

        <div className="flex flex-col items-center space-y-1 hover:text-white cursor-pointer" onClick={() => router.push('/pricing')}>
          <BoltIcon className="h-5 w-5 text-yellow-500" />
          <span className="text-[10px] text-yellow-500">充值</span>
        </div>

        <div className="flex flex-col items-center space-y-1 hover:text-white cursor-pointer" onClick={() => window.open('https://github.com/QuantumNous/new-api', '_blank')}>
           <QuestionMarkCircleIcon className="h-5 w-5" />
        </div>

        <div className="flex flex-col items-center space-y-1 hover:text-white cursor-pointer">
           <span className="text-[10px] border border-gray-600 rounded px-1">ICP</span>
        </div>
      </div>
    </div>
  );
}
