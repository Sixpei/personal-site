import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const BIRTH_DATE = new Date('1994-06-23T18:00:00+08:00');
const BIRTH_TZ_OFFSET = 8;

const ORBS_CONFIG = [
  // 远景巨型虚化块
  { size: 'w-[150vh] h-[150vh]', startPos: 'top-[-30%] left-[-20%]', blur: 'blur-[120px]', baseOpacity: 0.2, anim: 'float1 45s infinite ease-in-out' },
  { size: 'w-[120vh] h-[120vh]', startPos: 'bottom-[-20%] right-[-10%]', blur: 'blur-[100px]', baseOpacity: 0.25, anim: 'float3 38s infinite ease-in-out', delay: '-10s' },
  
  // 中层虚化
  { size: 'w-[50vh] h-[50vh]', startPos: 'top-[15%] left-[20%]', blur: 'blur-[40px]', baseOpacity: 0.45, anim: 'float2 25s infinite ease-in-out', delay: '-5s' },
  { size: 'w-[65vh] h-[65vh]', startPos: 'bottom-[-5%] left-[30%]', blur: 'blur-[55px]', baseOpacity: 0.35, anim: 'float4 32s infinite ease-in-out', delay: '-15s' },
  { size: 'w-[40vh] h-[40vh]', startPos: 'top-[35%] right-[10%]', blur: 'blur-[30px]', baseOpacity: 0.5, anim: 'float1 20s infinite ease-in-out', delay: '-2s', reverse: true },

  // 近景硬光斑
  { size: 'w-[25vh] h-[25vh]', startPos: 'top-[25%] left-[25%]', blur: 'blur-[8px]', baseOpacity: 0.85, anim: 'float2 22s infinite ease-in-out', delay: '-8s' },
  { size: 'w-[35vh] h-[35vh]', startPos: 'bottom-[20%] left-[8%]', blur: 'blur-[12px]', baseOpacity: 0.75, anim: 'float4 28s infinite ease-in-out', delay: '-12s' },
  { size: 'w-[18vh] h-[18vh]', startPos: 'top-[10%] right-[30%]', blur: 'blur-[6px]', baseOpacity: 0.95, anim: 'float3 18s infinite ease-in-out', delay: '-5s' },
  { size: 'w-[30vh] h-[30vh]', startPos: 'bottom-[15%] right-[12%]', blur: 'blur-[10px]', baseOpacity: 0.9, anim: 'float1 24s infinite ease-in-out', delay: '-3s', reverse: true },
];

export default function Home() {
  const [localTime, setLocalTime] = useState('');
  const [daysLived, setDaysLived] = useState(0);
  const [manualMode, setManualMode] = useState(null); 
  const [isDay, setIsDay] = useState(true);
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [isHoveringClickable, setIsHoveringClickable] = useState(false);

  // 处理全局鼠标轨迹及交互侦测
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      setIsHoveringClickable(!!(e.target && e.target.closest('a, button')));
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 处理时间逻辑
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setLocalTime(`${hours}:${minutes}:${seconds}`);

      const diffInDays = (now.getTime() - BIRTH_DATE.getTime()) / (1000 * 60 * 60 * 24);
      setDaysLived(diffInDays); 

      if (manualMode === null) {
        setIsDay(now.getHours() >= 6 && now.getHours() < 18);
      } else {
        setIsDay(manualMode === 'day');
      }
    }, 50);
    return () => clearInterval(timer);
  }, [manualMode]);

  const orbColorClass = isDay ? 'orb-day' : 'orb-night';

  return (
    // 使用 cursor-none 隐藏系统自带的鼠标指针
    <div className={`relative flex flex-col items-center justify-center min-h-screen overflow-hidden cursor-none transition-colors duration-[2000ms] ease-in-out ${
      isDay ? 'theme-day' : 'theme-night'
    }`}>

      {/* 自定义鼠标：遇交互元素自动羽化的实心圆 */}
      <div 
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0) translate(-50%, -50%)`, // 绝对居中于鼠标焦点
          transition: 'transform 0.1s cubic-bezier(0.2, 0.8, 0.2, 1), filter 0.25s ease-out', // 矩阵与滤镜分别具备不同阻尼阻尼感
          filter: isHoveringClickable ? 'blur(5px)' : 'blur(0px)'
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
          <circle cx="12" cy="12" r="7.5" />
        </svg>
      </div>
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {ORBS_CONFIG.map((orb, index) => {
          return (
            <div 
              key={index}
              className={`orb absolute base-orb shape-circle ${orb.size} ${orb.startPos} ${orb.blur} ${orbColorClass} transition-all duration-1000`} 
              style={{ 
                 opacity: orb.baseOpacity,
                 animation: orb.anim, 
                 animationDelay: orb.delay || '0s',
                 animationDirection: orb.reverse ? 'reverse' : 'normal'
              }}
            ></div>
          );
        })}
      </div>

      <div className={`absolute inset-0 pointer-events-none z-0 transition-all duration-[2000ms] ease-in-out ${
        isDay ? 'bg-white/40 backdrop-blur-[24px]' : 'bg-black/40 backdrop-blur-[24px]'
      }`}></div>

      <div className="absolute inset-0 pixelation-overlay z-0"></div>

      <button 
        onClick={() => setManualMode(isDay ? 'night' : 'day')}
        // 覆盖默认的光标为 cursor-none 以防万一
        className="absolute top-6 right-6 md:top-8 md:right-8 z-50 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-sm md:text-lg border border-current rounded-full opacity-40 hover:opacity-100 transition-opacity backdrop-blur-sm cursor-none"
      >
        {isDay ? (
          <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        ) : (
          <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
        )}
      </button>

      <div className="z-10 flex flex-col items-center select-none drop-shadow-md w-full px-4 mt-[-10vh] md:mt-[-5vh]">
        <h1 className="text-[5.5rem] sm:text-[8rem] md:text-[10rem] lg:text-[12rem] font-handwriting leading-none mb-6 opacity-90 transition-colors duration-2000 text-center flex justify-center">
          {localTime.split('').map((char, index) => (
            <span key={index} className={char === ':' ? 'w-[0.4em] text-center inline-block' : 'w-[0.75em] text-center inline-block'}>
              {char}
            </span>
          ))}
        </h1>
        
        <div className="flex justify-center text-[9px] md:text-xs lg:text-sm tracking-[0.2em] md:tracking-[0.25em] font-mono opacity-60 text-center transition-colors duration-2000 uppercase">
          <p>LIVED AND STILL GOING ON: {daysLived.toFixed(10)} DAYS</p>
        </div>
      </div>

      <nav className="absolute bottom-16 md:bottom-24 left-0 w-full px-4 z-50">
        <ul className="flex flex-row flex-wrap justify-center items-center gap-6 md:gap-16 text-[10px] md:text-xs tracking-[0.2em] font-mono opacity-80 uppercase transition-colors duration-2000">
          <li>
            <Link to="/about" className="relative group hover:opacity-100 transition-opacity pb-1 inline-block cursor-none flex items-center justify-center">
              About Me
            </Link>
          </li>
          <li>
            <Link to="/motion-reel" className="relative group hover:opacity-100 transition-opacity pb-1 inline-block cursor-none flex items-center justify-center">
              My Motion Reel
            </Link>
          </li>
          <li>
            <Link to="/stills" className="relative group hover:opacity-100 transition-opacity pb-1 inline-block cursor-none">
              My Stills
            </Link>
          </li>
        </ul>
      </nav>

    </div>
  );
}


