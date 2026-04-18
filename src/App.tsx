import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
    Palette, 
    X, 
    ArrowRight, 
    MapPin, 
    Mail, 
    Github, 
    Briefcase, 
    ExternalLink, 
    Terminal, 
    Code, 
    Layers,
    Cpu,
    Send,
    MessageSquare,
    Copy,
    Check,
    QrCode,
    Music,
    Camera
} from 'lucide-react';

// 导入本地图片资源
import img2 from './assets/2.jpg';
import img3 from './assets/3.jpg';
import img3c from './assets/3c.jpg';
import img4 from './assets/4.jpg';
import img6 from './assets/6.jpg';
import img7 from './assets/7.jpg';
import imgIm from './assets/im.jpg';
import imgP1 from './assets/p1.jpg';
import imgP2 from './assets/p2.jpg';
import imgP3 from './assets/p3.jpg';
import imgP4 from './assets/p4.jpg';
import imgP5 from './assets/p5.png.jpg';
import imgP6 from './assets/p6.jpg';
import imgQrCode from './assets/f6f5a55280c7c8d14d5c353070218e9b.jpg';

// --- 配置与数据 ---
const THEME = {
    bg: '#050505',
    magenta: '#DA205A',
    cyan: '#00F0FF',
    purple: '#7B2CBF'
};

const SKILLS = [
    { name: 'Cinema 4D / Keyshot', icon: <Layers size={14} /> },
    { name: 'Octane Render', icon: <Cpu size={14} /> },
    { name: 'Photoshop / Illustrator', icon: <Palette size={14} /> },
    { name: '商业级产品渲染出图', icon: <Code size={14} /> },
    { name: '电商视觉营销策略', icon: <Terminal size={14} /> }
];

const EXPERIENCE = [
    {
        year: '2024.1 - 2026.3',
        role: '渲染设计师',
        company: '华信众邦科技有限公司',
        desc: '• 视觉定调与输出: 主导公司亚马逊的核心产品视觉定调, 独立负责3D建模、场景搭建与4K超清渲染输出。\n• 转化率提升: 深度配合运营团队, 优化产品Listing主图、A+页面及品牌旗舰店视觉, 通过高质量的商业渲染图有效提升页面点击率(CTR)与转化率。\n• 后期精修: 负责渲染后的图像精修与合成, 确保材质质感、光影层次与产品细节的绝对真实感, 满足海外消费者的审美需求。'
    },
    {
        year: '2022.11 - 2023.12',
        role: '渲染设计师',
        company: '深圳森普斯有限公司',
        desc: '• 视觉定调与输出: 负责公司亚马逊北美/欧洲站点的核心产品视觉定调, 独立负责3D建模、节假日网页设计场景搭建与4K超清渲染输出。\n• 转化率提升: 深度配合运营团队, 优化产品Listing主图、A+页面及品牌旗舰店视觉, 通过高质量的商业渲染图有效提升页面点击率。\n• 后期精修: 负责渲染后的图像精修与合成, 确保材质质感、光影层次与产品细节的绝对真实感。'
    },
    {
        year: '2021.5 - 2023.8',
        role: '美工设计',
        company: '广州帝特电子科技有限公司',
        desc: '• 平面与网页设计: 详情页排版设计、主图推广图测图制作, 节假日活动页面设计、店铺海报轮播图设计。\n• 建模与渲染: 完成基础产品建模、UV拆分、材质贴图制作及日常详情页渲染。\n• 需求响应与调色: 快速响应改图与渲染需求, 保证高频电商上新节奏; 负责渲染结果的后期基础调色与瑕疵修补, 确保符合商业交付标准。'
    }
];

