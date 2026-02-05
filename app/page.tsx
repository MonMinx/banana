'use client';
import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ControlPanel from './components/ControlPanel';

type AspectRatio = '1:1' | '2:3' | '3:4' | '9:16' | '21:9' | '3:2' | '4:3' | '16:9';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('AI绘图');

  useEffect(() => {
    // Check for user session
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
          if (data.user) setUser(data.user);
      })
      .catch(e => console.error(e));
  }, []);

  const handleGenerate = async () => {
    if (!user) {
      alert('请先登录');
      return;
    }
    if (!prompt) {
        alert('请输入提示词');
        return;
    }

    setGenerating(true);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          prompt: prompt,
          aspectRatio: aspectRatio,
          imageBase64: referenceImage // Pass the base64 image
        })
      });

      const data = await res.json();

      if (res.ok && data.success && data.imageUrl) {
        setResults([data.imageUrl, ...results]);

        // Refresh credits
        fetch('/api/auth/me')
             .then(r => r.json())
             .then(d => {
                if(d.user) {
                    setUser(d.user);
                    window.dispatchEvent(new Event('user-update'));
                }
             });

      } else {
        alert('生成失败: ' + (data.error || '未知错误'));
      }
    } catch (e) {
      console.error(e);
      alert('网络错误');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="flex h-screen bg-black text-white font-sans overflow-hidden">
      {/* Leftmost Sidebar */}
      <Sidebar />

      {/* Control Panel */}
      <ControlPanel
        prompt={prompt}
        setPrompt={setPrompt}
        aspectRatio={aspectRatio}
        setAspectRatio={setAspectRatio}
        referenceImage={referenceImage}
        setReferenceImage={setReferenceImage}
        onGenerate={handleGenerate}
        generating={generating}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-black">
        {/* Top Tabs */}
        <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-900 bg-black z-10">
          {['全部', 'AI绘图', '收藏'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 text-xs rounded transition-colors ${activeTab === tab ? 'bg-yellow-400 text-black font-bold' : 'bg-[#1a1a1a] text-gray-400 hover:text-white'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Gallery / Results */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
           {results.length === 0 ? (
               <div className="flex flex-col items-center justify-center h-full text-gray-600">
                   <div className="text-xs mb-4">-已经到底了-</div>
               </div>
           ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {results.map((url, i) => (
                      <div key={i} className="relative group rounded-lg overflow-hidden border border-gray-800 bg-[#1a1a1a]">
                          <img src={url} alt={`Generated ${i}`} className="w-full h-auto object-cover" />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <a href={url} target="_blank" download className="text-white bg-black bg-opacity-50 px-3 py-1 rounded text-xs hover:bg-yellow-500 hover:text-black">
                                  下载
                              </a>
                          </div>
                      </div>
                  ))}
                  <div className="col-span-full py-8 text-center text-gray-600 text-xs">
                      -已经到底了-
                  </div>
               </div>
           )}
        </div>
      </div>
    </div>
  );
}
