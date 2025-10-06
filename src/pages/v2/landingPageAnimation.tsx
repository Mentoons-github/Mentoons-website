// import { useState, useEffect, useRef } from "react";
// import { gsap } from "gsap";

// // Interfaces for type safety
// interface Particle {
//   id: number;
//   x: number;
//   y: number;
//   size: number;
//   speedX: number;
//   speedY: number;
//   color: string;
//   opacity: number;
// }

// interface MorphingShape {
//   colors: string[];
//   size: string;
//   position: string;
//   morphDelay: string;
// }

// interface InteractiveItem {
//   emoji: string;
//   label: string;
//   color: string;
// }

// interface LandingAnimationProps {
//   onComplete: () => void;
// }

// // Constants
// const PARTICLE_COUNT = 50;
// const ANIMATION_PHASES = 5;
// const PHASE_DURATIONS = [200, 800, 1400, 2000, 2600];
// const COLORS = ["orange", "yellow", "red", "green", "white"];

// const LandingAnimation: React.FC<LandingAnimationProps> = ({ onComplete }) => {
//   const [isVisible, setIsVisible] = useState<boolean>(true);
//   const [animationPhase, setAnimationPhase] = useState<number>(0);
//   const [particles, setParticles] = useState<Particle[]>([]);
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const animationRef = useRef<number>();

//   useEffect(() => {
//     const generateParticles = (): Particle[] => {
//       return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
//         id: i,
//         x: Math.random() * window.innerWidth,
//         y: Math.random() * window.innerHeight,
//         size: Math.random() * 4 + 2,
//         speedX: (Math.random() - 0.5) * 2,
//         speedY: (Math.random() - 0.5) * 2,
//         color: COLORS[Math.floor(Math.random() * COLORS.length)],
//         opacity: Math.random() * 0.8 + 0.2,
//       }));
//     };

//     setParticles(generateParticles());

