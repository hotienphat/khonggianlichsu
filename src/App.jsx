import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, ChevronRight, RefreshCw, BookOpen, Volume1 } from 'lucide-react';

// --- DATA SOURCE ---
const timelineData = [
  {
    id: 1,
    year: "1944",
    title: "Thành lập Đội VN Tuyên truyền GPQ",
    description: "Ngày 22/12/1944, tại khu rừng Trần Hưng Đạo, Đội Việt Nam Tuyên truyền Giải phóng quân được thành lập. Với 34 chiến sĩ, trang bị thô sơ nhưng mang trong mình lòng yêu nước nồng nàn, mở đầu cho trang sử vẻ vang của Quân đội nhân dân Việt Nam.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Doi_VNTTGPQ.jpg/800px-Doi_VNTTGPQ.jpg",
  },
  {
    id: 2,
    year: "1954",
    title: "Chín năm làm một Điện Biên",
    description: "Từ gậy tầm vông đến pháo đài bất khả xâm phạm. Quân đội ta lớn mạnh trong khói lửa, làm nên chiến thắng Điện Biên Phủ 'lừng lẫy năm châu, chấn động địa cầu', kết thúc ách đô hộ của thực dân Pháp.",
    image: "https://upload.wikimedia.org/wikipedia/commons/9/90/Dien_Bien_Phu_Victory.jpg",
    fallback: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Doi_VNTTGPQ.jpg/640px-Doi_VNTTGPQ.jpg"
  },
  {
    id: 3,
    year: "1959-1975",
    title: "Huyền thoại Đường Trường Sơn",
    description: "Đường mòn Hồ Chí Minh - tuyến hậu cần chiến lược vĩ đại. Hàng triệu thanh niên miền Bắc 'Xẻ dọc Trường Sơn đi cứu nước / Mà lòng phơi phới dậy tương lai' để giải phóng miền Nam thống nhất đất nước.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Ho_Chi_Minh_trail_Laos.jpg/800px-Ho_Chi_Minh_trail_Laos.jpg",
  },
  {
    id: 4,
    year: "1972",
    title: "Điện Biên Phủ trên không",
    description: "12 ngày đêm khói lửa năm 1972, bộ đội Phòng không - Không quân đã đánh bại cuộc tập kích chiến lược bằng B-52 của Mỹ vào Hà Nội, buộc Mỹ phải ký Hiệp định Paris, chấm dứt chiến tranh lập lại hòa bình.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/B-52_Dien_Bien_Phu.jpg/800px-B-52_Dien_Bien_Phu.jpg",
  },
  {
    id: 5,
    year: "1975",
    title: "Đại thắng Mùa Xuân",
    description: "11 giờ 30 phút ngày 30/4/1975, xe tăng của Quân đoàn 2 húc đổ cổng Dinh Độc Lập. Cờ giải phóng tung bay trên nóc phủ Tổng thống ngụy. Chiến dịch Hồ Chí Minh toàn thắng, Bắc Nam sum họp một nhà.",
    image: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Fall_of_Saigon_1975.jpg", 
  },
  {
    id: 6,
    year: "Nay",
    title: "Chính quy - Tinh nhuệ - Hiện đại",
    description: "Quân đội nhân dân Việt Nam ngày nay không ngừng lớn mạnh, làm chủ vũ khí trang bị hiện đại, sẵn sàng chiến đấu bảo vệ vững chắc độc lập, chủ quyền, thống nhất, toàn vẹn lãnh thổ, vùng trời, vùng biển của Tổ quốc.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Vietnam_People%27s_Navy_Molniya_corvette.jpg/800px-Vietnam_People%27s_Navy_Molniya_corvette.jpg",
  }
];

// --- COMPONENT: Dong Son Pattern ---
const DongSonPattern = ({ className }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
    <circle cx="50" cy="50" r="48" strokeWidth="0.8" opacity="0.6"/>
    <circle cx="50" cy="50" r="35" strokeDasharray="2 2" opacity="0.4"/>
    <path d="M50 35 L54 45 L64 45 L56 52 L60 62 L50 56 L40 62 L44 52 L36 45 L46 45 Z" fill="currentColor" opacity="0.2"/>
    <path d="M50 20 L50 10 M50 90 L50 80 M10 50 L20 50 M90 50 L80 50" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
  </svg>
);

