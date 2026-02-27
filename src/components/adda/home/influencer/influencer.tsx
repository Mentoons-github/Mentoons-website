import { Dialog } from "@/components/ui/dialog";
import { useState, useRef, useEffect } from "react";
import MentoonsInfulencerRequestModal from "./mentoonsInfulencerRequestModal";
import { useUser } from "@clerk/clerk-react";
import { useAuthModal } from "@/context/adda/authModalContext";
import { gsap } from "gsap";

const Influencer = () => {
  const { isSignedIn } = useUser();
  const { openAuthModal } = useAuthModal();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const applyBtnRef = useRef<HTMLButtonElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    gsap.set(
      [
        el,
        titleRef.current,
        descRef.current,
        imgRef.current,
        applyBtnRef.current,
      ],
      { opacity: 0 },
    );

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          observer.disconnect();

          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
          tl.fromTo(
            el,
            { y: 35, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5 },
          )
            .fromTo(
              titleRef.current,
              { x: -20, opacity: 0 },
              { x: 0, opacity: 1, duration: 0.4 },
              "-=0.25",
            )
            .fromTo(
              descRef.current,
              { x: -15, opacity: 0 },
              { x: 0, opacity: 1, duration: 0.35 },
              "-=0.2",
            )
            .fromTo(
              imgRef.current,
              { scale: 0.9, opacity: 0 },
              { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(1.4)" },
              "-=0.15",
            )
            .fromTo(
              applyBtnRef.current,
              { y: 15, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.35 },
              "-=0.1",
            );
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  const handleApplyHoverEnter = () => {
    gsap.to(applyBtnRef.current, {
      scale: 1.06,
      y: -2,
      duration: 0.2,
      ease: "power2.out",
    });
  };

  const handleApplyHoverLeave = () => {
    gsap.to(applyBtnRef.current, {
      scale: 1,
      y: 0,
      duration: 0.2,
      ease: "power2.out",
    });
  };

  const handleApplyClick = () => {
    gsap.to(applyBtnRef.current, {
      scale: 0.92,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut",
      onComplete: openModal,
    });
  };

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
      <div
        ref={containerRef}
        className="flex flex-col p-6 border border-orange-100 shadow-sm bg-gradient-to-r from-orange-50 to-orange-50 rounded-xl"
      >
        <h1
          ref={titleRef}
          className="mb-3 text-xl font-bold text-orange-800 md:text-2xl figtree"
        >
          Become a Mentoons Influencer
        </h1>

        <p ref={descRef} className="mb-4 text-sm text-gray-600 md:text-base">
          Join our community of influencers and make a positive impact on young
          minds.
        </p>

        <div
          ref={imgRef}
          className="w-full h-auto mb-4 overflow-hidden rounded-lg"
          onMouseEnter={() => {
            const img = imgRef.current?.querySelector("img");
            if (img)
              gsap.to(img, { scale: 1.06, duration: 0.35, ease: "power2.out" });
          }}
          onMouseLeave={() => {
            const img = imgRef.current?.querySelector("img");
            if (img)
              gsap.to(img, { scale: 1, duration: 0.35, ease: "power2.out" });
          }}
        >
          <img
            src="/assets/adda/sidebar/Become influencer.png"
            alt="influencer"
            className="object-cover w-full transition-transform duration-300 hover:scale-105"
          />
        </div>

        <button
          ref={applyBtnRef}
          className="self-start px-4 py-2 mt-2 font-medium text-white transition-colors duration-300 bg-orange-600 rounded-lg hover:bg-orange-700"
          onMouseEnter={handleApplyHoverEnter}
          onMouseLeave={handleApplyHoverLeave}
          onClick={handleApplyClick}
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
