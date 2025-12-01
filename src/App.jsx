import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, ChevronRight, RefreshCcw, Info } from 'lucide-react';

// --- DATA SOURCE ---
// Dữ liệu được map từ các file bạn đã upload, sắp xếp theo trình tự lịch sử
const timelineData = [
  {
    id: 1,
    year: "1944",
    title: "Thành lập Đội Việt Nam Tuyên truyền Giải phóng quân",
    description: "Ngày 22/12/1944, tại khu rừng Trần Hưng Đạo, Đội Việt Nam Tuyên truyền Giải phóng quân - tiền thân của Quân đội nhân dân Việt Nam được thành lập theo chỉ thị của lãnh tụ Hồ Chí Minh. Đội gồm 34 chiến sĩ, trang bị thô sơ nhưng mang trong mình lòng yêu nước nồng nàn và ý chí quyết chiến quyết thắng.",
    image: "https://r.jina.ai/https://lh3.googleusercontent.com/d/1X50v924lK5j7bXW8H1-YvLzH2v4zR3v_", // 1. Mới thành lập
    fallbackImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Doi_VNTTGPQ.jpg/640px-Doi_VNTTGPQ.jpg"
  },
  {
    id: 2,
    year: "1945-1954",
    title: "Cách mạng Tháng Tám & Kháng chiến chống Pháp",
    description: "Quân đội ta cùng toàn dân tiến hành Tổng khởi nghĩa Tháng Tám năm 1945 thắng lợi. Sau đó là 9 năm kháng chiến trường kỳ chống thực dân Pháp, những người lính Cụ Hồ với tinh thần 'Quyết tử cho Tổ quốc quyết sinh' đã làm nên những chiến công vang dội.",
    image: "https://r.jina.ai/https://lh3.googleusercontent.com/d/1X2dY87f0397466186a5861993d64559", // 2. CMT8 1954
  },
  {
    id: 3,
    year: "1954",
    title: "Kéo pháo vào Điện Biên Phủ",
    description: "Hình ảnh bộ đội ta kéo pháo vào trận địa Điện Biên Phủ. Với khẩu hiệu 'Chân đồng vai sắt', quân đội ta đã vượt qua muôn vàn gian khổ, tạo nên chiến thắng Điện Biên Phủ 'lừng lẫy năm châu, chấn động địa cầu', kết thúc ách đô hộ của thực dân Pháp.",
    image: "https://r.jina.ai/https://lh3.googleusercontent.com/d/1Xf8c4ec4f8def4248b18150fb0bd4f5f3", // 3. ...
  },
  {
    id: 4,
    year: "1960-1970",
    title: "Xẻ dọc Trường Sơn đi cứu nước",
    description: "Trong cuộc kháng chiến chống Mỹ cứu nước, hàng triệu thanh niên miền Bắc đã lên đường nhập ngũ. Đường mòn Hồ Chí Minh trở thành huyền thoại, nơi bộ đội ta hành quân, vận chuyển lương thực, vũ khí chi viện cho chiến trường miền Nam ruột thịt.",
    image: "https://r.jina.ai/https://lh3.googleusercontent.com/d/1X84bddf3f311f45e0936d37e6b979d31d", // 5...
  },
  {
    id: 5,
    year: "1968-1972",
    title: "Chiến đấu bảo vệ bầu trời",
    description: "Lực lượng phòng không không quân và dân quân tự vệ phối hợp chiến đấu ngoan cường, bắn rơi nhiều máy bay địch, làm nên trận 'Điện Biên Phủ trên không' năm 1972, buộc Mỹ phải ký hiệp định Paris.",
    image: "https://r.jina.ai/https://lh3.googleusercontent.com/d/1X345deafd4f8047e786a986dbfd47fc2e", // 6...
  },
  {
    id: 6,
    year: "1975",
    title: "Đại thắng Mùa Xuân 1975",
    description: "Thời khắc lịch sử trưa ngày 30/4/1975, xe tăng của Quân giải phóng húc đổ cổng Dinh Độc Lập, đánh dấu sự thắng lợi hoàn toàn của Chiến dịch Hồ Chí Minh lịch sử. Miền Nam hoàn toàn giải phóng, non sông thu về một mối.",
    image: "https://r.jina.ai/https://lh3.googleusercontent.com/d/1Xc61c7053bf0d41cf9b36645f9e5eee86", // 4. xe tăng...
  },
  {
    id: 7,
    year: "1979",
    title: "Cuộc chiến đấu bảo vệ biên giới",
    description: "Khi Tổ quốc lâm nguy, quân và dân ta lại một lần nữa đứng lên cầm súng bảo vệ từng tấc đất biên cương phía Bắc và phía Tây Nam. Tinh thần chiến đấu quả cảm đã giữ vững chủ quyền thiêng liêng của dân tộc.",
    image: "https://r.jina.ai/https://lh3.googleusercontent.com/d/1X53f51b347cda4667b4d87added6ab465", // 7...
  },
  {
    id: 8,
    year: "1980s",
    title: "Giữ vững tay súng nơi biên cương",
    description: "Những người lính quân hàm xanh vẫn ngày đêm bám chốt, chịu đựng sương gió để bảo vệ sự bình yên cho nhân dân. Hình ảnh người chiến sĩ B41 tại mặt trận Vị Xuyên là biểu tượng cho sự kiên cường ấy.",
    image: "https://r.jina.ai/https://lh3.googleusercontent.com/d/1X7b59f93408c344acaa139c81575737ec", // 8...
  },
  {
    id: 9,
    year: "2000s",
    title: "Hiện đại hóa Quân đội",
    description: "Bước vào thời bình, Quân đội nhân dân Việt Nam không ngừng lớn mạnh, tiến lên chính quy, tinh nhuệ, hiện đại. Các quân binh chủng hợp thành luôn sẵn sàng chiến đấu cao.",
    image: "https://r.jina.ai/https://lh3.googleusercontent.com/d/1X5229281c8e3247cbb7671cd07990df6e", // 9...
  },
  {
    id: 10,
    year: "Nay",
    title: "Làm chủ biển đảo quê hương",
    description: "Hải quân nhân dân Việt Nam ngày nay được trang bị tàu ngầm Kilo, tàu hộ vệ tên lửa hiện đại, cùng lực lượng Cảnh sát biển, Kiểm ngư kiên quyết, kiên trì bảo vệ vững chắc chủ quyền biển đảo thiêng liêng của Tổ quốc.",
    image: "https://r.jina.ai/https://lh3.googleusercontent.com/d/1X92472cc608764f448a8b1776f0c2c84b", // 10...
  }
];

