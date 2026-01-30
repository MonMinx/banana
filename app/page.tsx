'use client';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Image from 'next/image';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (u) setUser(JSON.parse(u));
  }, []);

  const handleGenerate = async () => {
    if (!user) {
      alert('Please login first');
      return;
    }
    if (!prompt) return;

    setGenerating(true);
    setResultImage(null);
    setStatus('Generating... This may take about 10 seconds.');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          prompt: prompt
        })
      });

      const data = await res.json();

      if (res.ok && data.success && data.imageUrl) {
        setResultImage(data.imageUrl);
        setStatus('Completed');

        // Refresh credits
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
        setStatus('Error: ' + (data.error || 'Generation failed'));
      }
    } catch (e) {
      console.error(e);
      setStatus('Error: Network failed');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
              Nano Banana Pro Generator
            </h1>
            <p className="text-gray-400 text-lg">
              Create stunning model dressing images with AI.
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-2xl">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">Prompt</label>
              <textarea
                className="w-full bg-gray-950 border border-gray-800 rounded-lg p-4 text-white focus:ring-2 focus:ring-yellow-500 focus:outline-none min-h-[120px]"
                placeholder="Describe the image you want to generate..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>

            <div className="flex justify-end">
               <button
                onClick={handleGenerate}
                disabled={generating || !prompt}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-8 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {generating ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  'Generate Image (1 Credit)'
                )}
              </button>
            </div>
          </div>

          {(status || resultImage) && (
            <div className="mt-8 bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                 <h3 className="text-xl font-semibold">Result</h3>
                 <span className="text-sm text-gray-400">{status}</span>
              </div>

              <div className="flex justify-center bg-gray-950 rounded-lg p-4 min-h-[300px] items-center">
                {resultImage ? (
                  <div className="relative w-full max-w-lg aspect-square">
                     <img
                       src={resultImage}
                       alt="Generated"
                       className="rounded-lg shadow-lg object-contain w-full h-full"
                     />
                     <div className="mt-4 text-center">
                        <a href={resultImage} target="_blank" download className="text-blue-400 hover:text-blue-300 underline">Download High Res</a>
                     </div>
                  </div>
                ) : (
                  <div className="text-gray-600">
                    {generating ? 'Processing your request...' : 'Waiting for image...'}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </main>

      <footer className="bg-gray-900 border-t border-gray-800 py-6 text-center text-gray-500 text-sm">
        &copy; 2026 NanoGen. All rights reserved.
      </footer>
    </div>
  );
}
