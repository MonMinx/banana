'use client';
import Navbar from '../components/Navbar';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (!u) {
      router.push('/login');
      return;
    }
    const user = JSON.parse(u);

    fetch(`/api/user?userId=${user.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setProfile(data.user);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) return <div className="min-h-screen bg-gray-950 text-white flex justify-center items-center">Loading...</div>;
  if (!profile) return <div className="min-h-screen bg-gray-950 text-white flex justify-center items-center">User not found</div>;

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 mb-8">
            <h1 className="text-3xl font-bold mb-6">User Profile</h1>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="block text-gray-400 text-sm uppercase mb-1">Email</label>
                <div className="text-xl">{profile.email}</div>
              </div>
              <div>
                <label className="block text-gray-400 text-sm uppercase mb-1">Credits</label>
                <div className="text-xl text-yellow-400 font-bold">{profile.credits}</div>
              </div>
              <div>
                 <label className="block text-gray-400 text-sm uppercase mb-1">Role</label>
                 <div className="text-xl capitalize">{profile.role}</div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Recent Generations</h2>
            {profile.generations && profile.generations.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {profile.generations.map((gen: any) => (
                  <div key={gen.id} className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden group relative">
                    {gen.status === 'completed' && gen.imageUrl && gen.imageUrl.startsWith('http') ? (
                       <img src={gen.imageUrl} alt={gen.prompt} className="w-full h-48 object-cover" />
                    ) : (
                       <div className="w-full h-48 bg-gray-800 flex items-center justify-center text-gray-500">
                         {gen.status}
                       </div>
                    )}
                    <div className="p-3">
                      <p className="text-sm text-gray-300 truncate" title={gen.prompt}>{gen.prompt}</p>
                      <span className={`text-xs mt-1 inline-block px-2 py-0.5 rounded ${gen.status === 'completed' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>
                        {gen.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No generations yet.</p>
            )}
          </div>

           <div>
            <h2 className="text-2xl font-bold mb-6">Transaction History</h2>
            {profile.transactions && profile.transactions.length > 0 ? (
               <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-800 text-gray-400">
                      <th className="p-4">Date</th>
                      <th className="p-4">Type</th>
                      <th className="p-4">Credits</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profile.transactions.map((tx: any) => (
                      <tr key={tx.id} className="border-b border-gray-800 hover:bg-gray-900">
                        <td className="p-4">{new Date(tx.createdAt).toLocaleDateString()}</td>
                         <td className="p-4 capitalize">{tx.type}</td>
                        <td className="p-4 text-green-400">+{tx.credits}</td>
                        <td className="p-4">${tx.amount}</td>
                         <td className="p-4">{tx.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
               </div>
            ) : (
               <p className="text-gray-500">No transactions yet.</p>
            )}
           </div>

        </div>
      </main>
    </div>
  );
}
