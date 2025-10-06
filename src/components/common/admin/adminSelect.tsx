// import { useState, useEffect, useRef } from "react";
// import {
//   ChevronRight,
//   Star,
//   Sparkles,
//   ArrowLeft,
//   ExternalLink,
//   Zap,
//   TrendingUp,
//   Globe,
// } from "lucide-react";

// export default function MentoonsAdminPanel() {
//   const [showAdminPanel, setShowAdminPanel] = useState(false);
//   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
//   const [activeHover, setActiveHover] = useState(null);
//   const audioRef = useRef(null);

//   useEffect(() => {
//     const handleMouseMove = (e) => {
//       setMousePosition({ x: e.clientX, y: e.clientY });
//     };
//     window.addEventListener("mousemove", handleMouseMove);
//     return () => window.removeEventListener("mousemove", handleMouseMove);
//   }, []);

//   const playHoverSound = () => {
//     if (audioRef.current) {
//       audioRef.current.currentTime = 0;
//       audioRef.current
//         .play()
//         .catch((e) => console.log("Audio play failed:", e));
//     }
//   };

//   const adminOptions = [
//     {
//       id: "mentoons",
//       title: "Mentoons",
//       description: "Manage users, subscription, products, podcasts",
//       logo: "https://mentoons-website.s3.ap-northeast-1.amazonaws.com/logo/ec9141ccd046aff5a1ffb4fe60f79316.png",
//       color: "from-blue-500 via-indigo-500 to-purple-600",
//       hoverColor:
//         "hover:from-blue-600 hover:via-indigo-600 hover:to-purple-700",
//       shadowColor: "shadow-blue-500/25",
//       hoverShadow: "hover:shadow-blue-500/50",
//       accent: "bg-blue-400",
//       glowColor: "shadow-blue-500/30",
//       icon: Globe,
//     },
//     {
//       id: "mythos",
//       title: "Mentoons Mythos",
//       description:
//         "Manage astrology-related user details, horoscope data, and personalize content based on zodiac insights",
//       logo: "https://mentoonsmythos.com/assets/logo/image%202.png",
//       color: "from-purple-500 via-pink-500 to-rose-600",
//       hoverColor: "hover:from-purple-600 hover:via-pink-600 hover:to-rose-700",
//       shadowColor: "shadow-purple-500/25",
//       hoverShadow: "hover:shadow-purple-500/50",
//       accent: "bg-purple-400",
//       glowColor: "shadow-purple-500/30",
//       icon: Sparkles,
//     },
//     {
//       id: "news",
//       title: "Mentoons News",
//       description:
//         "View and publish daily news, stories, and updates curated for kids, teens, adults, and parents",
//       logo: "text",
//       color: "from-emerald-500 via-teal-500 to-cyan-600",
//       hoverColor: "hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-700",
//       shadowColor: "shadow-emerald-500/25",
//       hoverShadow: "hover:shadow-emerald-500/50",
//       accent: "bg-emerald-400",
//       glowColor: "shadow-emerald-500/30",
//       fontFamily: "font-serif",
//       textColor: "text-gray-900",
//       isNews: true,
//       icon: TrendingUp,
//     },
//   ];

//   const handleOptionClick = (optionId) => {
//     console.log(`Navigating to ${optionId}`);
//     // Add smooth transition effect before navigation
//     setTimeout(() => {
//       // Navigate to the selected section
//     }, 300);
//   };

//   if (!showAdminPanel) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
//         {/* Audio element for hover sounds */}
//         <audio
//           ref={audioRef}
//           src="https://assets.mixkit.co/sfx/preview/mixkit-select-click-1109.mp3"
//         />

//         {/* Enhanced Animated Background Elements */}
//         <div className="absolute inset-0">
//           {[...Array(30)].map((_, i) => (
//             <div
//               key={i}
//               className={`absolute w-1 h-1 bg-white rounded-full opacity-40 animate-pulse`}
//               style={{
//                 left: `${Math.random() * 100}%`,
//                 top: `${Math.random() * 100}%`,
//                 animationDelay: `${Math.random() * 4}s`,
//                 animationDuration: `${2 + Math.random() * 3}s`,
//               }}
//             />
//           ))}
//         </div>

