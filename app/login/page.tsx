'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.user) {
            localStorage.setItem('user', JSON.stringify(data.user));
            // Dispatch custom event to update Navbar
            window.dispatchEvent(new Event('user-update'));
            router.push('/');
        } else {
            alert('登录异常：未返回用户信息');
        }
      } else {
        alert('登录失败');
      }
    } catch (error) {
      console.error(error);
      alert('发生错误');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
      <div className="bg-gray-900 p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-800">
        <h2 className="text-2xl font-bold mb-6 text-center text-yellow-400">欢迎来到 NanoGen</h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">邮箱地址</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:ring-2 focus:ring-yellow-500 focus:outline-none text-white placeholder-gray-500"
              placeholder="请输入您的邮箱"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">密码</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:ring-2 focus:ring-yellow-500 focus:outline-none text-white placeholder-gray-500"
              placeholder="请输入密码 (自动注册)"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded transition disabled:opacity-50"
          >
            {loading ? '登录中...' : '登录 / 注册'}
          </button>

          <div className="relative flex py-2 items-center">
             <div className="flex-grow border-t border-gray-700"></div>
             <span className="flex-shrink mx-4 text-gray-400 text-xs">或者</span>
             <div className="flex-grow border-t border-gray-700"></div>
          </div>

          <button
            type="button"
            onClick={() => window.location.href = '/api/auth/wechat/login'}
            className="w-full bg-[#07C160] hover:bg-[#06ad56] text-white font-bold py-2 px-4 rounded transition flex items-center justify-center gap-2"
          >
             <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8.697 15.636c0 .412-.338.745-.757.745-.42 0-.758-.333-.758-.745 0-.412.338-.745.758-.745.419 0 .757.333.757.745zm4.849 0c0 .412-.338.745-.758.745-.42 0-.758-.333-.758-.745 0-.412.338-.745.758-.745.42 0 .758.333.758.745zm-1.455 3.333c5.03 0 9.09-3.212 9.09-7.272 0-4.06-4.06-7.273-9.09-7.273-5.03 0-9.091 3.212-9.091 7.273 0 2.242 1.212 4.182 3.152 5.515l-.788 2.364 2.848-1.455c1.152.485 2.516.848 3.788.848z"/></svg>
             微信快捷登录
          </button>

        </form>
      </div>
    </div>
  );
}