// --- MAIN APP ---
export default function App() {
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // --- Audio State ---
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1.0); // 0.0 to 1.0
  const [voiceList, setVoiceList] = useState([]);

  const [loadingImage, setLoadingImage] = useState(true);
  
  const cardRef = useRef(null);      
  const containerRef = useRef(null); 
  const requestRef = useRef(null);
  
  const targetRotate = useRef({ x: 0, y: 0 });
  const currentRotate = useRef({ x: 0, y: 0 });

  const currentItem = timelineData[currentIndex];

  // --- 1. LOAD VOICES ---
  useEffect(() => {
    const getVoices = () => {
      let voices = window.speechSynthesis.getVoices();
      setVoiceList(voices);
    };
    getVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = getVoices;
    }
  }, []);

  // --- 2. HÀM ĐỌC NÂNG CAO (Volume + Voice) ---
  const speak = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel(); 
    
    // Nếu Mute thì không đọc, nhưng vẫn giữ hàm để cancel cái cũ
    if (isMuted || volume === 0) return;

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Tìm giọng Việt (Google > Microsoft > Fallback)
    let selectedVoice = voiceList.find(v => v.name.includes("Google Tiếng Việt"));
    if (!selectedVoice) selectedVoice = voiceList.find(v => v.name.includes("Microsoft HoaiMy"));
    if (!selectedVoice) selectedVoice = voiceList.find(v => v.lang === "vi-VN");

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = "vi-VN";
    } else {
      utterance.lang = "vi-VN"; 
    }

    // Set Volume từ State
    utterance.volume = volume; 
    utterance.rate = 1.0; 
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };

  // Trigger đọc khi đổi slide
  useEffect(() => {
    if (started) {
      setLoadingImage(true);
      setTimeout(() => speak(currentItem.description), 100);
    }
    return () => window.speechSynthesis.cancel();
  }, [currentIndex, started]); // Bỏ volume/mute ra khỏi dependency để tránh đọc lại khi kéo thanh trượt

  // Xử lý khi thay đổi volume slider
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0 && isMuted) {
      setIsMuted(false); // Tự động unmute khi kéo thanh trượt lên
    }
  };

  // Xử lý nút Mute toggle
  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      // Nếu volume đang về 0 mà bấm bật, thì set mặc định 0.5
      if (volume === 0) setVolume(0.5);
      // Đọc lại đoạn hiện tại nếu đang ở slide đó
      speak(currentItem.description);
    } else {
      setIsMuted(true);
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // --- ANIMATION ---
  const animate = () => {
    const ease = 0.05; 
    currentRotate.current.x += (targetRotate.current.x - currentRotate.current.x) * ease;
    currentRotate.current.y += (targetRotate.current.y - currentRotate.current.y) * ease;
    if (cardRef.current) {
      cardRef.current.style.transform = `perspective(1000px) rotateX(${currentRotate.current.x}deg) rotateY(${currentRotate.current.y}deg)`;
    }
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (started) {
      requestRef.current = requestAnimationFrame(animate);
      const handleOrientation = (e) => {
        const beta = Math.max(-30, Math.min(30, e.beta || 0));   
        const gamma = Math.max(-30, Math.min(30, e.gamma || 0)); 
        targetRotate.current = { x: beta, y: gamma / 1.5 };
      };
      window.addEventListener('deviceorientation', handleOrientation);
      return () => {
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
        window.removeEventListener('deviceorientation', handleOrientation);
      };
    }
  }, [started]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX / innerWidth) * 2 - 1;
    const y = (e.clientY / innerHeight) * 2 - 1;
    targetRotate.current = { x: -y * 15, y: x * 15 };
  };

  const handleNext = () => {
    if (isSpeaking && !isMuted && volume > 0) return;
    if (currentIndex < timelineData.length - 1) {
      setCurrentIndex(prev => prev + 1);
      targetRotate.current = { x: 0, y: 0 };
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    targetRotate.current = { x: 0, y: 0 };
  };

  // --- RENDER ---
  if (!started) {
    return (
      <div className="min-h-screen bg-[#120505] flex items-center justify-center relative overflow-hidden font-sans">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Nunito+Sans:wght@300;400;600&display=swap');
          .font-display { font-family: 'Playfair Display', serif; }
          .font-body { font-family: 'Nunito Sans', sans-serif; }
        `}</style>
        <div className="absolute inset-0 opacity-10 animate-[spin_60s_linear_infinite] pointer-events-none">
             <DongSonPattern className="w-[120vmax] h-[120vmax] -translate-x-1/4 -translate-y-1/4 text-amber-700" />
        </div>
        <div className="z-10 text-center p-8 bg-black/60 backdrop-blur-md border-y-2 border-amber-600/50 max-w-2xl mx-4 shadow-2xl">
          <div className="flex justify-center mb-6">
            <BookOpen className="w-12 h-12 text-amber-500" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-amber-500 uppercase tracking-widest font-display drop-shadow-md">
            Hào Khí Việt Nam
          </h1>
          <p className="text-gray-300 font-body text-lg mb-8 leading-relaxed">
            Hành trình lịch sử hào hùng của Quân đội nhân dân Việt Nam.<br/>
            Trải nghiệm tương tác 3D và âm thanh sống động.
          </p>
          <button 
            onClick={() => { setStarted(true); setVolume(1.0); }}
            className="px-10 py-4 bg-red-800 hover:bg-red-700 text-white font-bold tracking-widest uppercase transition-all duration-300 rounded-sm shadow-[0_0_20px_rgba(220,38,38,0.4)] flex items-center gap-3 mx-auto group font-display"
          >
            <span>Bắt đầu</span>
            <ChevronRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-[#0a0202] text-amber-50 flex flex-col relative overflow-hidden font-body"
      onMouseMove={handleMouseMove}
    >
       <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Nunito+Sans:wght@300;400;600&display=swap');
          .font-display { font-family: 'Playfair Display', serif; }
          .font-body { font-family: 'Nunito Sans', sans-serif; }
          
          /* Custom Range Slider */
          input[type=range] {
            -webkit-appearance: none;
            background: transparent;
          }
          input[type=range]::-webkit-slider-thumb {
            -webkit-appearance: none;
            height: 16px;
            width: 16px;
            border-radius: 50%;
            background: #f59e0b; /* amber-500 */
            cursor: pointer;
            margin-top: -6px;
          }
          input[type=range]::-webkit-slider-runnable-track {
            width: 100%;
            height: 4px;
            background: #4b5563;
            border-radius: 2px;
          }
          
          ::-webkit-scrollbar { width: 6px; }
          ::-webkit-scrollbar-track { bg: #000; }
          ::-webkit-scrollbar-thumb { background: #78350f; border-radius: 10px; }
          @keyframes pulse-ring {
            0% { transform: scale(0.8); opacity: 0.5; }
            100% { transform: scale(1.2); opacity: 0; }
          }
       `}</style>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#2b0a0a_0%,_#000000_100%)] z-0"></div>
      <div className="absolute top-0 right-0 opacity-10 w-96 h-96 pointer-events-none">
        <DongSonPattern className="w-full h-full text-amber-500" />
      </div>

      <header className="z-50 px-6 py-4 flex justify-between items-center border-b border-amber-900/30 bg-black/40 backdrop-blur-sm">
        <div className="flex items-center gap-3">
           <div className="w-8 h-8 bg-red-800 rounded flex items-center justify-center font-display font-bold text-amber-400 border border-amber-600">VN</div>
           <span className="text-amber-500 font-display font-bold tracking-wider text-sm md:text-base hidden md:block">
             Bảo tàng Lịch sử Số
           </span>
        </div>
        
        {/* --- KHU VỰC ĐIỀU KHIỂN & THANH TRƯỢT --- */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1 hidden md:flex">
            {timelineData.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === currentIndex ? 'w-8 bg-amber-500' : 'w-2 bg-gray-800'}`}></div>
            ))}
          </div>

          <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
            <button onClick={toggleMute} className="text-amber-400 hover:text-amber-300 transition-colors">
              {isMuted || volume === 0 ? <VolumeX size={18} /> : 
               volume < 0.5 ? <Volume1 size={18} /> : <Volume2 size={18} className={isSpeaking ? "text-green-400" : ""} />}
            </button>
            
            {/* INPUT SLIDER CHO MỌI NỀN TẢNG */}
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.05" 
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-20 md:w-24 h-full cursor-pointer opacity-80 hover:opacity-100 transition-opacity"
              aria-label="Volume control"
            />
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col md:flex-row items-center justify-center w-full max-w-7xl mx-auto p-4 z-10 gap-8 md:gap-16">
        <div className="w-full md:w-1/2 flex items-center justify-center perspective-[2000px]">
          <div ref={cardRef} className="relative w-full max-w-xl aspect-[4/3] will-change-transform" style={{ transformStyle: 'preserve-3d' }}>
            <div className="absolute inset-0 bg-gray-900 rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-amber-900/50 overflow-hidden group">
               <div className={`w-full h-full transition-opacity duration-700 bg-black ${loadingImage ? 'opacity-50' : 'opacity-100'}`}>
                 <img src={currentItem.image} alt={currentItem.title} onLoad={() => setLoadingImage(false)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[10s] ease-linear" onError={(e) => { if (currentItem.fallback && e.target.src !== currentItem.fallback) { e.target.src = currentItem.fallback; } }} />
               </div>
               <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent pointer-events-none"></div>
               <div className="absolute inset-0 border-[6px] border-[#2a1a10] pointer-events-none z-20"></div>
               <div className="absolute inset-0 border border-amber-500/30 m-2 pointer-events-none z-20"></div>
               <div className="absolute bottom-6 left-6 z-30 transform translate-z-10" style={{ transform: 'translateZ(30px)' }}>
                  <span className="block text-5xl md:text-7xl font-display font-bold text-amber-500/20 leading-none">{currentItem.year}</span>
                  <span className="absolute top-1/2 left-0 -translate-y-1/2 text-xl font-bold text-amber-100 tracking-widest pl-2">{currentItem.year}</span>
               </div>
            </div>
            <div className="absolute -bottom-12 left-10 right-10 h-4 bg-black/60 blur-xl rounded-full" style={{ transform: 'translateZ(-50px) rotateX(90deg)' }}></div>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex flex-col justify-center space-y-6">
          <div className="space-y-2">
             <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-900/30 border border-amber-800/50 rounded-full text-xs text-amber-300 uppercase tracking-widest font-bold w-fit">
               <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
               Giai đoạn lịch sử
             </div>
             <h2 className="text-3xl md:text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-600 leading-tight">
               {currentItem.title}
             </h2>
          </div>
          <div className="relative pl-6 border-l-2 border-amber-800/50">
             <p className="text-base md:text-lg text-gray-300 leading-relaxed font-body font-light">
               {currentItem.description}
             </p>
             {isSpeaking && (
               <div className="absolute top-0 right-0 opacity-50">
                 <div className="w-4 h-4 border-2 border-amber-500 rounded-full animate-[pulse-ring_1.5s_infinite]"></div>
               </div>
             )}
          </div>
          <div className="pt-4 flex gap-4">
             {currentIndex < timelineData.length - 1 ? (
               <button 
                 onClick={handleNext}
                 disabled={isSpeaking && !isMuted && volume > 0}
                 className={`flex-1 py-3 px-6 rounded-sm font-display font-bold tracking-widest uppercase transition-all shadow-lg flex items-center justify-center gap-2
                   ${isSpeaking && !isMuted && volume > 0 
                     ? 'bg-gray-700 text-gray-400 cursor-not-allowed opacity-80' 
                     : 'bg-amber-700 hover:bg-amber-600 text-white hover:shadow-amber-900/50'}`}
               >
                 {isSpeaking && !isMuted && volume > 0 ? <>Đang thuyết minh...</> : <>Tiếp theo <ChevronRight size={18} /></>}
               </button>
             ) : (
               <button onClick={handleRestart} className="flex-1 bg-red-900 hover:bg-red-800 text-white py-3 px-6 rounded-sm font-display font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2">
                 <RefreshCw size={18} /> Xem lại
               </button>
             )}
          </div>
          <div className="text-center text-xs text-gray-600 font-mono pt-4">
             Mẹo: Di chuột hoặc nghiêng thiết bị để đổi góc nhìn
          </div>
        </div>
      </main>
    </div>
  );
}