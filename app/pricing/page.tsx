'use client';
import Sidebar from '../components/Sidebar';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PricingPage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
          if (data.user) setUser(data.user);
      })
      .catch(e => console.error(e));
  }, []);

  const [showModal, setShowModal] = useState(false);
  const [selectedTier, setSelectedTier] = useState<any>(null);
  const [processing, setProcessing] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);

  const initiatePurchase = async (tier: any) => {
      if (!user) {
          router.push('/login');
          return;
      }

      try {
        // Create Pending Order immediately
        const res = await fetch('/api/payment/wechat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: user.id,
              amount: tier.price,
              credits: tier.credits
            })
        });
        const data = await res.json();
        if (data.pay_info && data.pay_info.orderId) {
            setCurrentOrderId(data.pay_info.orderId);
            setSelectedTier(tier);
            setShowModal(true);
        } else {
            alert('创建订单失败');
        }
      } catch(e) {
        console.error(e);
        alert('网络错误');
      }
  };

  const confirmPurchase = async () => {
    if (!selectedTier || !user || !currentOrderId) return;
    setProcessing(true);

    // Verify Payment (Completes transaction & adds credits)
    try {
      const res = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: currentOrderId })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        alert('支付成功! 积分已到账。');
        setShowModal(false);
        setProcessing(false);

        // Refresh user
        window.dispatchEvent(new Event('user-update'));
        fetch('/api/auth/me')
          .then(r => r.json())
          .then(d => {
              if(d.user) setUser(d.user);
          });
      } else {
        alert('支付验证失败或超时');
        setProcessing(false);
      }
    } catch (e) {
      console.error(e);
      setProcessing(false);
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
                  onClick={() => initiatePurchase(tier)}
                  className="w-full bg-gray-800 hover:bg-yellow-500 hover:text-black text-white font-bold py-3 px-4 rounded-lg transition border border-gray-700 hover:border-yellow-500"
                >
                  选择 {tier.name}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Modal */}
        {showModal && selectedTier && (
            <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
                <div className="bg-[#1a1a1a] border border-gray-700 rounded-xl p-8 max-w-sm w-full text-center relative">
                    <button
                        onClick={() => setShowModal(false)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-white"
                    >
                        ✕
                    </button>

                    <h3 className="text-xl font-bold mb-4">微信支付</h3>
                    <p className="text-gray-400 mb-6">扫码支付 <span className="text-yellow-400 text-lg font-bold">${selectedTier.price}</span></p>

                    <div className="bg-white p-4 rounded-lg inline-block mb-6">
                        {/* Mock QR Code */}
                        <div className="w-48 h-48 bg-gray-200 flex items-center justify-center text-black text-xs">
                            [模拟二维码]<br/>
                            请点击下方按钮<br/>
                            模拟支付完成
                        </div>
                    </div>

                    <button
                        onClick={confirmPurchase}
                        disabled={processing}
                        className="w-full bg-[#07C160] hover:bg-[#06ad56] text-white font-bold py-3 rounded transition flex items-center justify-center gap-2"
                    >
                        {processing ? '支付处理中...' : '模拟已支付'}
                    </button>
                </div>
            </div>
        )}

      </main>
    </div>
  );
}