const PROJECTS = [
    {
        id: 1,
        title: '3C产品',
        category: '亚马逊主副图A+',
        color: THEME.magenta,
        desc: '车载支架、多功能充电站、qi2无线充电台、充气泵、折叠支架、磁吸支架',
        image: imgP1,
        longImage: img3c,
        tags: ['Product', '3D Render', 'C4D']
    },
    {
        id: 2,
        title: '家电产品',
        category: '亚马逊主副图A+',
        color: THEME.cyan,
        desc: '扫地机器人、智能家电场景建模渲染',
        image: imgP2,
        longImage: img2,
        tags: ['robot', 'Octane']
    },
    {
        id: 3,
        title: '亚马逊邮件banner',
        category: '节假日社媒海报',
        color: THEME.purple,
        desc: '移动电源、扫地机器人、洗地机、吸尘器、门锁',
        image: imgP3,
        longImage: img3,
        tags: ['Marketing', 'Banner']
    },
    {
        id: 4,
        title: '国内主图渲染',
        category: '主图 白底图',
        color: '#F5A623',
        desc: '散热器、高清线缆、网卡、无线投屏器、小风扇，充电器',
        image: imgP5,
        longImage: img4,
        tags: ['Main Image', 'E-commerce']
    },
    {
        id: 5,
        title: '国内详情页渲染',
        category: '详情页设计',
        color: '#7ED321',
        desc: '数据线、网线、打印线三维场景化建模',
        image: imgP4,
        longImage: img7,
        tags: ['Details Page', 'UI Design']
    },
    {
        id: 6,
        title: '海报网页设计',
        category: '视觉设计',
        color: '#4A90E2',
        desc: '海报设计、网页设计、海报轮播图视觉提升',
        image: imgP6,
        longImage: img6,
        tags: ['Banner', 'Graphic Design']
    }
];

// --- 全局特效组件 ---

const NeonCursor = () => {
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [isTouch, setIsTouch] = useState(false);
    const dotRef = useRef(null);
    const trailRef = useRef(null);

    useEffect(() => {
        if (window.matchMedia("(pointer: coarse)").matches) {
            setIsTouch(true);
            return;
        }

        let currentX = window.innerWidth / 2;
        let currentY = window.innerHeight / 2;
        let trailX = currentX;
        let trailY = currentY;

        const onMouseMove = (e) => {
            currentX = e.clientX;
            currentY = e.clientY;
            if (dotRef.current) {
                dotRef.current.style.transform = `translate(${currentX}px, ${currentY}px)`;
            }
        };

        const render = () => {
            trailX += (currentX - trailX) * 0.15;
            trailY += (currentY - trailY) * 0.15;
            if (trailRef.current) {
                trailRef.current.style.transform = `translate(${trailX}px, ${trailY}px)`;
            }
            requestAnimationFrame(render);
        };

        window.addEventListener('mousemove', onMouseMove);
        const raf = requestAnimationFrame(render);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            cancelAnimationFrame(raf);
        };
    }, []);

    if (isTouch) return null;

    return (
        <div className="pointer-events-none fixed inset-0 z-[100] mix-blend-screen overflow-hidden">
            <div 
                ref={trailRef}
                className="absolute left-[-20px] top-[-20px] w-10 h-10 rounded-full bg-[#DA205A] blur-[20px] opacity-60 transition-opacity"
                style={{ willChange: 'transform' }}
            />
            <div 
                ref={dotRef}
                className="absolute left-[-3px] top-[-3px] w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_#DA205A]"
                style={{ willChange: 'transform' }}
            />
        </div>
    );
};

const MagneticButton = ({ children, className = '', onClick }) => {
    const btnRef = useRef(null);

    const handleMouseMove = (e) => {
        const btn = btnRef.current;
        if (!btn) return;
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    };

    const handleMouseLeave = () => {
        const btn = btnRef.current;
        if (!btn) return;
        btn.style.transform = `translate(0px, 0px)`;
    };

    return (
        <button
            ref={btnRef}
            onClick={onClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`transition-transform duration-200 ease-out will-change-transform ${className}`}
        >
            {children}
        </button>
    );
};

