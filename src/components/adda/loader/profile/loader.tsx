import {
  User,
  Image,
  FileText,
  Award,
  Bookmark,
  Settings,
  Sparkles,
  Heart,
  MessageCircle,
  Share2,
} from "lucide-react";
import { useEffect, useState } from "react";

const FloatingParticles = () => {
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    delay: Math.random() * 4,
    duration: Math.random() * 3 + 2,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-gradient-to-r from-orange-400 to-pink-400 opacity-20"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}
    </div>
  );
};

const AnimatedLogo = () => {
  return (
    <div className="relative">
      {/* Main logo container with rotation */}
      <div className="w-24 h-24 relative animate-spin-slow">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-4 border-gradient-to-r from-orange-500 via-pink-500 to-purple-500 animate-pulse">
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 animate-breathe">
            {/* Inner content */}
            <div className="flex items-center justify-center h-full">
              <User className="w-8 h-8 text-white animate-bounce" />
            </div>
          </div>
        </div>

        {/* Orbiting elements */}
        <div className="absolute inset-0 animate-spin-reverse">
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
            <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-bounce delay-0">
              <Heart className="w-3 h-3 text-white m-0.5" />
            </div>
          </div>
          <div className="absolute top-1/2 -right-2 transform -translate-y-1/2">
            <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-bounce delay-150">
              <MessageCircle className="w-3 h-3 text-white m-0.5" />
            </div>
          </div>
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
            <div className="w-4 h-4 bg-gradient-to-r from-purple-400 to-violet-400 rounded-full animate-bounce delay-300">
              <Share2 className="w-3 h-3 text-white m-0.5" />
            </div>
          </div>
          <div className="absolute top-1/2 -left-2 transform -translate-y-1/2">
            <div className="w-4 h-4 bg-gradient-to-r from-red-400 to-pink-400 rounded-full animate-bounce delay-450">
              <Sparkles className="w-3 h-3 text-white m-0.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Pulse rings */}
      <div className="absolute inset-0 rounded-full border-2 border-orange-300 animate-ping opacity-20"></div>
      <div className="absolute inset-2 rounded-full border-2 border-pink-300 animate-ping opacity-20 animation-delay-500"></div>
    </div>
  );
};