//         {/* Enhanced Mouse Follower Effect */}
//         <div
//           className="fixed w-[500px] h-[500px] pointer-events-none z-0"
//           style={{
//             left: mousePosition.x - 250,
//             top: mousePosition.y - 250,
//             background:
//               "radial-gradient(circle, rgba(147, 51, 234, 0.15) 0%, rgba(59, 130, 246, 0.1) 50%, transparent 80%)",
//             transition: "all 0.3s ease",
//           }}
//         />

//         <div className="text-center relative z-10 max-w-5xl">
//           {/* Enhanced Welcome Section */}
//           <div className="mb-20 relative">
//             <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full blur-3xl opacity-25 animate-pulse scale-150"></div>
//             <div className="relative">
//               <div className="flex justify-center mb-12">
//                 <div className="relative">
//                   <div className="absolute -inset-6 bg-yellow-400 rounded-full opacity-25 blur-2xl animate-ping-slow"></div>
//                   <div className="absolute -inset-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-30 blur-xl animate-pulse"></div>
//                   <Star className="w-28 h-28 text-yellow-400 animate-spin-slow relative z-10" />
//                   <Sparkles className="w-12 h-12 text-pink-400 absolute -top-3 -right-3 animate-pulse" />
//                   <Zap className="w-8 h-8 text-cyan-400 absolute -bottom-2 -left-2 animate-bounce" />
//                 </div>
//               </div>

//               <h1 className="text-7xl md:text-9xl lg:text-[12rem] font-black bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent mb-8 tracking-tight drop-shadow-2xl leading-none">
//                 Mentoons
//               </h1>
//             </div>
//           </div>

//           {/* Enhanced Enter Button */}
//           <div className="relative group mb-16">
//             <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-full blur-lg opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
//             <button
//               onClick={() => setShowAdminPanel(true)}
//               onMouseEnter={playHoverSound}
//               className="relative px-16 py-8 bg-gradient-to-r from-orange-400 via-amber-500 to-yellow-500 hover:from-orange-300 hover:via-amber-400 hover:to-yellow-400 text-white font-bold text-2xl rounded-full shadow-2xl transform hover:scale-110 transition-all duration-500 ease-out border-2 border-white/20 group"
//             >
//               <div className="absolute inset-0 bg-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//               <div className="relative flex items-center gap-6">
//                 <Sparkles className="w-8 h-8 animate-pulse text-yellow-100" />
//                 Enter Admin Portal
//                 <ChevronRight className="w-8 h-8 group-hover:translate-x-3 transition-transform duration-300 text-yellow-100" />
//               </div>
//             </button>
//           </div>

//           {/* Enhanced Floating Elements */}
//           <div className="absolute top-20 left-20 w-8 h-8 bg-gradient-to-r from-pink-400 to-red-400 rounded-full animate-bounce opacity-70"></div>
//           <div className="absolute top-40 right-24 w-6 h-6 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-pulse opacity-70"></div>
//           <div className="absolute bottom-32 left-24 w-7 h-7 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-ping opacity-70"></div>
//           <div className="absolute bottom-48 right-20 w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-bounce opacity-70"></div>
//           <div className="absolute top-1/3 left-12 w-4 h-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-spin-slow opacity-60"></div>
//           <div className="absolute bottom-1/3 right-12 w-6 h-6 bg-gradient-to-r from-indigo-400 to-blue-400 rounded-full animate-pulse opacity-60"></div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 p-6 relative overflow-hidden">
//       {/* Audio element for hover sounds */}
//       <audio
//         ref={audioRef}
//         src="https://assets.mixkit.co/sfx/preview/mixkit-select-click-1109.mp3"
//       />

//       {/* Enhanced Animated Background */}
//       <div className="absolute inset-0 opacity-30">
//         <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-blob"></div>
//         <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-blob animation-delay-2000"></div>
//         <div className="absolute bottom-20 left-40 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-blob animation-delay-4000"></div>
//         <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-6000"></div>
//       </div>