const TorusCanvas = ({ scrollY }) => {
    const canvasRef = useRef(null);
    const mouseRef = useRef({ x: -1000, y: -1000, isDown: false });

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { alpha: false });
        let animationFrameId;
        
        const config = {
            particleCount: window.innerWidth > 768 ? 6000 : 2500,
            R: window.innerWidth > 768 ? 450 : 220,
            r: window.innerWidth > 768 ? 140 : 80,
            fov: 300,
            colorH: 341,
            colorS: 74,
            colorL: 49
        };

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        const particles = [];

        for (let i = 0; i < config.particleCount; i++) {
            const u = Math.random() * Math.PI * 2;
            const v = Math.random() * Math.PI * 2;
            const baseX = (config.R + config.r * Math.cos(v)) * Math.cos(u);
            const baseY = (config.R + config.r * Math.cos(v)) * Math.sin(u);
            const baseZ = config.r * Math.sin(v);
            particles.push({ u, v, baseX, baseY, baseZ, ox: 0, oy: 0, oz: 0, vx: 0, vy: 0, vz: 0, size: Math.random() * 1.5 + 0.5 });
        }

        let time = 0;
        const render = () => {
            time += 0.003;
            ctx.fillStyle = 'rgba(5, 5, 5, 0.3)';
            ctx.fillRect(0, 0, width, height);
            const cx = width / 2, cy = height / 2;
            const rotX = time * 0.5, rotY = time * 0.8;
            const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
            const cosY = Math.cos(rotY), sinY = Math.sin(rotY);

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.vx += (0 - p.ox) * 0.02; p.vy += (0 - p.oy) * 0.02; p.vz += (0 - p.oz) * 0.02;
                p.vx *= 0.9; p.vy *= 0.9; p.vz *= 0.9;
                p.ox += p.vx; p.oy += p.vy; p.oz += p.vz;
                const x = p.baseX + p.ox, y = p.baseY + p.oy, z = p.baseZ + p.oz;
                const xy = cosX * y - sinX * z, xz = sinX * y + cosX * z;
                const yx = cosY * x + sinY * xz, yz = -sinY * x + cosY * xz;
                const scale = config.fov / (config.fov + yz + 600);
                const px = yx * scale + cx, py = xy * scale + cy;
                const dx = px - mouseRef.current.x, dy = py - mouseRef.current.y;
                const distSq = dx * dx + dy * dy;
                if (distSq < 15000) {
                    const force = (15000 - distSq) / 15000;
                    const dirX = dx / Math.sqrt(distSq || 1), dirY = dy / Math.sqrt(distSq || 1);
                    const sign = mouseRef.current.isDown ? -2 : 1; 
                    p.vx += dirX * force * 2 * sign; p.vy += dirY * force * 2 * sign; p.vz += force * 2 * sign; 
                }
                if (scale > 0) {
                    const depthAlpha = Math.max(0.1, Math.min(1, scale * 1.5 - 0.5));
                    ctx.fillStyle = `hsla(${config.colorH}, ${config.colorS}%, ${config.colorL}%, ${depthAlpha})`;
                    ctx.beginPath();
                    ctx.arc(px, py, p.size * scale, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            animationFrameId = requestAnimationFrame(render);
        };
        render();

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            config.R = window.innerWidth > 768 ? 450 : 220;
            config.r = window.innerWidth > 768 ? 140 : 80;
        };

        const handleMouseMove = (e) => {
            if(e.touches) { mouseRef.current.x = e.touches[0].clientX; mouseRef.current.y = e.touches[0].clientY; }
            else { mouseRef.current.x = e.clientX; mouseRef.current.y = e.clientY; }
        };

        const handleMouseLeave = () => { mouseRef.current.x = -1000; mouseRef.current.y = -1000; mouseRef.current.isDown = false; };
        const handleMouseDown = () => mouseRef.current.isDown = true;
        const handleMouseUp = () => mouseRef.current.isDown = false;

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('touchmove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);
        window.addEventListener('touchend', handleMouseLeave);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('touchstart', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchmove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
            window.removeEventListener('touchend', handleMouseLeave);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('touchstart', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    const opacity = Math.max(0, 1 - scrollY / 600);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full pointer-events-auto"
            style={{ opacity: opacity, transition: 'opacity 0.1s linear', zIndex: 0 }}
        />
    );
};

const Typewriter = ({ text, delay = 50 }) => {
    const [currentText, setCurrentText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setCurrentText(prevText => prevText + text[currentIndex]);
                setCurrentIndex(prevIndex => prevIndex + 1);
            }, delay);
            return () => clearTimeout(timeout);
        }
    }, [currentIndex, delay, text]);

    return (
        <span className="font-mono text-sm md:text-base tracking-widest text-white/70">
            {currentText}
            <span className="inline-block w-[8px] h-[1em] bg-[#DA205A] ml-1 animate-pulse align-middle" />
        </span>
    );
};

