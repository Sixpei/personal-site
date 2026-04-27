import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const STILLS_DATA = [
  { id: 1, date: '2024.12', location: 'BEIJING, CHINA', file: 'S-1005381.webp' },
  { id: 2, date: '2024.11', location: 'SHANGHAI, CHINA', file: 'S-1005400.webp' },
  { id: 3, date: '2024.10', location: 'TOKYO, JAPAN', file: 'S-1005452.webp' },
  { id: 4, date: '2024.09', location: 'HONG KONG, CHINA', file: 'S-1005516.webp' },
  { id: 5, date: '2024.08', location: 'LONDON, UK', file: 'S-1005564.webp' },
  { id: 6, date: '2024.07', location: 'PARIS, FRANCE', file: 'S-1005574.webp' },
  { id: 7, date: '2024.06', location: 'NEW YORK, USA', file: 'S-1005644.webp' },
  { id: 8, date: '2024.05', location: 'LOS ANGELES, USA', file: 'S-1005646.webp' },
  { id: 9, date: '2024.04', location: 'REYKJAVIK, ICELAND', file: 'S-1005666.webp' },
  { id: 10, date: '2024.03', location: 'ZURICH, SWITZERLAND', file: 'S-1005689.webp' },
];

export default function Stills() {
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [isHoveringClickable, setIsHoveringClickable] = useState(false);
  const [activeStill, setActiveStill] = useState(STILLS_DATA[0]);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
    
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      setIsHoveringClickable(!!(e.target && e.target.closest('a, button, .hover-target')));
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className={`relative w-full h-screen bg-black overflow-hidden ${isTouch ? 'cursor-auto' : 'cursor-none'} text-white font-mono selection:bg-white selection:text-black`}>
      {/* 自定义鼠标 (仅在非触摸设备显示) */}
      {!isTouch && (
        <div 
          className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
          style={{
            transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0) translate(-50%, -50%)`,
            transition: 'transform 0.1s cubic-bezier(0.2, 0.8, 0.2, 1), filter 0.25s ease-out',
            filter: isHoveringClickable ? 'blur(5px)' : 'blur(0px)'
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <circle cx="12" cy="12" r="7.5" />
          </svg>
        </div>
      )}

      {/* 背景管理器：照片无缝切换 */}
      <div className="absolute inset-0 z-0">
        {STILLS_DATA.map((still) => (
          <div 
            key={still.id}
            className={`absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-1000 ease-in-out ${
              activeStill.id === still.id ? 'opacity-70 scale-105' : 'opacity-0 scale-100'
            }`}
            style={{ backgroundImage: `url('/stills/${still.file}')` }}
          />
        ))}
      </div>

      {/* 全局噪点叠加 */}
      <div className="absolute inset-0 pixelation-overlay z-10 opacity-25 pointer-events-none"></div>

      {/* 导航返回按钮 */}
      <Link 
        to="/"
        className="absolute top-8 md:top-12 left-8 md:left-12 z-50 text-xs tracking-[0.2em] uppercase opacity-50 hover:opacity-100 transition-opacity cursor-auto md:cursor-none"
      >
        ← BACK
      </Link>

      {/* 左侧垂直时间轴：极简横向刻度 (移动端适当增大触摸区域) */}
      <div className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 z-50 flex flex-col items-start h-[35vh] md:h-[35vh] justify-between">
        {STILLS_DATA.map((still) => (
          <div 
            key={still.id}
            className="group relative flex items-center h-full py-2 pr-6 md:pr-12"
            onMouseEnter={() => setActiveStill(still)}
            onClick={() => setActiveStill(still)}
          >
            {/* 横向刻度线 */}
            <div 
              className={`hover-target h-[1px] transition-all duration-700 ease-out bg-white ${
                activeStill.id === still.id ? 'w-8 md:w-12 opacity-100' : 'w-3 md:w-4 opacity-30'
              } group-hover:w-16 group-hover:opacity-100`}
            ></div>
          </div>
        ))}
      </div>

      {/* 右下角页码状态指示 */}
      <div className="absolute bottom-10 md:bottom-16 right-8 md:right-12 z-50 text-right opacity-40">
        <div className="text-xl md:text-2xl font-outfit font-light tracking-tighter">
          {String(activeStill.id).padStart(2, '0')} <span className="mx-2 opacity-20">/</span> {STILLS_DATA.length}
        </div>
      </div>
    </div>
  );
}
