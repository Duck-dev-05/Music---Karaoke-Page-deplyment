'use client';
import { FaMicrophoneAlt, FaMusic, FaHeart, FaSearch, FaTwitter, FaInstagram, FaYoutube, FaPlay, FaEnvelope, FaFire } from 'react-icons/fa';

const musicFiles = [
  "y2mate.com - Độ Mixi Hát Trường Sơn Đông Trường Sơn Tây Remix.mp3",
  "y2mate.com - Đan Nguyên Bằng Kiều Quang Lê   Đắp Mộ Cuộc Tình  PBN 126.mp3",
  "y2mate.com - mùa xuân ARIRANG karaoke.mp3",
  "y2mate.com - Way Back Home Về Nhà Thôi  SHAUN ft 20 Nghệ Sĩ Việt Nam  Gala Nhạc Việt Official MV.mp3",
  "y2mate.com - Sẽ Không Còn Nữa  Tuấn Hưng.mp3",
  "y2mate.com - STREAM ĐẾN BAO GIỜ  ĐỘ MIXI ft BẠN SÁNG TÁC OFFICIAL LYRICS VIDEO.mp3",
  "y2mate.com - RASTZ  ÔNG TRỜI LÀM TỘI ANH CHƯA  MINH HANH x QNT ft TUẤN CRY INSTRUMENTAL.mp3",
  "y2mate.com - NẮM  HƯƠNG LY  LIVE VERSION.mp3",
  "y2mate.com - Người Tình Mùa Đông  Như Quỳnh ASIA 6.mp3",
  "y2mate.com - NEU CONCERT 2022 TÌM LẠI BẦU TRỜI  TUẤN HƯNG.mp3",
  "y2mate.com - Karaoke Trường Sơn Đông  Trường Sơn Tây Remix.mp3",
  "y2mate.com - Hòa Minzy  Độ Mixi song ca Trường Sơn Đông Trường Sơn Tây remix cực cháy.mp3",
  "y2mate.com - Chiếc Đèn Ông SaoPhúc Wind Remix Official Audio Lyrics Video.mp3",
  "VAN SON  Ngày Xuân Vui Cưới  Hoài Linh.mp3",
  "UEFA Champions League Anthem Full Version.mp3",
  "Tru Mua - Umie (RiverDLove Remix) (RE-UP).mp3",
  "Super Sentai 45th Anniversary Hero Getter.mp3",
  "Ngày Xưa Ơi  Bảo Trâm  Mây Saigon.mp3",
  "Mùa Yêu  The Wall Nutszz Official Music Video.mp3",
  "Mocha Lyrics Video  The Wall Nutszz.mp3",
  "Mashup Tôi Người Việt Nam x Quê Hương Việt Nam  Nhóm Xuân Hạ Thu Đông hòa giọng cảm xúc.mp3",
  "KHÁT VỌNG TUỔI TRẺ  ---  Phương Mỹ Chi & Hoàng Dũng  Chung kết Đường lên đỉnh Olympia năm thứ 24.mp3",
  "Gánh Mẹ.mp3",
  "Gokaiger opening.mp3",
  "FAI Songs _0_1731678983417.mp3"
];

