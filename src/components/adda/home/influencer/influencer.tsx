import { Dialog } from "@/components/ui/dialog";
import { useState } from "react";
import MentoonsInfulencerRequestModal from "./mentoonsInfulencerRequestModal";
import { useUser } from "@clerk/clerk-react";
import { useAuthModal } from "@/context/adda/authModalContext";

const Influencer = () => {
  const { isSignedIn } = useUser();
  const { openAuthModal } = useAuthModal();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    if (isSignedIn) {
      setIsModalOpen(true);
    } else {
      openAuthModal("sign-in");
    }
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <div className="flex flex-col p-6 border border-orange-100 shadow-sm bg-gradient-to-r from-orange-50 to-orange-50 rounded-xl">
        <h1 className="mb-3 text-xl font-bold text-orange-800 md:text-2xl figtree">
          Become a Mentoons Influencer
        </h1>

        <p className="mb-4 text-sm text-gray-600 md:text-base">
          Join our community of influencers and make a positive impact on young
          minds.
        </p>

        <div className="w-full h-auto mb-4 overflow-hidden rounded-lg">
          <img
            src="/assets/adda/sidebar/Become influencer.png"
            alt="influencer"
            className="object-cover w-full transition-transform duration-300 hover:scale-105"
          />
        </div>

        <button
          className="self-start px-4 py-2 mt-2 font-medium text-white transition-colors duration-300 bg-orange-600 rounded-lg hover:bg-orange-700"
          onClick={openModal}
        >
          Apply Now
        </button>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <MentoonsInfulencerRequestModal onClose={closeModal} />
      </Dialog>
    </>
  );
};

export default Influencer;
