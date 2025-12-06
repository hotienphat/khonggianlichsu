import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, ChevronRight, RefreshCw, Star, PlayCircle, Maximize, Minimize, Loader2 } from 'lucide-react';

// --- CẤU HÌNH DỮ LIỆU ---
const timelineData = [
  {
    id: 1,
    year: "1944",
    title: "Khai sinh từ rừng thẳm",
    subtitle: "Thành lập Đội VN Tuyên truyền GPQ",
    description: "Ngày 22/12/1944, dưới tán rừng Trần Hưng Đạo, Đội Việt Nam Tuyên truyền Giải phóng quân ra đời. 34 chiến sĩ, vũ khí thô sơ nhưng ý chí thép, họ đã thề 'Cảm tử cho Tổ quốc quyết sinh', mở đầu trang sử vàng của Quân đội nhân dân Việt Nam.",
    image: "https://upload.wikimedia.org/wikipedia/commons/1/1d/Vo_Nguyen_Giap%2C_Vietminh_forces%2C_1944.jpg",
  },
  {
    id: 2,
    year: "1954",
    title: "Chấn động địa cầu",
    subtitle: "Chiến thắng Điện Biên Phủ",
    description: "56 ngày đêm 'khoét núi, ngủ hầm, mưa dầm, cơm vắt'. Quân đội ta từ chân trần chí thép đã làm nên chiến thắng Điện Biên Phủ 'lừng lẫy năm châu, chấn động địa cầu', chấm dứt hoàn toàn ách đô hộ của thực dân Pháp.",
    image: "https://upload.wikimedia.org/wikipedia/commons/9/90/Dien_Bien_Phu_Victory.jpg",
  },
  {
    id: 3,
    year: "1959",
    title: "Huyền thoại Trường Sơn",
    subtitle: "Đường mòn Hồ Chí Minh",
    description: "Xẻ dọc Trường Sơn đi cứu nước. Tuyến đường huyết mạch vận chuyển sức người, sức của chi viện cho miền Nam ruột thịt. Nơi ý chí con người chiến thắng bom đạn và thiên nhiên khắc nghiệt.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Ho_Chi_Minh_trail_Laos.jpg/1280px-Ho_Chi_Minh_trail_Laos.jpg",
  },
  {
    id: 4,
    year: "1972",
    title: "Điện Biên Phủ trên không",
    subtitle: "12 ngày đêm rực lửa",
    description: "Hà Nội, tháng 12 năm 1972. Bằng bản lĩnh và trí tuệ, bộ đội Phòng không - Không quân đã vít cổ Pháo đài bay B-52, đập tan cuộc tập kích chiến lược của Mỹ, buộc đối phương phải ký Hiệp định Paris.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/B-52_Dien_Bien_Phu.jpg/1024px-B-52_Dien_Bien_Phu.jpg",
  },
  {
    id: 5,
    year: "1975",
    title: "Khải hoàn ca",
    subtitle: "Đại thắng Mùa Xuân",
    description: "11 giờ 30 phút ngày 30/4/1975, cờ giải phóng tung bay trên nóc Dinh Độc Lập. Chiến dịch Hồ Chí Minh toàn thắng. Non sông thu về một mối, Bắc Nam sum họp một nhà.",
    image: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Fall_of_Saigon_1975.jpg", 
  },
  {
    id: 6,
    year: "2025",
    title: "Vững bước dưới cờ Đảng",
    subtitle: "Kỷ niệm 81 năm thành lập",
    description: "Chào mừng kỷ niệm 81 năm (22/12/1944 - 22/12/2025). Quân đội nhân dân Việt Nam ngày nay: Cách mạng - Chính quy - Tinh nhuệ - Hiện đại. Sẵn sàng chiến đấu, bảo vệ vững chắc Tổ quốc trong kỷ nguyên số.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Vietnam_People%27s_Navy_Molniya_corvette.jpg/1280px-Vietnam_People%27s_Navy_Molniya_corvette.jpg",
  }
];

// --- COMPONENT: Hoa văn Trống Đồng ---
const DongSonPattern = ({ className }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" stroke="currentColor">
    <circle cx="50" cy="50" r="48" strokeWidth="0.5" opacity="0.3"/>
    <circle cx="50" cy="50" r="38" strokeDasharray="1 3" opacity="0.4"/>
    <path d="M50 30 L53 40 L63 40 L55 48 L58 58 L50 52 L42 58 L45 48 L37 40 L47 40 Z" fill="currentColor" opacity="0.1"/>
    <path d="M50 0 L50 100 M0 50 L100 50" strokeWidth="0.2" opacity="0.2"/>
    <path d="M50 10 Q60 5 70 10 T90 10" strokeWidth="0.5" opacity="0.4" strokeLinecap="round"/>
  </svg>
);