const TiltCard = ({ project, onClick }) => {
    const cardRef = useRef(null);

    const handleMouseMove = (e) => {
        const card = cardRef.current;
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left, y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
        const centerX = rect.width / 2, centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -10, rotateY = ((x - centerX) / centerX) * 10;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    };

    const handleMouseLeave = () => {
        const card = cardRef.current;
        if (!card) return;
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        card.style.setProperty('--mouse-x', `-1000px`); card.style.setProperty('--mouse-y', `-1000px`);
    };

    return (
        <div 
            ref={cardRef}
            onClick={() => onClick(project)}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="group relative rounded-2xl cursor-pointer transition-all duration-300 ease-out will-change-transform z-10"
            style={{ transformStyle: 'preserve-3d', '--hover-color': project.color, '--mouse-x': '-1000px', '--mouse-y': '-1000px' }}
        >
            <div className="absolute inset-[-1px] rounded-2xl z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                 style={{ background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), var(--hover-color), transparent 40%)` }}
            />
            <div className="relative h-full bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 overflow-hidden flex flex-col z-10">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"
                     style={{ background: `radial-gradient(800px circle at var(--mouse-x) var(--mouse-y), var(--hover-color), transparent 40%)`}}
                />
                <div className="w-full h-48 mb-6 overflow-hidden rounded-xl border border-white/5 relative z-20" style={{ transform: 'translateZ(30px)' }}>
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                    <img 
                        src={project.image} 
                        alt={project.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                        loading="lazy"
                    />
                </div>
                <div className="flex-grow flex flex-col justify-between" style={{ transform: 'translateZ(40px)' }}>
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-mono text-xs font-bold tracking-wider" style={{ color: project.color }}>{project.category}</span>
                            <ExternalLink size={16} className="text-white/30 group-hover:text-white transition-colors" />
                        </div>
                        <h3 className="text-2xl font-black tracking-tight mb-3 text-white group-hover:text-[var(--hover-color)] transition-colors">{project.title}</h3>
                        <p className="text-sm text-white/50 leading-relaxed mb-6 font-mono">{project.desc}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {project.tags.map(tag => (
                            <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 font-mono">{tag}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function PortfolioApp() {
    const [scrollY, setScrollY] = useState(0);
    const [selectedProject, setSelectedProject] = useState(null);
    // 使用导入的本地图片
    const [avatarUrl, setAvatarUrl] = useState(imgIm);

    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [showQrCode, setShowQrCode] = useState(false);
    const [copiedWechat, setCopiedWechat] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatInput, setChatInput] = useState('');
    const [chatMessages, setChatMessages] = useState([
        { sender: 'ai', text: "你好！我是朱丽微的 AI 助手。有什么我可以帮你的吗？ ✨" }
    ]);
    const chatEndRef = useRef(null);

    const handleSendChat = (e) => {
        e.preventDefault();
        if (!chatInput.trim()) return;
        setChatMessages(prev => [...prev, { sender: 'user', text: chatInput }]);
        setChatInput('');
        setTimeout(() => {
            setChatMessages(prev => [...prev, {
                sender: 'ai',
                text: "很高兴为您服务！朱丽微在电商渲染和 3C 产品视觉方面有深厚经验。您可以点击下方的“联系方式”直接获取她的微信二维码进行深度交流哦！"
            }]);
        }, 800);
    };

    useEffect(() => {
        if(chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages, isChatOpen]);

    const handleCopyWechat = () => {
        const textToCopy = 'abanaannananananana';
        
        // 由于安全策略限制 (iframe)，强制使用 document.execCommand
        try {
            const el = document.createElement('textarea');
            el.value = textToCopy;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
            
            setCopiedWechat(true);
            setTimeout(() => setCopiedWechat(false), 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = selectedProject ? 'hidden' : 'unset';
    }, [selectedProject]);

    const handleAvatarUpload = (e) => {
        const file = e.target.files[0];
        if (file) setAvatarUrl(URL.createObjectURL(file));
    };

    return (
        <div className="bg-[#050505] min-h-screen text-white font-sans selection:bg-[#DA205A] selection:text-white relative">
            <style>{`
                html { scroll-behavior: smooth; }
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=JetBrains+Mono:wght@400;700&display=swap');
                body { font-family: 'Inter', sans-serif; }
                .font-mono { font-family: 'JetBrains Mono', monospace; }
                ::-webkit-scrollbar { width: 8px; height: 8px; }
                ::-webkit-scrollbar-track { background: #050505; }
                ::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 4px; }
                ::-webkit-scrollbar-thumb:hover { background: #DA205A; }
                .glass-panel { background: rgba(255, 255, 255, 0.02); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.05); }
                .clip-text { background-clip: text; -webkit-background-clip: text; color: transparent; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
                .animate-marquee-scroll { display: inline-flex; white-space: nowrap; animation: marquee 20s linear infinite; }
            `}</style>

            <NeonCursor />

            <div className="fixed top-[-40vh] left-1/2 -translate-x-1/2 w-[120vw] h-[100vh] bg-[conic-gradient(from_90deg_at_50%_50%,rgba(218,32,90,0.15),#050505,rgba(218,32,90,0.15))] blur-[120px] opacity-60 pointer-events-none z-0" />
            <div className="fixed bottom-[-40vh] right-[-20vw] w-[80vw] h-[80vh] bg-[conic-gradient(from_270deg_at_50%_50%,rgba(0,240,255,0.1),#050505,rgba(0,240,255,0.1))] blur-[120px] opacity-40 pointer-events-none z-0" />

            <TorusCanvas scrollY={scrollY} />

            <div className="relative z-10">
                <nav className="fixed top-0 left-0 w-full px-4 md:px-8 py-4 flex items-center justify-between z-50 glass-panel border-b border-white/10 bg-[#050505]/60">
                    <div className="flex items-center gap-3">
                        <label className="cursor-pointer relative group">
                            <img src={avatarUrl} alt="Logo" className="w-10 h-10 rounded-full object-cover border border-white/20 group-hover:border-[#DA205A] transition-colors" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 rounded-full flex items-center justify-center transition-opacity">
                                <span className="text-[10px] font-bold">替换</span>
                            </div>
                            <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                        </label>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold tracking-wider text-white">朱丽微的设计空间</span>
                            <span className="text-[10px] text-white/50 font-mono tracking-widest uppercase">ZLW's Design Space</span>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center gap-8 font-mono text-xs tracking-widest text-white/70">
                        <a href="#about" className="hover:text-[#DA205A] hover:scale-110 transition-all">ABOUT</a>
                        <a href="#work" className="hover:text-[#DA205A] hover:scale-110 transition-all">WORK</a>
                        <a href="#contact" className="hover:text-[#DA205A] hover:scale-110 transition-all">CONTACT</a>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#00F0FF]/50 bg-[#00F0FF]/10 text-[#00F0FF] text-xs font-mono shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-pulse" /> AVAILABLE FOR HIRE
                    </div>
                </nav>

                <header className="relative w-full h-screen flex flex-col items-center justify-center pointer-events-none px-6 pt-16">
                    <div className="max-w-6xl w-full mx-auto text-center pointer-events-auto flex flex-col items-center">
                        <div className="mb-6 px-5 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-md font-mono text-xs tracking-widest text-white/80 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                            PORTFOLIO 2026
                        </div>
                        <h1 className="inline-flex flex-col text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tighter mb-6 mix-blend-difference">
                            <span className="flex justify-between w-full text-white">{'PORTFOLIO'.split('').map((char, index) => (<span key={index}>{char}</span>))}</span>
                            <span className="block clip-text bg-gradient-to-r from-white via-[#DA205A] to-[#00F0FF] whitespace-nowrap mt-[-0.1em]">FOR ZHU LI WEI</span>
                        </h1>
                        <div className="h-8 mt-2"><Typewriter text="> 3D Renderer & E-commerce Designer_" delay={80} /></div>
                        <div className="mt-16 flex flex-col md:flex-row items-center justify-center gap-6">
                            <MagneticButton onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth'})} className="px-8 py-4 bg-white text-black font-bold rounded-full flex items-center gap-2 hover:bg-[#DA205A] hover:text-white transition-colors duration-300">
                                START EXPLORING <ArrowRight size={18} />
                            </MagneticButton>
                        </div>
                    </div>
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 animate-bounce">
                        <span className="font-mono text-xs tracking-widest">SCROLL</span>
                        <div className="w-[1px] h-10 bg-gradient-to-b from-white to-transparent" />
                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-6 py-24 space-y-40">
                    <section id="about" className="grid grid-cols-1 lg:grid-cols-12 gap-16 relative">
                        <div className="lg:col-span-4 space-y-8 relative">
                            <div className="sticky top-24">
                                <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-2xl overflow-hidden group mb-8 glass-panel border-white/10 p-2">
                                    <div className="w-full h-full rounded-xl overflow-hidden relative bg-black">
                                        <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover transition-all duration-500 scale-100 group-hover:scale-105" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                            <span className="font-mono text-xs bg-[#DA205A] px-3 py-1 rounded-full">CLICK TO UPLOAD</span>
                                        </div>
                                        <input type="file" accept="image/*" onChange={handleAvatarUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                    </div>
                                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#DA205A] opacity-50 m-2" />
                                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#00F0FF] opacity-50 m-2" />
                                </div>
                                <h2 className="text-4xl font-black tracking-tight mb-2">About me</h2>
                                <p className="font-mono text-[#DA205A] mb-6 flex items-center gap-2 text-sm"><MapPin size={14} /> ShenZhen.CN</p>
                                <p className="text-white/60 leading-relaxed font-mono text-sm mb-8">
                                    拥有5年专注电商领域的商业级三维渲染经验，深谙亚马逊及国内主流电商平台的视觉营销逻辑。擅长从产品建模、场景搭建到最终的4K高清图像输出与精修。
                                </p>
                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold tracking-widest text-white/40 uppercase">Core Skills</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {SKILLS.map(skill => (
                                            <div key={skill.name} className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel text-xs font-mono text-white/80 hover:border-[#DA205A]/50 hover:text-[#DA205A] transition-colors cursor-default">
                                                <span className="text-[#DA205A]">{skill.icon}</span>{skill.name}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="mt-12 space-y-6">
                                    <h3 className="text-2xl font-bold text-white flex items-baseline gap-3">
                                        兴趣 <span className="text-base text-white/50 font-normal">Interest</span>
                                    </h3>
                                    <div className="flex items-center gap-8 text-white/60">
                                        <MagneticButton className="hover:text-white hover:scale-110 transition-all cursor-default">
                                            <Music size={32} strokeWidth={1.5} />
                                        </MagneticButton>
                                        <MagneticButton className="hover:text-white hover:scale-110 transition-all cursor-default">
                                            <Camera size={32} strokeWidth={1.5} />
                                        </MagneticButton>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="lg:col-span-8">
                            <h3 className="text-2xl font-bold mb-12 flex items-center gap-3"><Briefcase className="text-[#DA205A]" /> 工作经历</h3>
                            <div className="relative border-l border-white/10 ml-4 md:ml-6 space-y-12 pb-12">
                                {EXPERIENCE.map((exp, idx) => (
                                    <div key={idx} className="relative pl-8 md:pl-12 group">
                                        <div className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#050505] border-2 border-[#DA205A] group-hover:bg-[#DA205A] transition-all duration-300" />
                                        <div className="glass-panel p-6 md:p-8 rounded-2xl transform transition-transform duration-300 group-hover:-translate-y-2">
                                            <span className="font-mono text-xs text-[#DA205A] mb-2 block tracking-widest">{exp.year}</span>
                                            <h4 className="text-xl font-bold text-white mb-1">{exp.role}</h4>
                                            <span className="text-sm text-white/50 font-mono block mb-4">@ {exp.company}</span>
                                            <p className="text-sm text-white/70 leading-relaxed whitespace-pre-line">{exp.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section id="work" className="relative z-20">
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                            <div>
                                <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-4">精选作品集</h2>
                                <p className="font-mono text-white/50 max-w-lg">探索我的商业渲染与视觉设计项目。</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {PROJECTS.map(project => (<TiltCard key={project.id} project={project} onClick={setSelectedProject} />))}
                        </div>
                    </section>

                    <section id="contact" className="pt-40 pb-20 flex flex-col items-center justify-center text-center relative z-20">
                        <h2 className="text-6xl md:text-8xl lg:text-9xl font-black mb-12 text-white tracking-tighter">Let's Talk<span className="text-[#DA205A]">.</span></h2>
                        <MagneticButton onClick={() => setIsContactModalOpen(true)} className="bg-white text-black hover:bg-[#DA205A] hover:text-white px-8 py-4 rounded-full text-xl font-bold transition-colors duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)]">Contact Info</MagneticButton>
                    </section>
                </main>

                <footer className="border-t border-white/10 relative overflow-hidden bg-[#050505] z-20">
                    <div className="py-6 border-b border-white/5 flex overflow-hidden whitespace-nowrap relative">
                        <div className="animate-marquee-scroll flex gap-12 items-center font-mono text-white/40 text-sm tracking-widest pl-12">
                            <span>DESIGN & RENDER</span> <span className="w-1.5 h-1.5 rounded-full bg-[#DA205A]" /> <span>CINEMA 4D</span> <span className="w-1.5 h-1.5 rounded-full bg-[#DA205A]" /> <span>OCTANE</span> <span className="w-1.5 h-1.5 rounded-full bg-[#DA205A]" /> <span>AMAZON</span> <span className="w-1.5 h-1.5 rounded-full bg-[#DA205A]" /> <span>3C PRODUCT</span> <span className="w-1.5 h-1.5 rounded-full bg-[#DA205A]" /> <span>VISUAL MARKETING</span>
                            <span className="ml-12" /> <span>DESIGN & RENDER</span> <span className="w-1.5 h-1.5 rounded-full bg-[#DA205A]" /> <span>CINEMA 4D</span> <span className="w-1.5 h-1.5 rounded-full bg-[#DA205A]" /> <span>OCTANE</span> <span className="w-1.5 h-1.5 rounded-full bg-[#DA205A]" /> <span>AMAZON</span> <span className="w-1.5 h-1.5 rounded-full bg-[#DA205A]" /> <span>3C PRODUCT</span> <span className="w-1.5 h-1.5 rounded-full bg-[#DA205A]" /> <span>VISUAL MARKETING</span>
                        </div>
                    </div>
                    <div className="py-8 text-center"><p className="font-mono text-xs text-white/40">© 2026 朱丽微。</p></div>
                </footer>
            </div>

            <div className="fixed bottom-8 right-8 z-[300] flex flex-col items-end">
                <div className={`mb-4 w-80 sm:w-96 glass-panel bg-[#0a0a0a]/95 border-white/20 rounded-2xl overflow-hidden shadow-2xl flex flex-col transition-all duration-300 origin-bottom-right ${isChatOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 invisible'}`} style={{ height: '400px' }}>
                    <div className="h-14 bg-[#DA205A]/10 border-b border-[#DA205A]/20 flex items-center justify-between px-4">
                        <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#DA205A] animate-pulse" /><span className="font-bold text-sm tracking-wide">AI Assistant</span></div>
                        <button onClick={() => setIsChatOpen(false)} className="text-white/50 hover:text-white"><X size={16} /></button>
                    </div>
                    <div className="flex-grow overflow-y-auto p-4 space-y-4 no-scrollbar">
                        {chatMessages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.sender === 'user' ? 'bg-[#DA205A] text-white rounded-br-sm' : 'bg-white/10 text-white/90 rounded-bl-sm font-mono'}`}>{msg.text}</div>
                            </div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>
                    <form onSubmit={handleSendChat} className="h-14 border-t border-white/10 flex items-center px-2 bg-black/60">
                        <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="询问我的作品..." className="flex-grow bg-transparent outline-none text-sm px-3 text-white" />
                        <button type="submit" className="w-8 h-8 rounded-full bg-[#DA205A] flex items-center justify-center text-white hover:bg-white hover:text-[#DA205A] transition-colors"><Send size={14} /></button>
                    </form>
                </div>
                <MagneticButton onClick={() => setIsChatOpen(!isChatOpen)} className="w-14 h-14 rounded-full bg-white text-[#DA205A] flex items-center justify-center shadow-[0_0_20px_rgba(218,32,90,0.5)] cursor-pointer group">
                    <MessageSquare size={24} className="group-hover:scale-110" />
                    {!isChatOpen && <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-[#00F0FF] rounded-full border-2 border-white animate-pulse" />}
                </MagneticButton>
            </div>

            <div className={`fixed inset-0 z-[400] flex items-center justify-center transition-all duration-300 ${isContactModalOpen ? 'opacity-100 visible' : 'opacity-0 pointer-events-none'}`}>
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsContactModalOpen(false)} />
                <div className={`relative w-[90%] max-w-md glass-panel bg-[#0a0a0a]/90 border border-white/20 rounded-3xl p-8 transform transition-transform ${isContactModalOpen ? 'translate-y-0 scale-100' : 'translate-y-12 scale-95'}`}>
                    <button onClick={() => setIsContactModalOpen(false)} className="absolute top-6 right-6 text-white/50 hover:text-white"><X size={20} /></button>
                    <h3 className="text-2xl font-black mb-2">期待你的联系~</h3>
                    <p className="text-white/60 text-sm mb-8 font-mono">Let's build something amazing together.</p>
                    <div className="space-y-4">
                        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#07C160]/20 to-[#07C160]/5 border border-[#07C160]/30 p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2 text-[#07C160] font-bold"><MessageSquare size={18} /> WeChat</div>
                                <button onClick={() => setShowQrCode(!showQrCode)} className="text-[#07C160] hover:text-white flex items-center gap-1 text-xs bg-[#07C160]/20 px-2 py-1 rounded">
                                    <QrCode size={14} /> {showQrCode ? '隐藏' : '扫码'}
                                </button>
                            </div>
                            {showQrCode ? (
                                <div className="bg-white p-2 rounded-xl w-48 h-48 mx-auto mb-2 flex items-center justify-center animate-in zoom-in-95 duration-200">
                                    <img src={imgQrCode} alt="WeChat QR Code" className="w-full h-full object-contain rounded-lg" />
                                </div>
                            ) : (
                                <div className="flex items-center justify-between bg-black/40 rounded-xl p-3">
                                    <span className="font-mono text-white tracking-wider text-xs truncate mr-2">abanaannananananana</span>
                                    <button onClick={handleCopyWechat} className="text-white/50 hover:text-white">{copiedWechat ? <Check size={16} className="text-[#07C160]" /> : <Copy size={16} />}</button>
                                </div>
                            )}
                        </div>
                        <a href="mailto:1559816618@qq.com" className="block rounded-2xl bg-white/5 border border-white/10 p-4 hover:bg-white/10">
                            <div className="flex items-center gap-2 text-white font-bold mb-3"><Mail size={18} /> Email</div>
                            <div className="flex items-center justify-between bg-black/40 rounded-xl p-3">
                                <span className="font-mono text-white/80 text-sm truncate">1559816618@qq.com</span>
                                <ExternalLink size={16} className="text-white/50" />
                            </div>
                        </a>
                    </div>
                </div>
            </div>

            {/* 终极修复版：作品详情 Modal */}
            <div className={`fixed inset-0 z-[9999] transition-all duration-500 flex items-center justify-center ${selectedProject ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible pointer-events-none'}`}>
                
                {/* 1. 背景遮罩：绝对点击有效 */}
                <div className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer" onClick={() => setSelectedProject(null)} />
                
                {/* 2. 内容容器：独立排版，不覆盖按钮 */}
                <div className={`relative w-[95%] max-w-5xl h-[90vh] bg-[#0a0a0a] border border-white/20 rounded-[2rem] shadow-2xl flex flex-col transform transition-transform duration-500 ${selectedProject ? 'translate-y-0 scale-100' : 'translate-y-12 scale-95'}`}>
                    
                    {/* 顶部固定栏：拥有独立最高层级 z-[50] */}
                    <div className="flex-none h-20 px-8 border-b border-white/10 bg-[#0a0a0a] rounded-t-[2rem] flex items-center justify-between z-[50]">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedProject?.color || THEME.magenta }} />
                            <span className="font-mono font-bold text-base tracking-wider">{selectedProject?.title}</span>
                        </div>
                        
                        {/* 明确的 X 退出按钮，加入阻止冒泡机制 */}
                        <button 
                            onClick={(e) => { 
                                e.stopPropagation(); 
                                setSelectedProject(null); 
                            }} 
                            className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#DA205A] transition-colors cursor-pointer text-white"
                        >
                            <X size={24} />
                        </button>
                    </div>
                    
                    {/* 内部滚动区域：完全独立在顶部栏下方 */}
                    <div className="flex-1 overflow-y-auto relative z-[10] rounded-b-[2rem]">
                        {selectedProject && (
                            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                                <img src={selectedProject.longImage} alt="detail" className="w-full h-auto min-h-[40vh] object-cover rounded-b-[2rem]" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}