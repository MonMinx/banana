'use client';
import Sidebar from '../components/Sidebar';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => {
          if (res.status === 401) {
              router.push('/login');
              throw new Error('Unauthorized');
          }
          return res.json();
      })
      .then(data => {
          if (data.user) {
              // Now fetch full profile with generations
              return fetch(`/api/user?userId=${data.user.id}`);
          }
      })
      .then(res => res && res.json())
      .then(data => {
        if (data && data.user) {
          setProfile(data.user);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) return <div className="flex h-screen bg-black text-white items-center justify-center">加载中...</div>;
  if (!profile) return <div className="flex h-screen bg-black text-white items-center justify-center">用户未找到</div>;

  return (
    <div className="flex h-screen bg-black text-white font-sans overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-y-auto bg-black p-8">
        <div className="max-w-5xl mx-auto py-12">
          <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-8 mb-8">
            <h1 className="text-3xl font-bold mb-6">个人中心</h1>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="block text-gray-400 text-sm uppercase mb-1">邮箱</label>
                <div className="text-xl">{profile.email}</div>
              </div>
              <div>
                <label className="block text-gray-400 text-sm uppercase mb-1">积分</label>
                <div className="text-xl text-yellow-400 font-bold">{profile.credits}</div>
              </div>
              <div>
                 <label className="block text-gray-400 text-sm uppercase mb-1">角色</label>
                 <div className="text-xl capitalize">{profile.role === 'user' ? '普通用户' : profile.role}</div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">近期生成</h2>
            {profile.generations && profile.generations.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {profile.generations.map((gen: any) => (
                  <div key={gen.id} className="bg-[#1a1a1a] border border-gray-800 rounded-lg overflow-hidden group relative">
                    {gen.status === 'completed' && gen.imageUrl && gen.imageUrl.startsWith('http') ? (
                       <img src={gen.imageUrl} alt={gen.prompt} className="w-full h-48 object-cover" />
                    ) : (
                       <div className="w-full h-48 bg-gray-800 flex items-center justify-center text-gray-500">
                         {gen.status === 'pending' ? '生成中' : gen.status}
                       </div>
                    )}
                    <div className="p-3">
                      <p className="text-sm text-gray-300 truncate" title={gen.prompt}>{gen.prompt}</p>
                      <span className={`text-xs mt-1 inline-block px-2 py-0.5 rounded ${gen.status === 'completed' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>
                        {gen.status === 'completed' ? '完成' : gen.status === 'pending' ? '进行中' : gen.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">暂无生成记录。</p>
            )}
          </div>

           <div>
            <h2 className="text-2xl font-bold mb-6">交易记录</h2>
            {profile.transactions && profile.transactions.length > 0 ? (
               <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-800 text-gray-400">
                      <th className="p-4">日期</th>
                      <th className="p-4">类型</th>
                      <th className="p-4">积分</th>
                      <th className="p-4">金额</th>
                      <th className="p-4">状态</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profile.transactions.map((tx: any) => (
                      <tr key={tx.id} className="border-b border-gray-800 hover:bg-[#2a2a2a]">
                        <td className="p-4">{new Date(tx.createdAt).toLocaleDateString()}</td>
                         <td className="p-4 capitalize">{tx.type === 'recharge' ? '充值' : tx.type}</td>
                        <td className="p-4 text-green-400">+{tx.credits}</td>
                        <td className="p-4">${tx.amount}</td>
                         <td className="p-4">{tx.status === 'completed' ? '完成' : tx.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
               </div>
            ) : (
               <p className="text-gray-500">暂无交易记录。</p>
            )}
           </div>

        </div>
      </main>
    </div>
  );
}