//       <div className="max-w-7xl mx-auto relative z-10">
//         {/* Simplified Header */}
//         <div className="flex justify-center items-center mb-16">
//           <button
//             onClick={() => setShowAdminPanel(false)}
//             className="group flex items-center gap-4 px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white rounded-3xl transition-all duration-500 border-2 border-white/20 hover:border-white/40 shadow-2xl hover:shadow-white/10"
//             onMouseEnter={playHoverSound}
//           >
//             <ArrowLeft className="w-6 h-6 group-hover:-translate-x-2 transition-transform duration-300" />
//             <span className="font-semibold text-lg">Back to Welcome</span>
//           </button>
//         </div>

//         {/* Enhanced Main Header */}
//         <div className="text-center mb-20">
//           <div className="inline-flex items-center gap-4 mb-8 relative">
//             <div className="absolute -inset-6 bg-blue-500/20 rounded-full blur-2xl animate-pulse"></div>
//             <Star className="w-12 h-12 text-yellow-400 animate-spin-slow relative z-10" />
//             <h1 className="text-6xl md:text-8xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent relative z-10">
//               Admin Portal
//             </h1>
//             <Sparkles className="w-12 h-12 text-pink-400 animate-pulse relative z-10" />
//           </div>
//           <div className="max-w-3xl mx-auto">
//             <p className="text-2xl text-gray-300 font-light mb-4">
//               Comprehensive Management Dashboard
//             </p>
//           </div>
//         </div>

//         {/* Enhanced Admin Options with Larger Logos */}
//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 mb-20">
//           {adminOptions.map((option, index) => (
//             <div
//               key={option.id}
//               onMouseEnter={() => {
//                 setActiveHover(option.id);
//                 playHoverSound();
//               }}
//               onMouseLeave={() => setActiveHover(null)}
//               onClick={() => handleOptionClick(option.id)}
//               className={`group relative bg-gradient-to-br ${option.color} ${option.hoverColor} p-10 rounded-3xl shadow-2xl ${option.shadowColor} ${option.hoverShadow} cursor-pointer transform hover:scale-105 hover:-translate-y-3 transition-all duration-700 ease-out overflow-hidden border-2 border-white/20 hover:border-white/40`}
//               style={{
//                 animationDelay: `${index * 300}ms`,
//               }}
//             >
//               {/* Enhanced Animated Border */}
//               <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700">
//                 <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-white/0 via-white/30 to-white/0 animate-shimmer"></div>
//               </div>

//               {/* Enhanced Glow Effect */}
//               <div
//                 className={`absolute -inset-2 ${option.glowColor} rounded-3xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-700`}
//               ></div>

//               {/* Content */}
//               <div className="relative z-10 h-full flex flex-col">
//                 {/* Enhanced Icon/Logo Section - Much Larger */}
//                 <div className="mb-8 transform group-hover:scale-110 transition-transform duration-700">
//                   {option.logo === "text" ? (
//                     <div
//                       className={`${option.fontFamily} ${
//                         option.textColor || "text-white"
//                       } text-5xl font-bold flex items-center justify-center h-32 relative`}
//                     >
//                       <div className="absolute inset-0 bg-white/10 rounded-3xl backdrop-blur-sm border border-white/20"></div>
//                       <span className="relative">MENTOONS NEWS</span>
//                     </div>
//                   ) : (
//                     <div className="relative flex justify-center">
//                       <div
//                         className={`absolute inset-0 ${option.accent} rounded-3xl blur-2xl opacity-40 group-hover:opacity-70 transition-opacity duration-500 scale-110`}
//                       ></div>
//                       <img
//                         src={option.logo}
//                         alt={`${option.title} Logo`}
//                         className="relative w-32 h-32 object-contain bg-white/20 backdrop-blur-sm rounded-3xl p-6 border-2 border-white/30 shadow-2xl group-hover:shadow-white/20 transition-all duration-500"
//                       />
//                     </div>
//                   )}
//                 </div>

