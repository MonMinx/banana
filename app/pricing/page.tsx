'use client';
import Navbar from '../components/Navbar';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PricingPage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (u) setUser(JSON.parse(u));
  }, []);

  const handlePurchase = async (amount: number, credits: number) => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!confirm(`Confirm purchase of ${credits} credits for $${amount}?`)) return;

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
        alert('Payment successful! Credits added.');
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
        alert('Payment failed.');
      }
    } catch (e) {
      console.error(e);
      alert('Error processing payment');
    }
  };

  const tiers = [
    { name: 'Starter', price: 5, credits: 50, features: ['50 Generations', 'Standard Speed', 'Basic Support'] },
    { name: 'Pro', price: 15, credits: 200, features: ['200 Generations', 'Fast Speed', 'Priority Support'] },
    { name: 'Ultimate', price: 50, credits: 800, features: ['800 Generations', 'Max Speed', '24/7 Support'] },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Simple Pricing</h1>
          <p className="text-gray-400">Choose the plan that fits your needs.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {tiers.map((tier) => (
            <div key={tier.name} className="bg-gray-900 border border-gray-800 rounded-xl p-8 hover:border-yellow-500 transition duration-300">
              <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
              <div className="flex items-baseline mb-6">
                <span className="text-4xl font-bold text-yellow-400">${tier.price}</span>
                <span className="text-gray-500 ml-2">/one-time</span>
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
                Choose {tier.name}
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
