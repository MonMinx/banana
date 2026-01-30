'use client';
import {
  ChevronRightIcon,
  PhotoIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { PaperAirplaneIcon, BoltIcon } from '@heroicons/react/24/solid';
import { useRef } from 'react';

type AspectRatio = '1:1' | '2:3' | '3:4' | '9:16' | '21:9' | '3:2' | '4:3' | '16:9';

interface ControlPanelProps {
  prompt: string;
  setPrompt: (s: string) => void;
  aspectRatio: AspectRatio;
  setAspectRatio: (r: AspectRatio) => void;
  referenceImage: string | null;
  setReferenceImage: (img: string | null) => void;
  onGenerate: () => void;
  generating: boolean;
}

export default function ControlPanel({
  prompt,
  setPrompt,
  aspectRatio,
  setAspectRatio,
  referenceImage,
  setReferenceImage,
  onGenerate,
  generating
}: ControlPanelProps) {

  const ratios: AspectRatio[] = ['1:1', '2:3', '3:4', '9:16', '21:9', '3:2', '4:3', '16:9'];
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReferenceImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReferenceImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-[340px] bg-[#1a1a1a] border-r border-gray-800 flex flex-col h-screen text-gray-300 flex-shrink-0">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-800">
        <h2 className="text-white font-medium flex items-center gap-2">
          <span className="bg-gray-800 p-1 rounded"><PhotoIcon className="w-4 h-4"/></span>
          图片生成
        </h2>
        <div
            className="text-yellow-400 text-sm flex items-center cursor-pointer hover:text-yellow-300 transition-colors"
            onClick={() => alert('工具集页面正在开发中')}
        >
          工具集 <ChevronRightIcon className="w-3 h-3 ml-1"/>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">

        {/* Prompt Section */}
        <div className="space-y-2">
           <div className="flex items-center justify-between text-xs text-gray-400">
             <div className="flex gap-4">
               <span className="text-white cursor-pointer border-b-2 border-yellow-400 pb-0.5">提示词</span>
               <span className="cursor-pointer hover:text-gray-300">模型</span>
             </div>
             <div className="flex items-center gap-1 bg-gray-800 px-2 py-1 rounded cursor-pointer hover:bg-gray-700">
               <span className="text-[10px]">Nano Banana Pro</span>
               <ChevronRightIcon className="w-3 h-3"/>
             </div>
           </div>

           <div className="relative">
             <textarea
               className="w-full h-32 bg-[#0f0f0f] border border-gray-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-yellow-500 resize-none placeholder-gray-600"
               placeholder="在此输入提示词..."
               value={prompt}
               onChange={(e) => setPrompt(e.target.value)}
             />
             <div className="absolute bottom-2 right-2 text-gray-600 text-xs">{prompt.length}/2000</div>
           </div>
        </div>

        {/* Aspect Ratio */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">出图比例</span>
            <div className="flex items-center gap-1 text-gray-500 cursor-pointer hover:text-gray-400">
              <input type="checkbox" className="bg-transparent border-gray-600 rounded-sm w-3 h-3"/>
              <span className="text-xs">原图比例</span>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {ratios.map(r => (
              <button
                key={r}
                onClick={() => setAspectRatio(r)}
                className={`flex flex-col items-center justify-center p-2 rounded border transition-colors ${aspectRatio === r ? 'border-yellow-400 text-yellow-400 bg-gray-800' : 'border-gray-700 bg-[#2a2a2a] text-gray-500 hover:bg-gray-700 hover:text-gray-300'}`}
              >
                <div className={`border mb-1 transition-colors ${aspectRatio === r ? 'border-yellow-400' : 'border-gray-500'}`} style={{
                  width: '12px',
                  height: calculateHeight(r)
                }}></div>
                <span className="text-[10px]">{r}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Settings Row */}
        <div className="flex gap-2">
           <div className="flex-1 space-y-1">
             <div className="text-xs text-gray-400">数量</div>
             <div className="relative">
                <select className="w-full bg-[#2a2a2a] border border-gray-700 rounded p-1.5 text-xs text-white focus:outline-none appearance-none">
                  <option>1张</option>
                  <option>2张</option>
                  <option>4张</option>
                </select>
                <ChevronRightIcon className="w-3 h-3 absolute right-2 top-2 text-gray-500 transform rotate-90 pointer-events-none"/>
             </div>
           </div>
           <div className="flex-1 space-y-1">
             <div className="text-xs text-gray-400">分辨率</div>
             <div className="relative">
                <select className="w-full bg-[#2a2a2a] border border-gray-700 rounded p-1.5 text-xs text-white focus:outline-none appearance-none">
                  <option>4K</option>
                  <option>2K</option>
                  <option>1080P</option>
                </select>
                <ChevronRightIcon className="w-3 h-3 absolute right-2 top-2 text-gray-500 transform rotate-90 pointer-events-none"/>
             </div>
           </div>
        </div>

        {/* Reference Image */}
        <div className="space-y-2">
           <div className="text-xs text-gray-400">参考图 (0/6)</div>
           <div
             className="h-24 border border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:border-gray-400 cursor-pointer bg-[#0f0f0f] transition-colors relative overflow-hidden group"
             onClick={() => fileInputRef.current?.click()}
             onDragOver={(e) => e.preventDefault()}
             onDrop={handleDrop}
           >
              {referenceImage ? (
                <>
                  <img src={referenceImage} alt="Reference" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                     <span className="text-xs text-white">点击更换</span>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setReferenceImage(null); }}
                    className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1 hover:bg-red-500 text-white"
                  >
                    <XMarkIcon className="w-3 h-3"/>
                  </button>
                </>
              ) : (
                <>
                  <span className="text-xl font-light">+</span>
                  <span className="text-xs mt-1">点击或拖拽文件到此处</span>
                </>
              )}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
           </div>
        </div>

        {/* Style Model */}
        <div className="space-y-2">
           <div className="text-xs text-gray-400">风格模型</div>
           <div
             className="h-16 border border-gray-700 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:border-gray-400 cursor-pointer bg-[#2a2a2a] transition-colors"
             onClick={() => alert('模型选择即将上线')}
           >
              <span className="text-xl font-light">+</span>
              <span className="text-[10px] mt-1 text-gray-600">暂未选择自定义模型</span>
           </div>
        </div>
      </div>

      {/* Generate Button Footer */}
      <div className="p-4 border-t border-gray-800 relative">
         <div className="flex justify-end items-center gap-4">
             <div className="text-xs text-gray-500 flex items-center gap-1">
               <BoltIcon className="w-3 h-3"/> <span>6/次</span>
             </div>
            <button
              onClick={onGenerate}
              disabled={generating}
              className="bg-gradient-to-br from-yellow-300 to-yellow-500 text-black font-bold rounded-full w-10 h-10 flex items-center justify-center shadow-[0_0_15px_rgba(234,179,8,0.3)] hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
               {generating ? (
                 <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
               ) : (
                 <PaperAirplaneIcon className="w-5 h-5 transform -rotate-45 translate-x-0.5 -translate-y-0.5"/>
               )}
            </button>
         </div>
      </div>
    </div>
  );
}

// Helper to visualize aspect ratio heights relative to a fixed width
function calculateHeight(ratio: string): string {
  const [w, h] = ratio.split(':').map(Number);
  const width = 12;
  return `${(width * h / w).toFixed(1)}px`;
}