//                 {/* Enhanced Title with Icon */}
//                 <div className="flex items-center gap-3 mb-4">
//                   <option.icon
//                     className={`w-8 h-8 ${option.textColor || "text-white/80"}`}
//                   />
//                   <h3
//                     className={`text-3xl font-bold ${
//                       option.isNews && option.fontFamily
//                         ? option.fontFamily
//                         : ""
//                     } ${option.textColor || "text-white"}`}
//                   >
//                     {option.title}
//                   </h3>
//                 </div>

//                 {/* Enhanced Description */}
//                 <p
//                   className={`mb-8 leading-relaxed flex-grow text-lg ${
//                     option.isNews && option.fontFamily ? option.fontFamily : ""
//                   } ${option.textColor ? "text-gray-700" : "text-white/90"}`}
//                 >
//                   {option.description}
//                 </p>

//                 {/* Enhanced Action Button */}
//                 <div className="flex items-center justify-between mt-auto p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 group-hover:bg-white/20 transition-all duration-300">
//                   <span
//                     className={`font-bold text-lg ${
//                       option.textColor || "text-white/90"
//                     } group-hover:${
//                       option.textColor || "text-white"
//                     } transition-colors duration-300`}
//                   >
//                     Launch Dashboard
//                   </span>
//                   <div
//                     className={`p-3 rounded-full ${
//                       option.textColor ? "bg-gray-800/30" : "bg-white/30"
//                     } group-hover:${
//                       option.textColor ? "bg-gray-800/50" : "bg-white/50"
//                     } transition-all duration-300 group-hover:scale-125 group-hover:rotate-12`}
//                   >
//                     <ExternalLink
//                       className={`w-6 h-6 ${option.textColor || "text-white"}`}
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Enhanced Corner Accents */}
//               <div
//                 className={`absolute top-6 right-6 w-4 h-4 ${option.accent} rounded-full opacity-60 group-hover:opacity-100 group-hover:scale-200 transition-all duration-500`}
//               ></div>
//               <div
//                 className={`absolute bottom-6 left-6 w-3 h-3 ${option.accent} rounded-full opacity-40 group-hover:opacity-80 group-hover:scale-150 transition-all duration-700 delay-100`}
//               ></div>
//             </div>
//           ))}
//         </div>
//       </div>

//       <style>{`
//         @keyframes blob {
//           0% {
//             transform: translate(0px, 0px) scale(1);
//           }
//           33% {
//             transform: translate(30px, -50px) scale(1.1);
//           }
//           66% {
//             transform: translate(-20px, 20px) scale(0.9);
//           }
//           100% {
//             transform: translate(0px, 0px) scale(1);
//           }
//         }
//         @keyframes shimmer {
//           0% {
//             transform: translateX(-100%);
//           }
//           100% {
//             transform: translateX(100%);
//           }
//         }
//         @keyframes spin-slow {
//           from {
//             transform: rotate(0deg);
//           }
//           to {
//             transform: rotate(360deg);
//           }
//         }
//         @keyframes ping-slow {
//           0% {
//             transform: scale(0.8);
//             opacity: 0.8;
//           }
//           75%, 100% {
//             transform: scale(2.8);
//             opacity: 0;
//           }
//         }
//         @keyframes tilt {
//           0%, 50%, 100% {
//             transform: rotate(0deg);
//           }
//           25% {
//             transform: rotate(1deg);
//           }
//           75% {
//             transform: rotate(-1deg);
//           }
//         }
//         .animate-blob {
//           animation: blob 8s infinite;
//         }
//         .animation-delay-2000 {
//           animation-delay: 2s;
//         }
//         .animation-delay-4000 {
//           animation-delay: 4s;
//         }
//         .animation-delay-6000 {
//           animation-delay: 6s;
//         }
//         .animate-shimmer {
//           animation: shimmer 2.5s infinite;
//         }
//         .animate-spin-slow {
//           animation: spin-slow 4s linear infinite;
//         }
//         .animate-ping-slow {
//           animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
//         }
//         .animate-tilt {
//           animation: tilt 10s ease-in-out infinite;
//         }
//       `}</style>
//     </div>
//   );
// }