const LoadingSteps = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
    {
      icon: User,
      text: "Initializing profile",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Image,
      text: "Loading media content",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: FileText,
      text: "Fetching posts",
      color: "from-purple-500 to-violet-500",
    },
    {
      icon: Award,
      text: "Calculating achievements",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: Bookmark,
      text: "Syncing saved items",
      color: "from-pink-500 to-rose-500",
    },
    {
      icon: Settings,
      text: "Finalizing setup",
      color: "from-indigo-500 to-blue-500",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      {steps.map((step, index) => {
        const StepIcon = step.icon;
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;

        return (
          <div
            key={index}
            className={`flex items-center space-x-4 transition-all duration-500 ${
              isActive ? "scale-105" : isCompleted ? "opacity-60" : "opacity-30"
            }`}
          >
            <div
              className={`
              relative p-3 rounded-full transition-all duration-500
              ${
                isActive
                  ? `bg-gradient-to-r ${step.color} animate-pulse shadow-lg`
                  : isCompleted
                  ? "bg-green-500"
                  : "bg-gray-200"
              }
            `}
            >
              <StepIcon
                className={`w-5 h-5 transition-colors duration-500 ${
                  isActive || isCompleted ? "text-white" : "text-gray-400"
                }`}
              />
              {isActive && (
                <div className="absolute inset-0 rounded-full bg-white opacity-20 animate-ping"></div>
              )}
            </div>
            <div
              className={`transition-all duration-500 ${
                isActive
                  ? "text-gray-900 font-semibold"
                  : isCompleted
                  ? "text-green-600"
                  : "text-gray-400"
              }`}
            >
              {step.text}
              {isActive && (
                <span className="inline-block ml-2 animate-pulse">...</span>
              )}
              {isCompleted && (
                <span className="inline-block ml-2 text-green-500">✓</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const WaveProgress = () => {
  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 animate-wave"></div>

        {/* Wave overlay */}
        <div className="absolute inset-0 opacity-50">
          <div className="h-full bg-gradient-to-r from-transparent via-white to-transparent animate-wave-shimmer"></div>
        </div>

        {/* Floating dots */}
        <div className="absolute inset-0 flex items-center justify-around">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="w-1 h-1 bg-white rounded-full animate-bounce opacity-80"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>

      {/* Progress text */}
      <div className="flex justify-between mt-2 text-sm text-gray-500">
        <span className="animate-pulse">Loading...</span>
        <span className="animate-pulse">Almost there!</span>
      </div>
    </div>
  );
};

const ProfilePreview3D = () => {
  return (
    <div className="relative perspective-1000">
      <div className="w-64 h-80 mx-auto relative preserve-3d animate-card-flip">
        {/* Front of card */}
        <div className="absolute inset-0 backface-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 shadow-2xl border border-gray-200 p-6">
          <div className="text-center">
            {/* Profile placeholder */}
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 animate-pulse relative">
              <div className="absolute inset-2 rounded-full bg-white flex items-center justify-center">
                <User className="w-8 h-8 text-gray-400 animate-bounce" />
              </div>
            </div>

            {/* Name placeholder */}
            <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg mb-2 animate-pulse"></div>
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4 mx-auto mb-4 animate-pulse"></div>

            {/* Stats */}
            <div className="flex justify-around mb-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="text-center">
                  <div className="h-6 w-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded mb-1 mx-auto animate-pulse"></div>
                  <div className="h-3 w-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="space-y-2">
              <div className="h-10 bg-gradient-to-r from-orange-200 to-orange-300 rounded-xl animate-pulse"></div>
              <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-600 shadow-2xl p-6 text-white">
          <div className="text-center h-full flex flex-col justify-center">
            <Sparkles className="w-16 h-16 mx-auto mb-4 animate-spin" />
            <h3 className="text-xl font-bold mb-2">Creating Magic</h3>
            <p className="text-orange-100">
              Your profile is being crafted with care...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const EnhancedProfileLoading = () => {
  const [loadingText, setLoadingText] = useState("Initializing...");
  const loadingTexts = [
    "Initializing...",
    "Loading profile data...",
    "Fetching your posts...",
    "Calculating achievements...",
    "Syncing preferences...",
    "Almost ready...",
  ];

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setLoadingText(loadingTexts[index]);
      index = (index + 1) % loadingTexts.length;
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dynamic gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 animate-gradient-shift">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-transparent to-green-500/20 animate-gradient-x"></div>
      </div>

      {/* Floating particles */}
      <FloatingParticles />

      {/* Animated mesh overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)] animate-pulse"></div>
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent,rgba(255,255,255,0.1),transparent)] animate-spin-slow"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
        <div className="text-center max-w-2xl mx-auto">
          {/* Animated logo */}
          <div className="mb-8">
            <AnimatedLogo />
          </div>

          <div className="mb-8">
            <ProfilePreview3D />
          </div>

          <div className="mb-6">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-orange-200 to-pink-200 bg-clip-text text-transparent mb-4 animate-title-wave">
              Crafting Your
            </h1>
            <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-title-wave animation-delay-300">
              Digital Identity
            </h2>
          </div>

          {/* Dynamic loading text */}
          <div className="mb-8">
            <p className="text-xl text-white/80 font-medium animate-pulse">
              {loadingText}
            </p>
          </div>

          <WaveProgress />

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-8">
            <LoadingSteps />
          </div>

          <div className="text-center text-white/60 text-sm">
            <div className="animate-fade-in-up">
              <p className="mb-2">
                ✨ Did you know? Your profile helps connect you with like-minded
                people
              </p>
              <p>🚀 We're setting up your personalized experience...</p>
            </div>
          </div>
        </div>
      </div>

      {/* Custom animations */}
      <style>{`
        @keyframes gradient-shift {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes gradient-x {
          0%,
          100% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(100%);
          }
        }

        @keyframes wave {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes wave-shimmer {
          0% {
            transform: translateX(-200%);
          }
          100% {
            transform: translateX(200%);
          }
        }

        @keyframes breathe {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes spin-reverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        @keyframes card-flip {
          0%,
          40% {
            transform: rotateY(0deg);
          }
          60%,
          100% {
            transform: rotateY(180deg);
          }
        }

        @keyframes title-wave {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-gradient-shift {
          animation: gradient-shift 8s ease infinite;
        }
        .animate-gradient-x {
          animation: gradient-x 6s ease-in-out infinite;
        }
        .animate-wave {
          animation: wave 2s linear infinite;
        }
        .animate-wave-shimmer {
          animation: wave-shimmer 2s linear infinite;
        }
        .animate-breathe {
          animation: breathe 2s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        .animate-spin-reverse {
          animation: spin-reverse 6s linear infinite;
        }
        .animate-card-flip {
          animation: card-flip 4s ease-in-out infinite;
        }
        .animate-title-wave {
          animation: title-wave 2s ease-in-out infinite;
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }

        .animation-delay-300 {
          animation-delay: 0.3s;
        }
        .animation-delay-500 {
          animation-delay: 0.5s;
        }

        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }

        .particles {
          animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-20px) rotate(90deg);
          }
          50% {
            transform: translateY(-10px) rotate(180deg);
          }
          75% {
            transform: translateY(-30px) rotate(270deg);
          }
        }
      `}</style>
    </div>
  );
};

export default EnhancedProfileLoading;
