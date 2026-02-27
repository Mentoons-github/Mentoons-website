import ProductDisplay from "@/components/mythos/about/ProductDisplay";
import { ABOUT_HOW_IT_WORKS, ABOUT_WHAT_WE_OFFER } from "@/constant";
import { motion } from "framer-motion";
import { Suspense, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import Team from "@/components/comics/Team";
import { FAQ_ABOUT_US } from "@/constant/faq";
import { useNavigate } from "react-router-dom";
import FAQ from "../pages/v2/user/faq/faq";
import gsap, { SplitText } from "gsap/all";

const AboutMentoons = () => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const navigate = useNavigate();
  const sectionRef1 = useRef<HTMLDivElement | null>(null);
  const sectionRef2 = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (window.location.hash === "#fun-section") {
      setTimeout(() => {
        const element = document.getElementById("fun-section");
        element?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, []);

  const closeVideoModal = () => {
    setSelectedVideo(null);
  };

  useGSAP(() => {
    const paraSplit = new SplitText(".sub-para", { type: "lines" });

    gsap.from("#heading", {
      y: 40,
      opacity: 0,
      duration: 0.7,
      ease: "power3.out",
    });

    gsap.from("#heading-part", {
      y: 40,
      opacity: 0,
      delay: 0.35,
      duration: 0.7,
      ease: "power3.out",
    });

    gsap.from(paraSplit.lines, {
      y: 30,
      opacity: 0,
      stagger: 0.18,
      duration: 0.9,
      ease: "power2.out",
    });

    gsap.from("#about-mentoons", {
      opacity: 0,
      scale: 0.92,
      delay: 0.5,
      duration: 1.1,
      ease: "power2.out",
    });

    return () => paraSplit.revert();
  }, []);

  useGSAP(() => {
    const howHelpSplit = new SplitText("#how-helps", { type: "chars" });
    const howHelpPara = new SplitText("#help-para", { type: "lines" });

    const tl1 = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef1.current,
        start: "top 75%",
        toggleActions: "play none none none",
      },
    });

    tl1
      .from(howHelpSplit.chars, {
        yPercent: -120,
        opacity: 0,
        stagger: 0.018,
        duration: 0.9,
        ease: "back.out(1.4)",
      })
      .from(
        howHelpPara.lines,
        {
          y: 40,
          opacity: 0,
          stagger: 0.14,
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.6",
      )
      .from(
        ".help-stickers",
        {
          y: 60,
          opacity: 0,
          scale: 0.75,
          stagger: 0.16,
          duration: 0.9,
          ease: "back.out(1.2)",
        },
        "-=0.7",
      );

    return () => {
      howHelpPara.revert();
      howHelpSplit.revert();
    };
  }, []);

  // "What We Offer?" section – improved animation
  useGSAP(() => {
    const offerTitleSplit = new SplitText("#we-offer", { type: "chars,words" });
    const offerParaSplit = new SplitText("#offer-para", { type: "lines" });

    const tl2 = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef2.current,
        start: "top 75%",
        toggleActions: "play none none none",
      },
    });

    tl2
      .from(offerTitleSplit.chars, {
        yPercent: 140,
        opacity: 0,
        stagger: 0.024,
        duration: 1,
        ease: "back.out(1.6)",
      })
      .from(
        offerParaSplit.lines,
        {
          y: 50,
          opacity: 0,
          stagger: 0.16,
          duration: 1,
          ease: "power3.out",
        },
        "-=0.8",
      )
      .from(
        ".offer-card",
        {
          y: 80,
          opacity: 0,
          scale: 0.88,
          stagger: {
            amount: 0.65,
            from: "center",
          },
          duration: 1.1,
          ease: "back.out(1.3)",
        },
        "-=0.9",
      );

    return () => {
      offerParaSplit.revert();
      offerTitleSplit.revert();
    };
  }, []);

  return (
    <div className="w-full">
      {/* hero section */}
      <div className="relative flex flex-col items-start justify-center gap-12 p-12 md:flex-row">
        <div className="w-full md:w-[50%] flex flex-col items-center md:items-start">
          <h2
            id="heading"
            className="text-3xl font-semibold text-center md:text-4xl lg:text-6xl md:text-start"
          >
            About{" "}
            <span id="heading-part" className="text-primary">
              Mentoons
            </span>
          </h2>
          <p className="sub-para mt-4 md:mt-8 text-lg md:text-xl leading-relaxed md:leading-loose w-full md:w-[75%] font-medium text-center md:text-start">
            At Mentoons, we believe that gadgets shouldn't replace goodness.
            We're on a mission to help children and families rediscover
            balance—between digital play and real-life values.
          </p>

          <p className="sub-para mt-4 md:mt-8 text-lg md:text-xl leading-relaxed md:leading-loose w-full md:w-[75%] font-medium text-center md:text-start">
            Through engaging workshops, stories, and community-led programs, we
            empower kids to be tech-smart, emotionally resilient, and culturally
            rooted.
          </p>
        </div>

        <div
          id="about-mentoons"
          className="relative w-full md:w-[410px] lg:w-[500px] xl:w-[590px] h-auto flex justify-center items-center p-6"
        >
          <img
            src="/assets/home/addaTV/Rectangle 285.png"
            alt="tv"
            className="w-3/4 h-auto xl:w-full"
          />

          <div
            className="absolute mentoons-video top-1/2 left-1/2 w-[65%] lg:w-[65%] xl:w-[84%] h-[70%] bg-black -translate-x-1/2 -translate-y-1/2 rounded-t-[60px] overflow-hidden flex items-center justify-center"
            style={{ clipPath: "polygon(15% 100%, 90% 100%, 100% 0%, 0% 0%)" }}
          >
            <video
              className="w-[80%] h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            >
              <source
                src={`${import.meta.env.VITE_STATIC_URL}static/Mentoons Team Video_03.mp4`}
                type="video/mp4"
              />
            </video>
          </div>
        </div>
      </div>

      <section ref={sectionRef1} className="p-4 py-6 pb-24 md:p-12 lg:p-24">
        <div className="flex flex-col items-start justify-center gap-6">
          <div>
            <h2
              id="how-helps"
              className="pb-4 text-4xl font-semibold text-center md:text-start"
            >
              How It Helps Your Kids?
            </h2>
            <p
              id="help-para"
              className="text-xl md:w-[75%] text-center md:text-start"
            >
              Today’s children are growing up online—but growing apart from
              self-awareness, empathy, and heritage. We’re here to change that.
            </p>
          </div>

          <motion.div className="flex flex-col items-center w-full gap-4 md:flex-row md:justify-between">
            {ABOUT_HOW_IT_WORKS.map((offering, index) => (
              <motion.div
                key={offering.id}
                custom={index}
                className="help-stickers flex flex-col items-center gap-4 p-4 rounded-xl w-[280px] h-[280px] justify-center"
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.3 },
                }}
              >
                <img
                  src={offering.imageUrl}
                  alt={offering.title}
                  className="w-24 h-24"
                />
                <p
                  style={{ color: offering.accentColor }}
                  className="text-lg font-bold text-center"
                >
                  {offering.title}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section ref={sectionRef2} className="p-4 py-6 pb-24 md:p-12 lg:p-24">
        <div className="flex flex-col items-start justify-center gap-6">
          <div className="pb-8">
            <h2
              id="we-offer"
              className="pb-4 text-4xl font-semibold text-center md:text-start"
            >
              What We Offer?
            </h2>
            <p
              id="offer-para"
              className="text-xl md:w-[75%] text-center md:text-start"
            >
              Today’s children are growing up online—but growing apart from
              self-awareness, empathy, and heritage. We’re here to change that.
            </p>
          </div>

          <div className="flex flex-col items-center w-full gap-6 md:flex-row md:flex-wrap md:justify-center lg:justify-between">
            {ABOUT_WHAT_WE_OFFER.map((offering) => (
              <div
                key={offering.id}
                className="offer-card flex flex-col items-center gap-4 p-5 rounded-2xl w-[280px] h-[280px] justify-center cursor-pointer bg-white/40 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow"
                onClick={() => navigate(offering.link)}
              >
                <img
                  src={offering.imageUrl}
                  alt={offering.title}
                  className="w-full h-full object-contain"
                />
                <p
                  style={{ color: offering.accentColor }}
                  className="text-lg font-bold text-center"
                >
                  {offering.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ProductDisplay />
      <Suspense fallback={<div>Loading...</div>}>
        <Team />
      </Suspense>
      <section className="py-12">
        <FAQ data={FAQ_ABOUT_US} />
      </section>

      {selectedVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
          onClick={closeVideoModal}
        >
          <div
            className="relative w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeVideoModal}
              className="absolute right-0 text-3xl text-white -top-10 hover:text-gray-300"
            >
              ×
            </button>
            <video
              src={selectedVideo}
              controls
              autoPlay
              className="w-full rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutMentoons;
