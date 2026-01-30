'use client';
import Sidebar from '../components/Sidebar';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PricingPage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (u && u !== 'undefined') {
        try {
            setUser(JSON.parse(u));
        } catch (e) { console.error(e); }
    }
  }, []);

  const handlePurchase = async (amount: number, credits: number) => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!confirm(`确认支付 $${amount} 购买 ${credits} 积分?`)) return;

    try {
      const res = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          amount,
          credits
        })
      });

      if (res.ok) {
        alert('支付成功! 积分已到账。');
        // Update user credits
        fetch(`/api/user?userId=${user.id}`)
          .then(r => r.json())
          .then(d => {
             if(d.user) {
                 localStorage.setItem('user', JSON.stringify(d.user));
                 window.dispatchEvent(new Event('user-update'));
                 setUser(d.user);
             }
          });
      } else {
        alert('支付失败。');
      }
    } catch (e) {
      console.error(e);
      alert('支付处理错误');
    }
  };

  const tiers = [
    { name: '入门版', price: 5, credits: 50, features: ['50 次生成', '标准速度', '基础支持'] },
    { name: '专业版', price: 15, credits: 200, features: ['200 次生成', '快速通道', '优先支持'] },
    { name: '终极版', price: 50, credits: 800, features: ['800 次生成', '极速通道', '24/7 支持'] },
  ];

  return (
    <div className="flex h-screen bg-black text-white font-sans overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-y-auto bg-black p-8">
        <div className="max-w-5xl mx-auto py-12">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">简单定价</h1>
            <p className="text-gray-400">选择适合您的套餐。</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {tiers.map((tier) => (
              <div key={tier.name} className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-8 hover:border-yellow-500 transition duration-300">
                <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-bold text-yellow-400">${tier.price}</span>
                  <span className="text-gray-500 ml-2">/一次性</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-gray-300">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handlePurchase(tier.price, tier.credits)}
                  className="w-full bg-gray-800 hover:bg-yellow-500 hover:text-black text-white font-bold py-3 px-4 rounded-lg transition border border-gray-700 hover:border-yellow-500"
                >
                  选择 {tier.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
