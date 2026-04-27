import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { buildVideoSources } from '../videoSources';

// 官方排版标准：所有新增作品请在此数组中添加，将自动继承极致紧凑排版与背景感应
const PROJECTS = [
  {
    id: 'leica',
    name: 'Leica Q3 monochrom',
    year: '2026',
    url: 'http://xhslink.com/o/O4RHLU6iNI',
    bg: '/leica-q3.mp4',
    isVideo: true
  },
  {
    id: 'bear',
    name: 'Bear insurance',
    year: '2024',
    url: 'https://youtu.be/Uo2EL_HcYWY?si=gmtwsX60XG0R8Zr7',
    bg: '/bi-trailer6.mp4',
    isVideo: true
  },
  {
    id: 'stool',
    name: 'That is my stool',
    year: '2022',
    url: 'https://youtu.be/FLvy8ldA6Jc?si=_V9f-eCu3uqHGwI4',
    bg: '/bcweb1.mp4',
    isVideo: true
  },
  {
    id: 'marianas',
    name: 'Marianas',
    year: '2022',
    url: 'https://youtu.be/epCsV6LqZyc?si=RXnlx4ESF7c3fCes',
    bg: '/marianas2.jpg',
    isVideo: false
  },
  {
    id: 'alpha1',
    name: 'Sony Alpha 1',
    year: '2021',
    url: 'https://b23.tv/OKNok1a',
    bg: '/alpha1.mp4',
    isVideo: true
  },
];

export default function MotionReel() {
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [isHoveringClickable, setIsHoveringClickable] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [hoveredProject, setHoveredProject] = useState(null);
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
    <div className={`relative w-full h-screen bg-black overflow-hidden ${isTouch ? 'cursor-auto' : 'cursor-none'} text-white font-mono`}>
      {/* 极简自定义鼠标 (仅在非触摸设备显示) */}
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

      {/* 背景管理器：视频默认，悬浮项目时切换预览图/预览视频 */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700 scale-110 ${hoveredProject ? 'opacity-0' : 'opacity-80'}`}
        >
          {buildVideoSources('/reel.mp4').map((source) => (
            <source key={source.src} src={source.src} type={source.type} />
          ))}
        </video>
        {PROJECTS.map(project => (
          project.isVideo ? (
            <video
              key={project.id}
              autoPlay
              loop
              muted
              playsInline
              className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ${hoveredProject === project.id ? 'opacity-80 scale-[1.15]' : 'opacity-0 scale-100'}`}
            >
              {buildVideoSources(project.bg).map((source) => (
                <source key={source.src} src={source.src} type={source.type} />
              ))}
            </video>
          ) : (
            <div 
              key={project.id}
              className={`absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-700 ${hoveredProject === project.id ? 'opacity-80 scale-[1.15]' : 'opacity-0 scale-100'}`}
              style={{ backgroundImage: `url('${project.bg}')` }}
            />
          )
        ))}
      </div>

      {/* 噪点叠加：全局胶片质感 */}
      <div className="absolute inset-0 pixelation-overlay z-10 opacity-20 pointer-events-none"></div>

      {/* 导航返回按钮 */}
      <Link 
        to="/"
        className="absolute top-8 md:top-12 left-8 md:left-12 z-50 text-xs tracking-[0.2em] uppercase opacity-50 hover:opacity-100 transition-opacity cursor-auto md:cursor-none"
      >
        ← BACK
      </Link>

      {/* 声音控制按钮 */}
      <button 
        onClick={() => setIsMuted(!isMuted)}
        className="absolute bottom-10 md:bottom-16 right-8 md:right-12 z-50 text-[10px] md:text-xs tracking-[0.2em] font-mono uppercase opacity-50 hover:opacity-100 transition-opacity cursor-auto md:cursor-none"
      >
        [{isMuted ? 'SOUND OFF' : 'SOUND ON'}]
      </button>

      {/* 浮动列表与标题排版 */}
      <div className="absolute bottom-10 md:bottom-16 left-8 md:left-12 z-50 text-left drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] pr-8">
        
        {/* 作品动态列表 */}
        {PROJECTS.map(project => (
          <div key={project.id} className="flex flex-col mb-[-6px] md:mb-[-11px]">
            <a 
              href={project.url}
              target="_blank" 
              rel="noopener noreferrer"
              onMouseEnter={() => setHoveredProject(project.id)}
              onMouseLeave={() => setHoveredProject(null)}
              className="hover-target relative flex items-start font-outfit font-bold cursor-auto md:cursor-none uppercase group leading-none mb-0 opacity-50 hover:opacity-100 transition-opacity"
            >
              <span className="text-2xl sm:text-3xl md:text-5xl lg:text-[5rem] tracking-tighter group-hover:tracking-wide transition-all duration-700 ease-out break-words max-w-[85vw] md:max-w-none">
                {project.name}
              </span>
              <span className="text-[10px] sm:text-xs md:text-sm lg:text-xl font-mono font-normal opacity-40 ml-2 lg:ml-4 mt-0.5 md:mt-1 lg:mt-3 tracking-normal">
                {project.year}
              </span>
            </a>
          </div>
        ))}

        {/* 主标题：Motion Reel (底部的灵魂基准线) */}
        <h1 className="hover-target relative flex items-start text-2xl sm:text-3xl md:text-5xl lg:text-[5rem] font-outfit font-bold cursor-auto md:cursor-none uppercase group leading-none transition-opacity duration-700 mt-2 md:mt-0">
          <span className="tracking-tighter group-hover:tracking-wide transition-all duration-700 ease-out opacity-90">
            Motion Reel
          </span>
          <span className="text-[10px] sm:text-xs md:text-sm lg:text-xl font-mono font-normal opacity-40 ml-2 lg:ml-4 mt-0.5 md:mt-1 lg:mt-3 tracking-normal">
            2022
          </span>
        </h1>
      </div>
    </div>
  );
}
