const ComingSoonModal = ({
  setIsModalOpen,
}: {
  setIsModalOpen: (value: boolean) => void;
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl animate-bounce-slow relative">
        <button
          onClick={() => setIsModalOpen(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          ✕
        </button>

        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-primary">🚀 Coming Soon!</h2>
          <div className="space-y-2">
            <p className="text-gray-600 dark:text-gray-300">
              We're cooking up something amazing for you!
            </p>
            <div className="flex justify-center gap-2">
              <span className="animate-bounce delay-100">🔨</span>
              <span className="animate-bounce delay-200">⚡</span>
              <span className="animate-bounce delay-300">✨</span>
            </div>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Stay tuned for exciting new features!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonModal;
