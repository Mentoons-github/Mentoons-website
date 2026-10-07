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
      <style>{`
        .inf-font {
          font-family: var(--font-comic) !important;
          font-weight: 400 !important;
          letter-spacing: 0.04em;
        }

        .inf-panel {
          background-color: #fffbeb;
          background-image: radial-gradient(rgba(249,115,22,0.10) 1.5px, transparent 2px);
          background-size: 16px 16px;
          border: 3px solid #000;
          box-shadow: 4px 4px 0 #000;
          border-radius: 14px;
        }

        .inf-card {
          background: #fff;
          border: 2px solid #000;
          border-left-width: 8px;
          border-left-color: #fb923c;
          box-shadow: 2px 2px 0 #000;
          border-radius: 10px;
        }

        .inf-img {
          border: 2px solid #000;
          box-shadow: 2px 2px 0 #000;
          border-radius: 10px;
          background: #fff;
        }

        .inf-btn {
          background: #fb923c;
          color: #000;
          border: 2px solid #000;
          box-shadow: 3px 3px 0 #000;
          border-radius: 999px;
          transition: box-shadow 0.1s ease, background-color 0.1s ease;
        }
        .inf-btn:hover { background: #fdba74; box-shadow: 4px 4px 0 #000; }
        .inf-btn:active { box-shadow: 1px 1px 0 #000; }
        .inf-btn:focus-visible { outline: 3px solid #000; outline-offset: 3px; }
      `}</style>

      <div ref={containerRef} className="inf-panel flex flex-col p-6">
        <div className="inf-card p-4 mb-4">
          <h1
            ref={titleRef}
            className="inf-font mb-2 text-xl text-black md:text-2xl"
          >
            🎤 Become a Mentoons Influencer
          </h1>

          <p
            ref={descRef}
            className="text-sm text-gray-700 leading-relaxed md:text-base"
          >
            Join our community of influencers and make a positive impact on
            young minds.
          </p>
        </div>

        <div
          ref={imgRef}
          className="inf-img w-full h-auto mb-4 overflow-hidden"
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
            className="object-cover w-full"
          />
        </div>

        <button
          ref={applyBtnRef}
          className="inf-btn inf-font self-start px-5 py-2 text-base"
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
