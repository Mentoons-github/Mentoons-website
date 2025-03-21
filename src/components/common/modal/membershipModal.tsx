import { motion } from "framer-motion";
import { ArrowRight, Crown, Star, X } from "lucide-react";
import { Link } from "react-router-dom";

const MembershipModal = ({ onClose }: { onClose: () => void }) => {
  const handleSubscriptionClick = (membershipType: "Prime" | "Platinum") => {
    document
      .getElementById("subscription")
      ?.scrollIntoView({ behavior: "smooth" });

    onClose();

    const card = document.getElementById(`membership-${membershipType}`);
    if (card) {
      card.classList.add(
        "border-yellow-400",
        "border-4",
        "shadow-2xl",
        "scale-110",
        "z-10",
        "transition-all",
        "duration-700",
        "ease-out"
      );
      card.style.boxShadow = "0 0 20px 8px rgba(255, 215, 0, 0.7)";
      card.style.transform = "scale(1.1) rotate(2deg)";

      setTimeout(() => {
        card.classList.remove(
          "border-yellow-400",
          "border-4",
          "shadow-2xl",
          "scale-110",
          "z-10",
          "transition-all",
          "duration-700",
          "ease-out"
        );
        card.style.boxShadow = "";
        card.style.transform = "";

        card.classList.add("transition-all", "duration-500");

        setTimeout(() => {
          card.classList.remove("transition-all", "duration-500");
        }, 500);
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 500 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full overflow-hidden"
      >
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
          <h2 className="text-2xl font-bold">Unlock Premium Features</h2>
          <p className="mt-2 opacity-90">
            Get access to exclusive contests and premium benefits
          </p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-8">
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="border border-blue-200 dark:border-blue-900 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleSubscriptionClick("Prime")}
            >
              <div className="flex justify-center mb-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                  <Star
                    className="text-blue-500 dark:text-blue-400"
                    size={24}
                  />
                </div>
              </div>
              <h3 className="font-bold text-blue-600 dark:text-blue-400 text-lg">
                Prime
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                All standard contests and basic features
              </p>
              <button className="mt-4 w-full py-2 px-3 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm font-medium flex items-center justify-center gap-1 transition-colors">
                Select <ArrowRight size={14} />
              </button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.03 }}
              className="border-2 border-green-300 dark:border-green-700 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow relative"
              onClick={() => handleSubscriptionClick("Platinum")}
            >
              <div className="absolute -top-3 -right-3 bg-green-500 text-white text-xs py-1 px-2 rounded-full">
                Best Value
              </div>
              <div className="flex justify-center mb-2">
                <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-full">
                  <Crown
                    className="text-green-500 dark:text-green-400"
                    size={24}
                  />
                </div>
              </div>
              <h3 className="font-bold text-green-600 dark:text-green-400 text-lg">
                Platinum
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                Premium contests and exclusive benefits
              </p>
              <button className="mt-4 w-full py-2 px-3 bg-green-500 hover:bg-green-600 text-white rounded-md text-sm font-medium flex items-center justify-center gap-1 transition-colors">
                Select <ArrowRight size={14} />
              </button>
            </motion.div>
          </div>
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p>
              Already have membership?{" "}
              <Link
                to="/sign-in"
                onClick={onClose}
                className="text-blue-500 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MembershipModal;