export default function Home() {
  // Split the music files for featured and favorites (for demo)
  const featuredSongs = musicFiles.slice(0, 6);
  const favoriteSongs = musicFiles.slice(6, 12);
  const trendingSongs = musicFiles.slice(12, 18);

  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 -z-10 animate-gradient bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100" />

      {/* Hero Section */}
      <div className="relative flex items-center justify-center min-h-[80vh] overflow-hidden">
        <div className="absolute inset-0 bg-black/50 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/hero-bg.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="relative z-10 flex items-center justify-center pt-6 pb-2">
          <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl p-8 max-w-xl w-full flex flex-col items-center border border-purple-100 transition-all duration-300 hover:shadow-3xl hover:scale-105">
            <div className="mb-4 relative">
              <FaMicrophoneAlt className="text-6xl text-purple-500 drop-shadow-lg animate-bounce-slow" />
              <div className="absolute -inset-4 bg-purple-500/20 rounded-full blur-xl animate-pulse"></div>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-4 text-center drop-shadow">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">Karaoke Music!</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8 text-center leading-relaxed">
              Sing, explore, and enjoy your favorite songs with friends. Discover playlists, karaoke tracks, and more!
            </p>
            <div className="flex gap-4">
              <a href="/songs" className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-lg hover:scale-105 hover:from-pink-500 hover:to-purple-500 transition-all font-bold text-lg focus:outline-none focus:ring-4 focus:ring-purple-200 animate-pulse">
                Explore Songs
              </a>
              <a href="/karaoke" className="px-8 py-3 bg-white text-purple-600 rounded-full shadow-lg hover:scale-105 transition-all font-bold text-lg focus:outline-none focus:ring-4 focus:ring-purple-200 border-2 border-purple-500">
                Start Singing
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 animate-fadeInUp">
        <div className="flex flex-col items-center bg-white/80 rounded-2xl p-8 shadow-md hover:shadow-2xl transition-all duration-300 group border border-purple-100 hover:-translate-y-2 hover:bg-white">
          <div className="relative mb-4">
            <FaMicrophoneAlt className="text-5xl text-purple-500 group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute -inset-4 bg-purple-500/10 rounded-full blur-xl group-hover:bg-purple-500/20 transition-all duration-300"></div>
          </div>
          <h2 className="font-bold text-xl mb-2 text-gray-800">Karaoke</h2>
          <p className="text-gray-600 text-center">Sing along with lyrics and backing tracks for your favorite songs.</p>
        </div>
        <div className="flex flex-col items-center bg-white/80 rounded-2xl p-8 shadow-md hover:shadow-2xl transition-all duration-300 group border border-purple-100 hover:-translate-y-2 hover:bg-white">
          <div className="relative mb-4">
            <FaMusic className="text-5xl text-pink-500 group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute -inset-4 bg-pink-500/10 rounded-full blur-xl group-hover:bg-pink-500/20 transition-all duration-300"></div>
          </div>
          <h2 className="font-bold text-xl mb-2 text-gray-800">Playlists</h2>
          <p className="text-gray-600 text-center">Create and manage playlists for every mood and occasion.</p>
        </div>
        <div className="flex flex-col items-center bg-white/80 rounded-2xl p-8 shadow-md hover:shadow-2xl transition-all duration-300 group border border-purple-100 hover:-translate-y-2 hover:bg-white">
          <div className="relative mb-4">
            <FaHeart className="text-5xl text-red-400 group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute -inset-4 bg-red-500/10 rounded-full blur-xl group-hover:bg-red-500/20 transition-all duration-300"></div>
          </div>
          <h2 className="font-bold text-xl mb-2 text-gray-800">Favorites</h2>
          <p className="text-gray-600 text-center">Save your favorite tracks and access them anytime.</p>
        </div>
        <div className="flex flex-col items-center bg-white/80 rounded-2xl p-8 shadow-md hover:shadow-2xl transition-all duration-300 group border border-purple-100 hover:-translate-y-2 hover:bg-white">
          <div className="relative mb-4">
            <FaSearch className="text-5xl text-blue-400 group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute -inset-4 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/20 transition-all duration-300"></div>
          </div>
          <h2 className="font-bold text-xl mb-2 text-gray-800">Search</h2>
          <p className="text-gray-600 text-center">Find songs, artists, and playlists quickly and easily.</p>
        </div>
      </div>

      {/* Trending Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <FaFire className="text-orange-500 animate-pulse" /> Trending Now
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {trendingSongs.map((file, idx) => (
            <div key={idx} className="group relative flex flex-col items-center bg-gradient-to-br from-orange-50 to-red-50 rounded-xl shadow-lg p-6 gap-3 hover:shadow-2xl transition-all duration-300 border border-orange-100 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="flex items-center gap-3 z-20 w-full">
                <div className="relative">
                  <FaMusic className="text-2xl text-orange-500" />
                  <div className="absolute -inset-2 bg-orange-500/10 rounded-full blur-lg group-hover:bg-orange-500/20 transition-all duration-300"></div>
                </div>
                <span className="font-semibold text-lg text-gray-800 truncate flex-1" title={file}>
                  {file.replace(/\.mp3$/, '')}
                </span>
              </div>
              <div className="flex gap-2 z-20">
                <button
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full text-sm font-medium shadow hover:scale-105 transition flex items-center gap-2"
                  onClick={e => { e.stopPropagation(); window.open(`/Music/${encodeURIComponent(file)}`, '_blank'); }}
                >
                  <FaPlay className="text-xs" /> Play
                </button>
                <button
                  className="px-4 py-2 bg-white text-orange-600 rounded-full text-sm font-medium shadow hover:scale-105 transition flex items-center gap-2 border border-orange-500"
                  onClick={e => { e.stopPropagation(); window.open(`/Music/${encodeURIComponent(file)}`, '_blank'); }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m0 0l-4-4m4 4l4-4" />
                  </svg>
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Songs Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <FaMusic className="text-pink-500" /> Featured Songs
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {featuredSongs.map((file, idx) => (
            <div key={idx} className="group relative flex flex-col items-center bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-lg p-6 gap-3 hover:shadow-2xl transition-all duration-300 border border-purple-100 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="flex items-center gap-3 z-20 w-full">
                <div className="relative">
                  <FaMusic className="text-2xl text-pink-500" />
                  <div className="absolute -inset-2 bg-pink-500/10 rounded-full blur-lg group-hover:bg-pink-500/20 transition-all duration-300"></div>
                </div>
                <span className="font-semibold text-lg text-gray-800 truncate flex-1" title={file}>
                  {file.replace(/\.mp3$/, '')}
                </span>
              </div>
              <div className="flex gap-2 z-20">
                <button
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-medium shadow hover:scale-105 transition flex items-center gap-2"
                  onClick={e => { e.stopPropagation(); window.open(`/Music/${encodeURIComponent(file)}`, '_blank'); }}
                >
                  <FaPlay className="text-xs" /> Play
                </button>
                <button
                  className="px-4 py-2 bg-white text-purple-600 rounded-full text-sm font-medium shadow hover:scale-105 transition flex items-center gap-2 border border-purple-500"
                  onClick={e => { e.stopPropagation(); window.open(`/Music/${encodeURIComponent(file)}`, '_blank'); }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m0 0l-4-4m4 4l4-4" />
                  </svg>
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="relative z-10 flex flex-col items-center text-center">
            <FaEnvelope className="text-5xl text-white mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
            <p className="text-white/90 text-lg mb-8 max-w-2xl">
              Subscribe to our newsletter to get the latest updates on new songs, features, and exclusive content.
            </p>
            <div className="flex gap-4 w-full max-w-md">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/40"
              />
              <button className="px-8 py-3 bg-white text-purple-600 rounded-full font-bold hover:scale-105 transition-all">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full bg-white/95 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">About Us</h3>
              <p className="text-gray-600">Your ultimate destination for karaoke music and entertainment.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="/" className="text-gray-600 hover:text-purple-600 transition">Home</a></li>
                <li><a href="/songs" className="text-gray-600 hover:text-purple-600 transition">Songs</a></li>
                <li><a href="/karaoke" className="text-gray-600 hover:text-purple-600 transition">Karaoke</a></li>
                <li><a href="/playlists" className="text-gray-600 hover:text-purple-600 transition">Playlists</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="/help" className="text-gray-600 hover:text-purple-600 transition">Help Center</a></li>
                <li><a href="/contact" className="text-gray-600 hover:text-purple-600 transition">Contact Us</a></li>
                <li><a href="/faq" className="text-gray-600 hover:text-purple-600 transition">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">Connect</h3>
              <div className="flex space-x-4">
                <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-blue-400 transition">
                  <FaTwitter size={24} />
                </a>
                <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-pink-500 transition">
                  <FaInstagram size={24} />
                </a>
                <a href="#" aria-label="YouTube" className="text-gray-400 hover:text-red-500 transition">
                  <FaYoutube size={24} />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-600 text-sm mb-4 md:mb-0">
                © {new Date().getFullYear()} Karaoke Music. All rights reserved.
              </div>
              <div className="flex space-x-6">
                <a href="/privacy" className="text-gray-600 hover:text-purple-600 transition text-sm">Privacy Policy</a>
                <a href="/terms" className="text-gray-600 hover:text-purple-600 transition text-sm">Terms of Service</a>
                <a href="/cookies" className="text-gray-600 hover:text-purple-600 transition text-sm">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Custom Animated Gradient */}
      <style>{`
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradientMove 8s ease-in-out infinite;
        }
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-bounce-slow {
          animation: bounce 3s infinite;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
} 