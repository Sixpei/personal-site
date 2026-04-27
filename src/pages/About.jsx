import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { buildVideoSources } from '../videoSources';

export default function About() {
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [isHoveringClickable, setIsHoveringClickable] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [scrollOpacity, setScrollOpacity] = useState(0);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);

    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      setIsHoveringClickable(!!(e.target && e.target.closest('a, button, .hover-target')));
    };

    const handleScroll = () => {
      // 当滑动超过 100px 时开始显现，在 500px 时完全显现
      const scrollY = window.scrollY;
      const opacity = Math.min(Math.max((scrollY - 100) / 400, 0), 1);
      setScrollOpacity(opacity);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={`relative w-full min-h-screen bg-black overflow-x-hidden ${isTouch ? 'cursor-auto' : 'cursor-none'} text-white font-mono selection:bg-white selection:text-black`}>
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

      {/* 视频背景组件静音播放 */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <video
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className="w-full h-full object-cover object-center"
        >
          {buildVideoSources('/reel.mp4').map((source) => (
            <source key={source.src} src={source.src} type={source.type} />
          ))}
        </video>
      </div>

      {/* 噪点叠加：全局固定 */}
      <div className="fixed inset-0 pixelation-overlay z-0 opacity-30 pointer-events-none"></div>

      {/* 隐藏层：固定在底部的 Motion Reel 标题和声音按钮，等待幕布拉开 */}
      <div 
        className="fixed bottom-10 md:bottom-16 left-8 md:left-12 z-20 pointer-events-auto transition-opacity duration-300"
        style={{ opacity: scrollOpacity }}
      >
        <h1 className="hover-target relative flex items-start text-2xl sm:text-3xl md:text-5xl lg:text-[5rem] font-outfit font-bold cursor-auto md:cursor-none uppercase group leading-none text-white opacity-90 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
          <span className="tracking-tighter group-hover:tracking-wide transition-all duration-700 ease-out">
            Motion Reel
          </span>
          <span className="text-[10px] sm:text-xs md:text-sm lg:text-xl font-mono font-normal opacity-50 ml-2 lg:ml-4 mt-0.5 md:mt-1 lg:mt-3 tracking-normal">
            2022
          </span>
        </h1>
      </div>

      <button 
        onClick={() => setIsMuted(!isMuted)}
        className="fixed bottom-10 md:bottom-16 right-8 md:right-12 z-20 text-[10px] md:text-xs tracking-[0.2em] font-mono uppercase opacity-50 hover:opacity-100 transition-opacity cursor-auto md:cursor-none pointer-events-auto text-white transition-opacity duration-300"
        style={{ opacity: scrollOpacity }}
      >
        [{isMuted ? 'SOUND OFF' : 'SOUND ON'}]
      </button>

      {/* 导航返回按钮：全局固定悬浮 */}
      <Link 
        to="/"
        className="fixed top-8 md:top-12 left-8 md:left-12 z-50 text-xs tracking-[0.2em] uppercase opacity-50 hover:opacity-100 transition-opacity cursor-auto md:cursor-none"
      >
        ← BACK
      </Link>

      {/* 社交媒体入口：右上角极简图标设计 (移动端适当调整间距) */}
      <div className="fixed top-8 md:top-12 right-8 md:right-12 z-50 flex items-center gap-4 sm:gap-6 md:gap-8">
        <a 
          href="https://www.instagram.com/six.pei/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="opacity-40 hover:opacity-100 transition-opacity cursor-auto md:cursor-none scale-90 md:scale-100"
          title="Instagram"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
        </a>
        <a 
          href="https://www.youtube.com/@Sixpei" 
          target="_blank" 
          rel="noopener noreferrer"
          className="opacity-40 hover:opacity-100 transition-opacity cursor-auto md:cursor-none scale-90 md:scale-100"
          title="YouTube"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.11 1 12 1 12s0 3.89.46 5.58a2.78 2.78 0 0 0 1.94 2c1.72.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.89 23 12 23 12s0-3.89-.46-5.58z"></path><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"></polygon></svg>
        </a>
        <a 
          href="https://www.linkedin.com/in/pei-l/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="opacity-40 hover:opacity-100 transition-opacity cursor-auto md:cursor-none scale-90 md:scale-100"
          title="LinkedIn"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
        </a>
        <a 
          href="https://www.imdb.com/name/nm3753066/?ref_=pro_nm_visitcons" 
          target="_blank" 
          rel="noopener noreferrer"
          className="opacity-40 hover:opacity-100 transition-opacity cursor-auto md:cursor-none scale-90 md:scale-100"
          title="IMDB"
        >
          <svg width="34" height="18" viewBox="0 0 34 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0.75" y="0.75" width="32.5" height="16.5" rx="2.5" stroke="currentColor" strokeWidth="1.5"/>
            <text x="50%" y="55%" textAnchor="middle" dominantBaseline="middle" fill="currentColor" fontSize="8" fontFamily="Arial, sans-serif" fontWeight="900" style={{ letterSpacing: '-0.02em' }}>IMDb</text>
          </svg>
        </a>
      </div>

      {/* 核心滚动容器 */}
      <div className="relative z-10 w-full">
        {/* 第一屏：About 区域（幕布层） */}
        <div className="relative w-full min-h-screen flex items-center justify-start pt-32 pb-32 px-8 md:pl-24 lg:pl-[12%]">
          
          {/* 羽化背景板：向上滚动时它会带着文字一起“揭开” */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-xl pointer-events-none z-0"
            style={{ 
              WebkitMaskImage: isTouch ? 'none' : 'linear-gradient(to bottom, black 0%, black calc(100% - 400px), transparent 100%)',
              maskImage: isTouch ? 'none' : 'linear-gradient(to bottom, black 0%, black calc(100% - 400px), transparent 100%)' 
            }}
          ></div>

          <div className="relative z-10 max-w-2xl lg:max-w-3xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-outfit font-bold mb-6 md:mb-12 opacity-90 uppercase tracking-tighter">
              About Me
            </h1>
            
            <div className="space-y-6 md:space-y-8 text-sm md:text-base lg:text-lg font-outfit font-light leading-relaxed tracking-wide opacity-80 text-justify hyphens-auto mt-4">
              <p>
                I consider myself a creative multi-tool with a deep passion for diverse media. From visual storytelling in photography and video to auditory experiences in music, drama, and live-streaming, I bring a keen artistic sense to every medium I touch.
              </p>
              <p>
                If my budget requires a one-man band, I can span across editing, coloring, lighting, and camera operation. I’m not the best in any single one of those fields, but I can keep the entire project rolling by myself. Sometimes you will see that the only name in the scrolling credits is mine—or sometimes I just leave it blank, because there was no one else involved. However, I am also very good at collaborating with people and organizing a team as a producer, because I love investing in my friends.
              </p>
              <p>
                I have worked with professional companies like Sony and Leica, and many of my clients have experience in film production, commercials, live-streaming and documentaries.
              </p>
              <p>
                People like to say I am good at motion pictures, but stills are my deep roots. In everything I do, my pursuit is to tell my audience a meaningful story and deliver a memorable message.
              </p>
              <p className="pt-6 font-medium text-white/90 italic tracking-wider">
                Lastly, I will no doubt do what my boss says, because I am worth the pay.
              </p>
            </div>
            
            <div className="mt-16 opacity-30 text-lg font-mono animate-pulse">
              ↓
            </div>
          </div>
        </div>

        {/* 占位空白屏：允许滑出 */}
        <div className="w-full h-screen pointer-events-none"></div>
      </div>
    </div>
  );
}
