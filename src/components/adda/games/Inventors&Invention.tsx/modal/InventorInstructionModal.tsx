const InventorInstructionModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 
                 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Card */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl rounded-2xl 
                   bg-gradient-to-br from-blue-800/90 to-purple-800/90
                   border border-white/20 p-2 md:p-6 text-white shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white/70 hover:text-white 
                     text-xl font-bold"
          aria-label="Close instructions"
        >
          ✖
        </button>

        <h2 className="text-2xl font-extrabold text-center mb-4">
          🎮 How to Play
        </h2>

        {/* Instructions */}
        <ul className="text-[16px] leading-relaxed space-y-3 text-teal-100">
          <li>
          🟢 <b>Levels:</b> Easy – <b>3</b> pairs, Medium – <b>6</b> pairs,
            Hard – <b>8</b> pairs.
          </li>

          <li>
            👀 <b>Memorize</b> all inventors and their inventions in
            <b className="text-yellow-300"> 15 seconds</b>.
          </li>

          <li>
            🧩 After that, <b>drag and match</b> the inventor with the correct
            invention.
          </li>

          <li>
            ⏱️ You get <b className="text-red-300">30 seconds</b> to complete
            each round.
          </li>

          <li>
            ⭐ Every correct match <b>adds 1 point</b> to your score.
          </li>

          <li>
            🔁 There are <b>3 rounds</b> in total.
          </li>

          <li>
            🏆 Each level becomes <b>more challenging</b>. Think fast!
          </li>
        </ul>

        {/* Start Tip */}
        <div className="mt-5 text-center text-xs text-yellow-300 font-semibold">
          💡 Tip: Focus on faces, names & inventions together!
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="mt-6 w-full bg-gradient-to-r from-green-600 to-teal-600 
                     hover:from-teal-600 hover:to-green-600
                     text-white font-bold py-2 rounded-full shadow-lg 
                     transition-all duration-300"
        >
          ✅ Got it! Let’s Play
        </button>
      </div>
    </div>
  );
};

export default InventorInstructionModal;