// --- COMPONENT: Dong Son Drum Pattern SVG ---
const DongSonPattern = ({ className }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
    <circle cx="50" cy="50" r="48" strokeWidth="1" />
    <circle cx="50" cy="50" r="40" />
    <circle cx="50" cy="50" r="30" strokeDasharray="2 1" />
    <circle cx="50" cy="50" r="20" />
    {/* Stylized Sun star in center */}
    <path d="M50 35 L53 45 L63 45 L55 52 L58 62 L50 56 L42 62 L45 52 L37 45 L47 45 Z" fill="currentColor" opacity="0.3"/>
    {/* Abstract bird motifs (Lac bird) */}
    <path d="M50 10 Q60 5 70 10" strokeLinecap="round"/>
    <path d="M50 90 Q40 95 30 90" strokeLinecap="round"/>
    <path d="M10 50 Q5 40 10 30" strokeLinecap="round"/>
    <path d="M90 50 Q95 60 90 70" strokeLinecap="round"/>
  </svg>
);

// --- MAIN APP COMPONENT ---
export default function App() {
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioEnded, setAudioEnded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  // 3D rotation state
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  
  const currentItem = timelineData[currentIndex];

  // --- AUDIO / SPEECH LOGIC ---
  const speak = (text) => {
    if (!window.speechSynthesis) return;
    
    // Cancel previous
    window.speechSynthesis.cancel();
    
    if (isMuted) {
      // If muted, simulate reading time then finish
      setTimeout(() => setAudioEnded(true), 3000);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'vi-VN';
    utterance.rate = 0.9; // Slightly slower for solemnity
    utterance.pitch = 0.9; // Deeper voice

    utterance.onstart = () => {
      setIsSpeaking(true);
      setAudioEnded(false);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setAudioEnded(true);
    };

    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (started) {
      speak(currentItem.description);
    }
    // Cleanup on unmount
    return () => window.speechSynthesis.cancel();
  }, [currentIndex, started, isMuted]);


  // --- 3D MOUSE EFFECT ---
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    
    // Rotate slightly based on mouse position
    setRotation({ x: y * 10, y: -x * 10 });
  };

  const handleNext = () => {
    if (currentIndex < timelineData.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setAudioEnded(false);
      setRotation({ x: 0, y: 0 }); // Reset 3D
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setAudioEnded(false);
    setRotation({ x: 0, y: 0 });
    speak(timelineData[0].description);
  };

  // --- RENDER ---
  if (!started) {
    return (
      <div className="min-h-screen bg-[#2b0a0a] flex items-center justify-center relative overflow-hidden font-serif text-amber-500">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
           <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%]">
             <DongSonPattern className="w-full h-full animate-spin-slow" />
           </div>
        </div>
        
        <div className="z-10 text-center p-8 border-4 border-amber-600/50 bg-black/60 backdrop-blur-sm max-w-2xl mx-4 shadow-2xl rounded-sm">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-amber-500 uppercase tracking-widest drop-shadow-md">
            Hào Khí Việt Nam
          </h1>
          <h2 className="text-xl md:text-2xl text-amber-200 mb-8 font-light italic">
            Bảo tàng số 3D chào mừng ngày 22/12
          </h2>
          <p className="mb-8 text-gray-300">
            Trải nghiệm hành trình lịch sử của Quân đội nhân dân Việt Nam qua không gian tương tác hình ảnh và âm thanh.
            <br/><span className="text-sm opacity-70">(Vui lòng bật âm thanh thiết bị)</span>
          </p>
          <button 
            onClick={() => setStarted(true)}
            className="group relative px-8 py-4 bg-red-800 text-amber-100 font-bold uppercase tracking-wider overflow-hidden shadow-lg hover:bg-red-700 transition-all duration-300 border border-amber-500"
          >
            <span className="relative z-10 flex items-center gap-2">
              Bắt đầu tham quan <ChevronRight />
            </span>
            <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-[#1a0505] text-amber-50 font-serif flex flex-col relative overflow-hidden selection:bg-red-900 selection:text-white"
      onMouseMove={handleMouseMove}
    >
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')]"></div>
      <div className="absolute -left-48 -bottom-48 w-96 h-96 text-amber-900/20 animate-spin-slow">
        <DongSonPattern className="w-full h-full" />
      </div>
      <div className="absolute -right-48 -top-48 w-96 h-96 text-amber-900/20 animate-spin-slow">
        <DongSonPattern className="w-full h-full" />
      </div>

      {/* Header / Navbar */}
      <header className="z-50 px-6 py-4 flex justify-between items-center border-b border-amber-900/50 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 border-2 border-amber-500 rounded-full flex items-center justify-center bg-red-900">
             <span className="text-amber-400 font-bold">VN</span>
           </div>
           <div>
             <h1 className="text-amber-500 font-bold tracking-wider text-sm md:text-base uppercase">Bảo tàng QĐND Việt Nam</h1>
             <p className="text-xs text-amber-300/60">Kỷ niệm ngày 22/12</p>
           </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-xs text-amber-400/80 hidden md:block">
            {currentIndex + 1} / {timelineData.length} Giai đoạn
          </div>
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-amber-400"
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} className={isSpeaking ? "animate-pulse" : ""} />}
          </button>
        </div>
      </header>

      {/* Main 3D Stage */}
      <main className="flex-1 flex flex-col md:flex-row items-center justify-center p-4 md:p-12 gap-8 perspective-1000 relative">
        
        {/* Left: Image Canvas (The 3D Object) */}
        <div className="w-full md:w-3/5 h-[50vh] md:h-[70vh] flex items-center justify-center perspective-2000 relative z-10 group">
          <div 
            ref={containerRef}
            className="relative w-full h-full transition-transform duration-100 ease-out preserve-3d"
            style={{
              transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            }}
          >
            {/* The Picture Frame */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black p-2 shadow-2xl border-[8px] border-amber-900/80 rounded-sm transform-style-3d">
              {/* Inner Gold Border */}
              <div className="absolute inset-0 border border-amber-500/50 pointer-events-none z-20 m-1"></div>
              
              {/* Corner Decorations */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-amber-500 z-30 m-2"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-amber-500 z-30 m-2"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-amber-500 z-30 m-2"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-amber-500 z-30 m-2"></div>

              {/* The Image */}
              <div className="w-full h-full overflow-hidden bg-black relative">
                 <img 
                    src={currentItem.image} 
                    alt={currentItem.title}
                    className="w-full h-full object-cover opacity-90 transition-transform duration-[10s] hover:scale-110 ease-linear"
                    onError={(e) => {
                      if (currentItem.fallbackImage && e.target.src !== currentItem.fallbackImage) {
                         e.target.src = currentItem.fallbackImage;
                      } else {
                         e.target.style.display = 'none'; // Hide if both fail
                      }
                    }}
                 />
                 {/* Vignette Overlay */}
                 <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/60 pointer-events-none"></div>
              </div>

              {/* Reflection/Gloss */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none z-40"></div>
            </div>

            {/* Shadow beneath frame */}
            <div className="absolute -bottom-16 left-10 right-10 h-8 bg-black/50 blur-xl transform rotateX(60deg) z-0"></div>
          </div>
        </div>

        {/* Right: Information & Controls */}
        <div className="w-full md:w-2/5 flex flex-col justify-center space-y-6 md:pl-8 z-20">
          
          <div className="space-y-2 animate-fade-in-up">
            <span className="inline-block px-3 py-1 bg-red-900/50 border border-red-700 text-red-200 text-sm tracking-widest font-bold rounded">
              GIAI ĐOẠN {currentItem.year}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-amber-500 leading-tight drop-shadow-lg">
              {currentItem.title}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-600 to-transparent"></div>
          </div>

          <div className="relative bg-black/40 p-6 border-l-4 border-amber-700 backdrop-blur-sm shadow-inner min-h-[150px]">
            <p className="text-lg text-amber-100/90 leading-relaxed italic">
              "{currentItem.description}"
            </p>
            {isSpeaking && (
              <div className="absolute top-4 right-4 flex gap-1">
                <span className="w-1 h-4 bg-amber-500 animate-music-bar-1"></span>
                <span className="w-1 h-4 bg-amber-500 animate-music-bar-2"></span>
                <span className="w-1 h-4 bg-amber-500 animate-music-bar-3"></span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 h-16">
            {currentIndex < timelineData.length - 1 ? (
              <button
                onClick={handleNext}
                disabled={!audioEnded}
                className={`
                  flex items-center gap-3 px-8 py-3 rounded-sm font-bold tracking-wider uppercase transition-all duration-500
                  ${audioEnded 
                    ? 'bg-amber-600 text-white hover:bg-amber-500 shadow-[0_0_20px_rgba(217,119,6,0.5)] translate-y-0 opacity-100' 
                    : 'bg-gray-800 text-gray-500 cursor-not-allowed opacity-50 translate-y-2 grayscale'
                  }
                `}
              >
                Tiếp bước quân hành <ChevronRight className={audioEnded ? "animate-bounce-x" : ""} />
              </button>
            ) : (
              <button
                onClick={handleRestart}
                className="flex items-center gap-3 px-8 py-3 bg-red-800 hover:bg-red-700 text-white rounded-sm font-bold tracking-wider uppercase shadow-lg transition-all"
              >
                <RefreshCcw size={18} /> Xem lại từ đầu
              </button>
            )}
            
            {!audioEnded && (
              <span className="text-xs text-amber-500/50 animate-pulse">
                Đang thuyết minh...
              </span>
            )}
          </div>

        </div>
      </main>

      {/* Footer Timeline Dots */}
      <footer className="h-16 border-t border-amber-900/30 bg-black/60 flex items-center justify-center gap-2 overflow-x-auto px-4 w-full z-30 backdrop-blur-md">
        {timelineData.map((item, idx) => (
          <button
            key={item.id}
            onClick={() => {
              setCurrentIndex(idx);
              setAudioEnded(false);
              setRotation({ x: 0, y: 0 });
            }}
            className={`
              w-3 h-3 rounded-full transition-all duration-300 relative group
              ${idx === currentIndex ? 'bg-amber-500 scale-150 shadow-[0_0_10px_#f59e0b]' : 'bg-gray-700 hover:bg-gray-500'}
            `}
          >
             <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black/90 text-amber-100 text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">
               {item.year}
             </span>
          </button>
        ))}
      </footer>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 60s linear infinite;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        .perspective-2000 {
          perspective: 2000px;
        }
        @keyframes music-bar-1 { 0%, 100% { height: 4px; } 50% { height: 16px; } }
        @keyframes music-bar-2 { 0%, 100% { height: 8px; } 50% { height: 12px; } }
        @keyframes music-bar-3 { 0%, 100% { height: 6px; } 50% { height: 14px; } }
        
        .animate-music-bar-1 { animation: music-bar-1 0.6s ease-in-out infinite; }
        .animate-music-bar-2 { animation: music-bar-2 0.8s ease-in-out infinite; }
        .animate-music-bar-3 { animation: music-bar-3 0.7s ease-in-out infinite; }
        
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        @keyframes bounce-x {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(5px); }
        }
        .animate-bounce-x {
          animation: bounce-x 1s infinite;
        }
      `}</style>
    </div>
  );
}