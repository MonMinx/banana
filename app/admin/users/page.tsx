'use client';
import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { useRouter } from 'next/navigation';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Basic check for admin client-side (API will double check)
  useEffect(() => {
    fetch('/api/admin/users')
      .then(res => {
          if (res.status === 401) {
              alert('无权访问或未登录');
              router.push('/login');
              throw new Error('Unauthorized');
          }
          return res.json();
      })
      .then(data => {
        if (data.users) setUsers(data.users);
      })
      .catch(e => console.error(e))
      .finally(() => setLoading(false));
  }, [router]);

  const handleUpdate = async (userId: number, newCredits: string, newRole: string) => {
      try {
          const res = await fetch('/api/admin/users', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  id: userId,
                  credits: newCredits,
                  role: newRole
              })
          });

          if (res.ok) {
              alert('更新成功');
              // Refresh
              setUsers(users.map(u => u.id === userId ? { ...u, credits: parseInt(newCredits), role: newRole } : u));
          } else {
              alert('更新失败');
          }
      } catch(e) {
          alert('Error');
      }
  };

  return (
    <div className="flex h-screen bg-black text-white font-sans overflow-hidden">
       <Sidebar />
       <main className="flex-1 overflow-y-auto bg-black p-8">
         <div className="max-w-6xl mx-auto py-12">
           <h1 className="text-3xl font-bold mb-6">用户管理 (Admin)</h1>

           <div className="overflow-x-auto bg-[#1a1a1a] rounded-xl border border-gray-800">
               <table className="w-full text-left text-sm text-gray-400">
                   <thead className="bg-gray-900 text-gray-200 uppercase font-medium">
                       <tr>
                           <th className="px-6 py-4">ID</th>
                           <th className="px-6 py-4">Email / WeChat</th>
                           <th className="px-6 py-4">Role</th>
                           <th className="px-6 py-4">Credits</th>
                           <th className="px-6 py-4">Joined</th>
                           <th className="px-6 py-4">Actions</th>
                       </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-800">
                       {users.map(user => (
                           <UserRow key={user.id} user={user} onUpdate={handleUpdate} />
                       ))}
                   </tbody>
               </table>
               {loading && <div className="p-4 text-center">Loading...</div>}
           </div>
         </div>
       </main>
    </div>
  );
}

function UserRow({ user, onUpdate }: { user: any, onUpdate: any }) {
    const [credits, setCredits] = useState(user.credits);
    const [role, setRole] = useState(user.role);
    const [changed, setChanged] = useState(false);

    const handleSave = () => {
        onUpdate(user.id, credits, role);
        setChanged(false);
    };

    return (
        <tr className="hover:bg-[#252525]">
            <td className="px-6 py-4">{user.id}</td>
            <td className="px-6 py-4">
                <div className="text-white">{user.email || 'WeChat User'}</div>
                <div className="text-xs">{user.wechatOpenId ? `OpenID: ${user.wechatOpenId.substring(0,8)}...` : ''}</div>
            </td>
            <td className="px-6 py-4">
                <select
                   value={role}
                   onChange={e => { setRole(e.target.value); setChanged(true); }}
                   className="bg-black border border-gray-700 rounded px-2 py-1"
                >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
            </td>
            <td className="px-6 py-4">
                <input
                   type="number"
                   value={credits}
                   onChange={e => { setCredits(e.target.value); setChanged(true); }}
                   className="w-20 bg-black border border-gray-700 rounded px-2 py-1 text-white"
                />
            </td>
            <td className="px-6 py-4">{new Date(user.createdAt).toLocaleDateString()}</td>
            <td className="px-6 py-4">
                {changed && (
                    <button
                      onClick={handleSave}
                      className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded text-xs"
                    >
                        Save
                    </button>
                )}
            </td>
        </tr>
    );
}
