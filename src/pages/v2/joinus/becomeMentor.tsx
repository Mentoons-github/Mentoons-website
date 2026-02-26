import JobHeroSection from "@/components/affiliate/hero/heroSection";
import { getOpenPositions } from "@/redux/careerSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { AppDispatch, RootState } from "@/redux/store";
import FAQCommon from "@/components/adda/faq";
import gsap from "gsap";

const BecomeMentor = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { openPositions } = useSelector((state: RootState) => state.career);
  const [showFAQ, setShowFAQ] = useState(false);

  const img1Ref = useRef<HTMLImageElement>(null);
  const img2Ref = useRef<HTMLImageElement>(null);
  const img3Ref = useRef<HTMLImageElement>(null);

  const mentorFAQs = [
    {
      q: "How do I become a mentor with Mentoons?",
      ans: "To become a mentor, click on the 'Join as Mentor' button and complete the application form. Our team will review your profile and experience. If shortlisted, you will be contacted for further discussion and onboarding.",
    },
    {
      q: "What areas can I specialize in as a mentor?",
      ans: "Mentors can specialize in areas such as communication skills, personality development, emotional intelligence, academic guidance, career mentoring, leadership skills, creativity, and child development.",
    },
    {
      q: "How can I manage difficult situations with Mentoons?",
      ans: "Managing difficult situations requires patience, empathy, and active listening. Create a safe environment for mentees to express themselves, understand the root cause of challenges, and provide constructive guidance or seek support when necessary.",
    },
  ];

  useEffect(() => {
    dispatch(getOpenPositions({}));
  }, [dispatch]);

  useEffect(() => {
    if (!img1Ref.current || !img2Ref.current || !img3Ref.current) return;

    gsap.fromTo(
      img1Ref.current,
      { opacity: 0, scale: 0.92 },
      { opacity: 1, scale: 1, duration: 1.4, ease: "power2.out" },
    );

    gsap.fromTo(
      img2Ref.current,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 1.6, ease: "power2.out", delay: 0.3 },
    );

    gsap.fromTo(
      img3Ref.current,
      { opacity: 0, scale: 0.88 },
      { opacity: 1, scale: 1, duration: 1.8, ease: "power2.out", delay: 0.6 },
    );

    gsap.to(img1Ref.current, {
      y: -12,
      rotation: -1.2,
      duration: 6,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    gsap.to(img2Ref.current, {
      y: 18,
      rotation: 1.5,
      duration: 8.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 0.8,
    });

    gsap.to(img3Ref.current, {
      y: -15,
      x: 8,
      rotation: -0.9,
      duration: 9.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 1.4,
    });
  }, []);

  const mentorJob = openPositions.find(
    (pos) => pos.jobTitle.toLowerCase() === "mentor",
  );

  const mentorId = mentorJob?._id;
  const title = "Become a Mentor";
  const subtitle =
    "Share your knowledge, inspire growth, and shape the children of tomorrow.";

  return (
    <div className="relative min-h-screen overflow-hidden">
      <img
        ref={img1Ref}
        src="/assets/hiring/mentor-bg.png"
        alt="mentor-with-kids"
        className="absolute left-10 top-5 w-32 h-44 z-20 pointer-events-none"
      />
      <img
        ref={img2Ref}
        src="/assets/hiring/mentor-bg1.png"
        alt="mentor-with-kids"
        className="absolute right-10 bottom-1/4 w-64 h-96 z-20 pointer-events-none"
      />
      <img
        ref={img3Ref}
        src="/assets/hiring/mentor-bg2.png"
        alt="mentor-with-kids"
        className="absolute left-1/5 bottom-20 w-80 z-20 pointer-events-none"
      />

      <JobHeroSection
        setShowFAQ={setShowFAQ}
        subTitle={subtitle}
        title={title}
        jobId={mentorId}
      />

      {showFAQ && (
        <div className="bg-white py-16">
          <FAQCommon FAQ={mentorFAQs} setShowFAQ={setShowFAQ} />
        </div>
      )}
    </div>
  );
};

export default BecomeMentor;