export default function App() {
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [loadingImage, setLoadingImage] = useState(true);
  const [voiceList, setVoiceList] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // State mới: Kiểm soát việc được phép chuyển slide
  const [canProceed, setCanProceed] = useState(false); 

  const cardRef = useRef(null);      
  const containerRef = useRef(null); 
  const requestRef = useRef(null);
  
  const targetRotate = useRef({ x: 0, y: 0 });
  const currentRotate = useRef({ x: 0, y: 0 });

  const currentItem = timelineData[currentIndex];

  // --- 1. XỬ LÝ FULLSCREEN ---
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(err => console.log(err));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  };

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // --- 2. XỬ LÝ GIỌNG NÓI ---
  useEffect(() => {
    const getVoices = () => {
      let voices = window.speechSynthesis.getVoices();
      setVoiceList(voices);
    };
    getVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = getVoices;
    }
    
    // Cleanup khi unmount: tắt tiếng
    return () => window.speechSynthesis.cancel();
  }, []);

  const speak = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel(); // Reset giọng cũ

    // Nếu Mute: Cho phép đi tiếp ngay lập tức, không đọc
    if (isMuted) {
      setIsSpeaking(false);
      setCanProceed(true);
      return;
    }

    // Nếu không Mute: Khóa nút Next
    setCanProceed(false);

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Logic chọn giọng tối ưu
    let selectedVoice = voiceList.find(v => v.name.includes("Google Tiếng Việt"));
    if (!selectedVoice) selectedVoice = voiceList.find(v => v.name.includes("Microsoft HoaiMy"));
    if (!selectedVoice) selectedVoice = voiceList.find(v => v.lang === "vi-VN");

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = "vi-VN";
    } else {
      // Fallback: Nếu không có giọng Việt, log lỗi và cho phép đi tiếp
      console.warn("Không tìm thấy giọng tiếng Việt.");
      setCanProceed(true);
      return; 
    }

    utterance.rate = 1.0; 
    utterance.pitch = 1.0;
    
    utterance.onstart = () => setIsSpeaking(true);
    
    // QUAN TRỌNG: Khi đọc xong hoặc lỗi -> Mở khóa nút Next
    const handleEnd = () => {
      setIsSpeaking(false);
      setCanProceed(true);
    };

    utterance.onend = handleEnd;
    utterance.onerror = handleEnd;
    
    window.speechSynthesis.speak(utterance);
  };

  // Trigger đọc khi chuyển slide
  useEffect(() => {
    if (started) {
      setLoadingImage(true);
      setCanProceed(false); // Khóa ngay khi slide mới hiện ra
      
      // Delay nhỏ cho mượt UI
      const timer = setTimeout(() => speak(currentItem.description), 600);
      
      return () => {
        clearTimeout(timer);
        window.speechSynthesis.cancel();
      };
    }
  }, [currentIndex, started, isMuted]); // Trigger lại nếu bật/tắt tiếng

  // --- 3. XỬ LÝ 3D ANIMATION ---
  const animate = () => {
    const ease = 0.05; 
    currentRotate.current.x += (targetRotate.current.x - currentRotate.current.x) * ease;
    currentRotate.current.y += (targetRotate.current.y - currentRotate.current.y) * ease;
    
    if (cardRef.current) {
      const rotateX = Math.max(-15, Math.min(15, currentRotate.current.x));
      const rotateY = Math.max(-15, Math.min(15, currentRotate.current.y));
      cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (started) {
      requestRef.current = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(requestRef.current);
    }
  }, [started]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX / innerWidth) * 2 - 1;
    const y = (e.clientY / innerHeight) * 2 - 1;
    targetRotate.current = { x: -y * 10, y: x * 10 };
  };

  const handleNext = () => {
    // Logic chặn: Nếu chưa xong (canProceed = false) và không mute thì không cho qua
    if (!canProceed && !isMuted) return;

    if (currentIndex < timelineData.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  // --- MÀN HÌNH CHỜ (INTRO) ---
  if (!started) {
    return (
      <div className="min-h-screen bg-[#0f0404] flex items-center justify-center relative overflow-hidden font-sans">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Roboto+Condensed:wght@300;400;700&display=swap');
          .font-title { font-family: 'Playfair Display', serif; }
          .font-content { font-family: 'Roboto Condensed', sans-serif; }
        `}</style>
        
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#450a0a_0%,_#000000_100%)]"></div>
        <div className="absolute inset-0 opacity-20 animate-[spin_120s_linear_infinite] pointer-events-none">
             <DongSonPattern className="w-[150vmax] h-[150vmax] -translate-x-1/4 -translate-y-1/4 text-amber-600" />
        </div>

        <div className="z-10 relative flex flex-col items-center justify-center text-center p-8 max-w-4xl mx-auto">
          <div className="mb-6 animate-bounce">
            <Star className="w-16 h-16 text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.8)] fill-yellow-500" />
          </div>
          
          <h2 className="text-amber-500 text-xl md:text-2xl font-content tracking-[0.3em] uppercase mb-4">
            Chào mừng kỷ niệm 81 năm
          </h2>
          
          <h1 className="text-5xl md:text-8xl font-title font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600 mb-6 drop-shadow-lg uppercase leading-tight">
            Hào Khí<br/>Việt Nam
          </h1>
          
          <div className="w-32 h-1 bg-red-600 mb-8 mx-auto shadow-[0_0_10px_red]"></div>

          <p className="text-gray-300 font-content text-lg md:text-2xl mb-12 max-w-2xl leading-relaxed">
            Hành trình lịch sử từ Đội Việt Nam Tuyên truyền Giải phóng quân (1944) đến Quân đội nhân dân Cách mạng, Chính quy, Tinh nhuệ, Hiện đại (2025).
          </p>
          
          <button 
            onClick={() => setStarted(true)}
            className="group relative px-12 py-5 bg-red-800 overflow-hidden rounded-sm shadow-[0_0_30px_rgba(220,38,38,0.5)] transition-all hover:scale-105 hover:shadow-[0_0_50px_rgba(220,38,38,0.8)] cursor-pointer"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1s_infinite]"></div>
            <span className="relative flex items-center gap-3 text-white font-bold text-xl tracking-widest uppercase font-content">
              <PlayCircle size={24} /> Bắt đầu trải nghiệm
            </span>
          </button>
        </div>
      </div>
    );
  }

  // --- MÀN HÌNH CHÍNH ---
  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-[#0a0202] text-amber-50 flex flex-col relative overflow-hidden font-content"
      onMouseMove={handleMouseMove}
    >
       <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Roboto+Condensed:wght@300;400;700&display=swap');
          .font-title { font-family: 'Playfair Display', serif; }
          .font-content { font-family: 'Roboto Condensed', sans-serif; }
       `}</style>

      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#3f0e0e_0%,_#000000_100%)] z-0"></div>
      
      {/* Header */}
      <header className="z-50 px-8 py-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-4">
           <div className="w-10 h-10 bg-red-700 rounded-sm flex items-center justify-center border border-yellow-500 shadow-lg">
             <Star size={20} className="text-yellow-400 fill-yellow-400" />
           </div>
           <div>
             <h3 className="text-amber-500 font-bold uppercase tracking-wider text-sm">Lịch sử QĐND Việt Nam</h3>
             <p className="text-gray-400 text-xs">22/12/1944 - 22/12/2025</p>
           </div>
        </div>
        
        {/* Controls */}
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-1.5">
            {timelineData.map((_, i) => (
              <div 
                key={i} 
                className={`h-2 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-10 bg-amber-500 shadow-[0_0_10px_orange]' : 'w-2 bg-gray-700'}`}
              />
            ))}
          </div>
          
          <div className="flex gap-3">
             {/* Nút Fullscreen */}
             <button 
              onClick={toggleFullscreen}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
              title="Toàn màn hình"
            >
              {isFullscreen ? <Minimize size={18} className="text-gray-300" /> : <Maximize size={18} className="text-gray-300" />}
            </button>

            {/* Nút Mute */}
            <button 
              onClick={() => setIsMuted(!isMuted)} 
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
              title={isMuted ? "Bật tiếng" : "Tắt tiếng"}
            >
              {isMuted ? <VolumeX size={18} className="text-gray-400" /> : <Volume2 size={18} className="text-green-400 animate-pulse" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col md:flex-row items-center justify-center w-full max-w-7xl mx-auto p-4 z-10 gap-12">
        
        {/* LEFT: 3D Image Card */}
        <div className="w-full md:w-5/12 flex items-center justify-center perspective-[2000px]">
          <div ref={cardRef} className="relative w-full aspect-[4/3] transition-transform duration-100 ease-out" style={{ transformStyle: 'preserve-3d' }}>
            <div className="absolute inset-0 bg-gray-900 rounded-sm shadow-[0_30px_60px_rgba(0,0,0,0.8)] border border-amber-900/50 overflow-hidden group">
               {/* Image */}
               <div className={`w-full h-full bg-black relative`}>
                 {loadingImage && (
                   <div className="absolute inset-0 flex items-center justify-center bg-gray-800 z-20">
                     <Loader2 className="animate-spin text-amber-500" />
                   </div>
                 )}
                 <img 
                    src={currentItem.image} 
                    alt={currentItem.title} 
                    onLoad={() => setLoadingImage(false)} 
                    className="w-full h-full object-cover transition-transform duration-[20s] ease-linear scale-100 group-hover:scale-110" 
                 />
               </div>
               
               {/* Overlays */}
               <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 pointer-events-none"></div>
               <div className="absolute inset-0 border-[8px] border-[#2a1a10] pointer-events-none z-20 opacity-80"></div>
               
               {/* Year Badge */}
               <div className="absolute top-4 right-4 z-30 bg-red-700/90 text-white px-4 py-2 font-bold font-title text-xl shadow-lg border-l-4 border-yellow-500 backdrop-blur-sm">
                  {currentItem.year}
               </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Text Content */}
        <div className="w-full md:w-7/12 flex flex-col justify-center space-y-6 md:pl-10">
          <div className="space-y-3 animate-[fadeIn_0.5s_ease-out]">
             <span className="text-amber-500 font-bold tracking-[0.2em] uppercase text-sm border-b border-amber-500/50 pb-1 inline-block">
               Giai đoạn {currentItem.year}
             </span>
             
             <h2 className="text-4xl md:text-6xl font-title font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-100 to-amber-500 leading-tight drop-shadow-md">
               {currentItem.title}
             </h2>
             
             <h3 className="text-xl md:text-2xl text-red-500 font-content uppercase tracking-wide font-bold">
               {currentItem.subtitle}
             </h3>
          </div>

          <div className="relative pl-6 border-l-4 border-amber-800/50 py-2">
             <p className="text-lg md:text-xl text-gray-300 leading-relaxed font-content font-light text-justify">
               {currentItem.description}
             </p>
          </div>

          {/* Navigation Buttons */}
          <div className="pt-8 flex gap-4">
             {currentIndex > 0 && (
                <button 
                  onClick={handlePrev}
                  className="px-6 py-3 border border-gray-600 hover:border-amber-500 text-gray-400 hover:text-amber-500 rounded-sm transition-all uppercase font-bold tracking-wider text-sm"
                >
                  Quay lại
                </button>
             )}
             
             {currentIndex < timelineData.length - 1 ? (
               <button 
                 onClick={handleNext}
                 disabled={!canProceed && !isMuted}
                 className={`flex-1 py-4 px-8 rounded-sm shadow-lg flex items-center justify-center gap-3 transition-all font-bold tracking-widest uppercase 
                   ${(!canProceed && !isMuted) 
                      ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700' 
                      : 'bg-gradient-to-r from-red-900 to-red-700 hover:from-red-800 hover:to-red-600 text-white cursor-pointer group'}`}
               >
                 <span>
                    {(!canProceed && !isMuted) ? "Đang thuyết trình..." : "Tiếp bước"}
                 </span>
                 {(!canProceed && !isMuted) ? (
                   <Loader2 size={20} className="animate-spin" />
                 ) : (
                   <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                 )}
               </button>
             ) : (
               <button 
                 onClick={() => {
                   window.speechSynthesis.cancel();
                   setCurrentIndex(0); 
                   setStarted(false);
                 }} 
                 className="flex-1 py-4 px-8 bg-amber-700 hover:bg-amber-600 text-white font-bold tracking-widest uppercase rounded-sm shadow-lg flex items-center justify-center gap-3 transition-all"
               >
                 <RefreshCw size={20} /> Về trang chủ
               </button>
             )}
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="text-center py-4 text-gray-600 text-xs font-mono z-10 hidden md:block">
        Trình diễn Lịch sử số • 22/12/1944 - 22/12/2025
      </footer>
    </div>
  );
}