//     const handleResize = () => {
//       setParticles(generateParticles());
//     };

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   useEffect(() => {
//     setIsVisible(true);

//     const phaseTimers = PHASE_DURATIONS.map((delay, index) =>
//       setTimeout(() => setAnimationPhase(index + 1), delay)
//     );

//     const hideTimer = setTimeout(() => {
//       setIsVisible(false);
//       onComplete();
//     }, 5000);

//     return () => {
//       phaseTimers.forEach(clearTimeout);
//       clearTimeout(hideTimer);
//     };
//   }, [onComplete]);

//   useEffect(() => {
//     if (!canvasRef.current) return;

//     const ctx = canvasRef.current.getContext("2d");
//     if (!ctx) return;

//     canvasRef.current.width = window.innerWidth;
//     canvasRef.current.height = window.innerHeight;

//     const animateParticles = () => {
//       ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

//       particles.forEach((particle) => {
//         ctx.beginPath();
//         ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
//         ctx.fillStyle = particle.color;
//         ctx.globalAlpha = particle.opacity;
//         ctx.fill();

//         particle.x += particle.speedX;
//         particle.y += particle.speedY;

//         if (particle.x < 0 || particle.x > window.innerWidth)
//           particle.speedX *= -1;
//         if (particle.y < 0 || particle.y > window.innerHeight)
//           particle.speedY *= -1;
//       });

//       animationRef.current = requestAnimationFrame(animateParticles);
//     };

//     animationRef.current = requestAnimationFrame(animateParticles);

//     return () => {
//       if (animationRef.current) cancelAnimationFrame(animationRef.current);
//     };
//   }, [particles]);

//   useEffect(() => {
//     gsap.to(".morph-shape", {
//       borderRadius: ["50%", "25% 75% 75% 25%", "75% 25% 25% 75%"],
//       scale: [1, 1.1, 0.9],
//       rotation: 360,
//       duration: 3,
//       repeat: -1,
//       ease: "power2.inOut",
//       stagger: 0.5,
//     });

//     gsap.to(".interactive-item", {
//       y: -10,
//       duration: 0.5,
//       repeat: -1,
//       yoyo: true,
//       ease: "power1.inOut",
//       stagger: 0.1,
//     });
//   }, []);

//   const morphingShapes: MorphingShape[] = [
//     {
//       colors: ["from-orange-400", "to-yellow-500"],
//       size: "w-24 h-24",
//       position: "top-16 left-16",
//       morphDelay: "0s",
//     },
//     {
//       colors: ["from-red-500", "to-orange-400"],
//       size: "w-32 h-32",
//       position: "top-20 right-20",
//       morphDelay: "0.5s",
//     },
//     {
//       colors: ["from-green-400", "to-yellow-300"],
//       size: "w-20 h-20",
//       position: "bottom-24 left-24",
//       morphDelay: "1s",
//     },
//     {
//       colors: ["from-yellow-400", "to-red-400"],
//       size: "w-28 h-28",
//       position: "bottom-20 right-16",
//       morphDelay: "1.5s",
//     },
//   ];

//   const interactiveItems: InteractiveItem[] = [
//     { emoji: "📱", label: "Mobile", color: "from-orange-400 to-red-400" },
//     { emoji: "💻", label: "Desktop", color: "from-yellow-400 to-orange-400" },
//     { emoji: "🎮", label: "Gaming", color: "from-green-400 to-yellow-400" },
//     { emoji: "🎨", label: "Creative", color: "from-red-400 to-yellow-400" },
//     { emoji: "🌟", label: "Innovation", color: "from-white to-yellow-200" },
//   ];

//   if (!isVisible) return null;

//   return (
//     <div className="fixed inset-0 z-50 overflow-hidden bg-black">
//       <canvas ref={canvasRef} className="absolute inset-0" />

//       <div
//         className="absolute inset-0 transition-all duration-1000"
//         style={{
//           background: `
//             radial-gradient(circle at 20% 80%, rgba(255, 165, 0, 0.8) 0%, transparent 50%),
//             radial-gradient(circle at 80% 20%, rgba(255, 255, 0, 0.8) 0%, transparent 50%),
//             radial-gradient(circle at 40% 40%, rgba(255, 0, 0, 0.6) 0%, transparent 50%),
//             linear-gradient(135deg, #ff6b35 0%, #f7931e 25%, #ffd23f 50%, #06ffa5 75%, #ffffff 100%)
//           `,
//           animation: "gradientShift 4s ease-in-out infinite",
//         }}
//       />

//       <div
//         className="absolute inset-0 opacity-20"
//         style={{
//           backgroundImage: `
//             radial-gradient(circle at 25% 25%, rgba(255,255,255,0.3) 2px, transparent 2px),
//             radial-gradient(circle at 75% 75%, rgba(255,255,255,0.2) 1px, transparent 1px)
//           `,
//           backgroundSize: "60px 60px, 40px 40px",
//           animation: "meshMove 8s linear infinite",
//         }}
//       />

//       {morphingShapes.map((shape, index) => (
//         <div
//           key={index}
//           className={`absolute morph-shape ${shape.size} ${shape.position} opacity-80`}
//           style={{
//             animation: `morph 3s ease-in-out infinite ${shape.morphDelay}`,
//           }}
//         >
//           <div
//             className={`w-full h-full bg-gradient-to-r ${shape.colors[0]} ${shape.colors[1]} rounded-full shadow-2xl`}
//             style={{ filter: "blur(1px)" }}
//           />
//         </div>
//       ))}

//       <div className="absolute inset-0 flex items-center justify-center">
//         {[1, 2, 3].map((ring) => (
//           <div
//             key={ring}
//             className="absolute rounded-full border-2"
//             style={{
//               width: `${ring * 300}px`,
//               height: `${ring * 300}px`,
//               borderColor: `rgba(255, 255, 255, ${0.3 / ring})`,
//               animation: `ripple 4s ease-out infinite ${ring * 0.5}s`,
//             }}
//           />
//         ))}
//       </div>

//       <div className="relative z-10 flex items-center justify-center min-h-screen px-4 RBFXsm:px-8">
//         <div className="text-center max-w-5xl">
//           <div
//             className={`mb-8 transition-all duration-1000 transform ${
//               animationPhase >= 1
//                 ? "scale-100 opacity-100 rotate-0"
//                 : "scale-0 opacity-0 rotate-180"
//             }`}
//           >
//             <div className="relative inline-block">
//               <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-r from-white to-yellow-200 rounded-full flex items-center justify-center shadow-2xl">
//                 <span
//                   className="text-4xl animate-pulse"
//                   role="img"
//                   aria-label="Lightning bolt"
//                 >
//                   ⚡
//                 </span>
//               </div>
//               <div className="absolute -inset-4 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full blur-xl opacity-50 animate-ping" />
//             </div>
//           </div>

//           <div className="mb-6 relative">
//             <h1
//               className={`text-5xl RBFXsm:text-7xl md:text-9xl font-black transition-all duration-1000 transform ${
//                 animationPhase >= 2
//                   ? "translate-y-0 opacity-100 scale-100"
//                   : "translate-y-12 opacity-0 scale-90"
//               }`}
//               style={{
//                 background:
//                   "linear-gradient(45deg, #ff6b35, #f7931e, #ffd23f, #06ffa5, #ffffff)",
//                 WebkitBackgroundClip: "text",
//                 WebkitTextFillColor: "transparent",
//                 backgroundClip: "text",
//                 backgroundSize: "300% 300%",
//                 animation: "gradientText 3s ease-in-out infinite",
//                 textShadow:
//                   "0 0 40px rgba(255,255,255,0.5), 0 0 80px rgba(255,255,255,0.3)",
//                 filter:
//                   "drop-shadow(4px 4px 0px rgba(0,0,0,0.3)) drop-shadow(8px 8px 0px rgba(255,255,255,0.1))",
//               }}
//             >
//               WELCOME
//             </h1>

//             {animationPhase >= 2 && (
//               <div className="absolute inset-0">
//                 {[...Array(8)].map((_, i) => (
//                   <div
//                     key={i}
//                     className="absolute w-2 h-2 bg-white rounded-full opacity-80"
//                     style={{
//                       left: `${Math.random() * 100}%`,
//                       top: `${Math.random() * 100}%`,
//                       animation: `sparkle 2s ease-in-out infinite ${
//                         Math.random() * 2
//                       }s`,
//                     }}
//                   />
//                 ))}
//               </div>
//             )}
//           </div>

//           <div
//             className={`mb-6 transition-all duration-1000 delay-300 transform ${
//               animationPhase >= 3
//                 ? "translate-y-0 opacity-100"
//                 : "translate-y-8 opacity-0"
//             }`}
//           >
//             <p className="text-xl RBFXsm:text-3xl md:text-5xl font-bold text-white leading-tight">
//               Hey there,{" "}
//               <span
//                 className="inline-block px-4 py-2 bg-gradient-to-r from-orange-400 to-yellow-400 text-black rounded-full transform hover:scale-110 transition-transform shadow-lg"
//                 style={{ animation: "bounce 2s infinite 0.5s" }}
//               >
//                 teenagers
//               </span>
//               ,{" "}
//               <span
//                 className="inline-block px-4 py-2 bg-gradient-to-r from-red-400 to-orange-400 text-white rounded-full transform hover:scale-110 transition-transform shadow-lg"
//                 style={{ animation: "bounce 2s infinite 1s" }}
//               >
//                 parents
//               </span>{" "}
//               & amazing{" "}
//               <span
//                 className="inline-block px-4 py-2 bg-gradient-to-r from-green-400 to-yellow-300 text-black rounded-full transform hover:scale-110 transition-transform shadow-lg"
//                 style={{ animation: "bounce 2s infinite 1.5s" }}
//               >
//                 tech-users
//               </span>
//               !
//             </p>
//           </div>

//           <div
//             className={`mb-8 transition-all duration-1000 delay-500 transform ${
//               animationPhase >= 4
//                 ? "translate-y-0 opacity-100"
//                 : "translate-y-8 opacity-0"
//             }`}
//           >
//             <p className="text-lg RBFXsm:text-xl md:text-2xl text-white font-medium max-w-3xl mx-auto leading-relaxed">
//               🚀 Ready to dive into the most incredible tech experience?
//               <br />
//               <span className="text-yellow-200 font-bold">
//                 Let's revolutionize the digital world together!
//               </span>
//             </p>
//           </div>

//           <div
//             className={`flex flex-wrap justify-center gap-6 transition-all duration-1000 delay-700 transform ${
//               animationPhase >= 5
//                 ? "translate-y-0 opacity-100 scale-100"
//                 : "translate-y-8 opacity-0 scale-90"
//             }`}
//           >
//             {interactiveItems.map((item, index) => (
//               <div
//                 key={index}
//                 className={`group cursor-pointer interactive-item transform transition-all duration-300 hover:scale-125 focus:scale-125 focus:outline-none`}
//                 style={{ animationDelay: `${index * 0.2}s` }}
//                 tabIndex={0}
//                 role="button"
//                 aria-label={`Explore ${item.label}`}
//               >
//                 <div
//                   className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-xl group-hover:shadow-2xl group-focus:shadow-2xl transition-all duration-300`}
//                 >
//                   <span
//                     className="text-3xl group-hover:animate-bounce group-focus:animate-bounce"
//                     role="img"
//                     aria-label={item.label}
//                   >
//                     {item.emoji}
//                   </span>
//                 </div>
//                 <p className="text-white text-sm font-semibold mt-2 group-hover:text-yellow-200 group-focus:text-yellow-200 transition-colors">
//                   {item.label}
//                 </p>
//               </div>
//             ))}
//           </div>

//           <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
//             <div className="w-80 h-2 bg-white/20 rounded-full overflow-hidden shadow-lg">
//               <div
//                 className="h-full bg-gradient-to-r from-orange-400 via-yellow-400 to-green-400 rounded-full shadow-lg"
//                 style={{ animation: "progressBar 4s ease-out forwards" }}
//               />
//             </div>
//             <p className="text-white text-sm mt-2 opacity-80">
//               Loading amazing experience...
//             </p>
//           </div>
//         </div>
//       </div>

//       <style>{`
//         @keyframes gradientShift {
//           0%,
//           100% {
//             filter: hue-rotate(0deg) brightness(1);
//           }
//           25% {
//             filter: hue-rotate(90deg) brightness(1.2);
//           }
//           50% {
//             filter: hue-rotate(180deg) brightness(1.1);
//           }
//           75% {
//             filter: hue-rotate(270deg) brightness(1.3);
//           }
//         }

//         @keyframes meshMove {
//           0% {
//             transform: translate(0, 0) rotate(0deg);
//           }
//           100% {
//             transform: translate(20px, 20px) rotate(360deg);
//           }
//         }

//         @keyframes morph {
//           0%,
//           100% {
//             border-radius: 50%;
//             transform: rotate(0deg) scale(1);
//           }
//           25% {
//             border-radius: 25% 75% 75% 25%;
//             transform: rotate(90deg) scale(1.1);
//           }
//           50% {
//             border-radius: 75% 25% 25% 75%;
//             transform: rotate(180deg) scale(0.9);
//           }
//           75% {
//             border-radius: 25% 75% 25% 75%;
//             transform: rotate(270deg) scale(1.2);
//           }
//         }

//         @keyframes ripple {
//           0% {
//             transform: scale(0.1);
//             opacity: 0.8;
//           }
//           50% {
//             opacity: 0.4;
//           }
//           100% {
//             transform: scale(1);
//             opacity: 0;
//           }
//         }

//         @keyframes gradientText {
//           0%,
//           100% {
//             background-position: 0% 50%;
//           }
//           50% {
//             background-position: 100% 50%;
//           }
//         }

//         @keyframes sparkle {
//           0%,
//           100% {
//             opacity: 0;
//             transform: scale(0) rotate(0deg);
//           }
//           50% {
//             opacity: 1;
//             transform: scale(1) rotate(180deg);
//           }
//         }

//         @keyframes progressBar {
//           0% {
//             width: 0%;
//           }
//           100% {
//             width: 100%;
//           }
//         }

//         @keyframes bounce {
//           0%,
//           100% {
//             transform: translateY(0);
//           }
//           50% {
//             transform: translateY(-10px);
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default LandingAnimation;
