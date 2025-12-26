import { WhatsappIcon } from "react-share";

const WhatsappGroup = () => {
  return (
    <div className="relative z-50 group">
      <a
        href="https://chat.whatsapp.com/KJ2k1I75odx3KTAOD84t9u"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Join our WhatsApp Group"
        className="
          w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16
          flex items-center justify-center
          rounded-full bg-green-500
          shadow-xl
          hover:scale-110
          transition-transform
          overflow-hidden
        "
      >
        <WhatsappIcon className="w-full h-full text-white" />
      </a>

      {/* Tooltip – show only on desktop */}
      <div
        className="
          pointer-events-none
          absolute right-full top-1/2 -translate-y-1/2 mr-3
          hidden md:block
          opacity-0 group-hover:opacity-100
          transition-opacity
        "
      >
        <div className="bg-black text-white text-xs px-3 py-1 rounded-md whitespace-nowrap shadow-lg">
          Join our WhatsApp Group
        </div>
      </div>
    </div>
  );
};

export default WhatsappGroup;
