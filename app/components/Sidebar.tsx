'use client';
import {
  LightBulbIcon,
  SparklesIcon,
  PhotoIcon,
  VideoCameraIcon,
  CubeIcon,
  UserIcon,
  CurrencyYenIcon,
  QuestionMarkCircleIcon,
  ShieldCheckIcon,
  BoltIcon
} from '@heroicons/react/24/outline';

export default function Sidebar() {
  return (
    <div className="w-16 bg-black border-r border-gray-900 flex flex-col items-center py-4 justify-between h-screen text-gray-400">
      <div className="flex flex-col items-center space-y-6">
        <div className="text-yellow-400 font-bold text-xl mb-2">T</div>

        <div className="flex flex-col items-center space-y-1 hover:text-white cursor-pointer group">
          <LightBulbIcon className="h-6 w-6" />
          <span className="text-[10px]">灵感</span>
        </div>

        <div className="flex flex-col items-center space-y-1 hover:text-white cursor-pointer group">
          <SparklesIcon className="h-6 w-6" />
          <span className="text-[10px]">反推</span>
        </div>

        <div className="flex flex-col items-center space-y-1 text-yellow-400 cursor-pointer group">
          <PhotoIcon className="h-6 w-6" />
          <span className="text-[10px]">绘图</span>
        </div>

        <div className="flex flex-col items-center space-y-1 hover:text-white cursor-pointer group">
          <VideoCameraIcon className="h-6 w-6" />
          <span className="text-[10px]">视频</span>
        </div>

        <div className="flex flex-col items-center space-y-1 hover:text-white cursor-pointer group">
          <CubeIcon className="h-6 w-6" />
          <span className="text-[10px]">资产</span>
        </div>
      </div>

      <div className="flex flex-col items-center space-y-6">
        <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-white text-xs">
          1
        </div>

        <div className="bg-gray-800 text-gray-400 text-[10px] px-1 py-0.5 rounded text-center leading-tight">
          14<br/>基础会员
        </div>

        <div className="flex flex-col items-center space-y-1 hover:text-white cursor-pointer">
          <BoltIcon className="h-5 w-5" />
          <span className="text-[10px]">充值</span>
        </div>

         <div className="flex flex-col items-center space-y-1 hover:text-white cursor-pointer">
          <CurrencyYenIcon className="h-5 w-5" />
          <span className="text-[10px]">返现</span>
        </div>

        <div className="flex flex-col items-center space-y-1 hover:text-white cursor-pointer">
           <QuestionMarkCircleIcon className="h-5 w-5" />
        </div>

        <div className="flex flex-col items-center space-y-1 hover:text-white cursor-pointer">
           <span className="text-[10px]">ICP</span>
        </div>
      </div>
    </div>
  );
}
