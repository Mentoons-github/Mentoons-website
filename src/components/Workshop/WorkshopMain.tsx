import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import { motion, useAnimation, useInView } from "framer-motion";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import WorkshopForm from "../common/WorkshopForm";
import TestimonialCard from "./TestimonialCard";

type Category = "6-12" | "13-19" | "parents" | "20+";

interface WorkshopFeature {
  id: string;
  heading: string;
  subHeading: string;
  imageUrl: string;
  color: string;
  textColor: string;
  features: Array<{
    id: string;
    label: string;
    description: string;
  }>;
}

interface CategoryContent {
  cat: string;
  title: string;
  subTitle: string;
  description: string;
  mainImage: string;
  heroImage: string;
  video: string;
  texts: string[];
  bgUrl?: string;
  color?: string;
  workshop_features: WorkshopFeature[];
  points: Array<{
    img: string;
    text: string;
  }>;
  testimonials: Array<{
    title: string;
    img: string;
    message: string;
  }>;
}

const CATEGORY_CONTENT: Record<Category, CategoryContent> = {
  "6-12": {
    cat: "6-12",
    title: "MENTOONS Kids Camp",
    subTitle: "Fun Learning Workshop For Kids (7-12 Years)",
    description:
      "Nurture your child's creativity and learning with our engaging Kids Camp workshop.",
    mainImage: "/assets/camps/Buddy.png",
    heroImage: "/assets/camps/bdy-img.png",
    video: `${
      import.meta.env.VITE_STATIC_URL
    }static/Buddy Camp Common Issues (6-12).mp4`,
    texts: ["Creative Learning", "Social Skills", "Digital Literacy"],
    bgUrl: "/assets/camps/dd.png",
    color: "#8AD983",
    workshop_features: [
      {
        id: "WF_1",
        heading: "Portfolio Management",
        subHeading: "To help individual present themseleves professionally",
        imageUrl: "/assets/camps/teen (1).png",
        color: "#B38FD8",
        textColor: "#271481",
        features: [
          {
            id: "pm_01",
            label: "Resume Creation",
            description:
              "Crafting customized resumes that showcase relevant skills and experiences.",
          },
          {
            id: "pm_02",
            label: "Video Introduction",
            description:
              "Guidance for creating engaging, professional video introductions.",
          },
          {
            id: "pm_03",
            label: "Scrip Editing:",
            description:
              "Support for refining presentation scripts for clear, impactful communication.",
          },
        ],
      },
      {
        id: "WF_2",
        heading: "Interviewing Skills",
        subHeading:
          "Prepare users for various interview formats and expectations",
        imageUrl: "/assets/camps/teen (2).png",
        color: "#EB4B7B",
        textColor: "#66001F",
        features: [
          {
            id: "is_01",
            label: "Interview Etiquette",
            description: "Guidance on professional demeanor and behaviour",
          },
          {
            id: "is_02",
            label: "Scheduling Interview",
            description:
              "Tips for managing interview timings and confirmations.",
          },
          {
            id: "is_03",
            label: "Face-to-face and Video Interviewing",
            description: "Best practices for in-persong and virtual interviews",
          },
        ],
      },
      {
        id: "WF_3",
        heading: "Grooming and Professional Image",
        subHeading:
          "Guide users on professional appearance and behavior to make a positive impression",
        imageUrl: "/assets/camps/teen (3).png",

        color: "#FFBC05",
        textColor: "#4A3602",
        features: [
          {
            id: "gpi_01",
            label: "Dressing and Styling Recommendataions",
            description:
              "Advice on appropriate attire for professional setting. ",
          },
          {
            id: "gpi_02",
            label: "Image Management",
            description: "Strategies for cultivating a professional image.",
          },
          {
            id: "gpi_03",
            label: "Grooming Tips:",
            description:
              "Suggestions from maintaining a polished professional appearance",
          },
        ],
      },
      {
        id: "WF_4",
        heading: "WhatsApp Manners",
        subHeading: "Educate users on professional WhatsApp etiquette",
        imageUrl: "/assets/camps/teen (4).png",
        color: "#F96A00",
        textColor: "#582702",
        features: [
          {
            id: "wm_01",
            label: "Texting Etiquette",
            description:
              "Guidelines for respectfull and concise communication. ",
          },
          {
            id: "wm_02",
            label: "Content Appropriateness",
            description:
              "Recommendataions on what to share and avoid in a professional setting.",
          },
          {
            id: "wm_03",
            label: "Communication Limits",
            description:
              "Advice on maintaining a professional tone and volume of communication",
          },
        ],
      },
      {
        id: "WF_5",
        heading: "Career Support Services",
        subHeading:
          "Provide access to top career advice, guidance on trending domains and expert insights",
        imageUrl: "/assets/camps/teen (5).png",
        color: "#0CC5BD",
        textColor: "#003533",
        features: [
          {
            id: "css_01",
            label: "Trending Domains and Career Paths",
            description: "Tips on building a career in high-demand fields",
          },
          {
            id: "css_02",
            label: "Social Media Guidance",
            description:
              "Support for managing professional social media presence",
          },
          {
            id: "css_03",
            label: "10-minute Complimentary Calls",
            description: "Short consultations with industry experts.",
          },
        ],
      },
      {
        id: "WF_6",
        heading: "Career Support Services",
        subHeading:
          "Provide access to top career advice, guidance on trending domains and expert insights",
        imageUrl: "/assets/camps/teen (6).png",
        color: "#0CC5BD",
        textColor: "#003533",
        features: [
          {
            id: "css_01",
            label: "Trending Domains and Career Paths",
            description: "Tips on building a career in high-demand fields",
          },
          {
            id: "css_02",
            label: "Social Media Guidance",
            description:
              "Support for managing professional social media presence",
          },
          {
            id: "css_03",
            label: "10-minute Complimentary Calls",
            description: "Short consultations with industry experts.",
          },
        ],
      },
    ],
    points: [
      {
        img: "/assets/camps/teenpoints (1).png",
        text: "Interactive group discussions",
      },
      {
        img: "/assets/camps/teenpoints (2).png",
        text: "Peer learning activities",
      },
      { img: "/assets/camps/teenpoints (3).png", text: "Practical workshops" },
      { img: "/assets/camps/teenpoints (4).png", text: "Expert guidance" },
      { img: "/assets/camps/teenpoints (5).png", text: "Personal development" },
    ],
    testimonials: [
      {
        title: "Mithran",
        img: "/assets/camps/img-tt.png",
        message: "As a teacher, I find Mentoons' resources invaluable.",
      },
      {
        title: "Sarah",
        img: "/assets/camps/img-tt.png",
        message:
          "The workshop helped my child develop better social skills and confidence.",
      },
    ],
  },
  "13-19": {
    cat: "13-19",
    title: "MENTOONS Teen Camp",
    subTitle: "Identity Workshop For Teenagers (13-19 Years)",
    description:
      "Help your teenager navigate the challenges of adolescence with our comprehensive Teen Camp workshop.",
    mainImage: "/assets/camps/Teen.png",
    heroImage: "/assets/camps/w-img.png",
    video: `${
      import.meta.env.VITE_STATIC_URL
    }static/Teen Camp Common Issues (13-19)_02.mp4`,
    texts: [
      "Scrolling De-Addiction",
      "Hormonal Changes",
      "Substance De-Addiction",
    ],
    bgUrl: "/assets/camps/cc.png",
    color: "#4395DD",
    workshop_features: [
      {
        id: "WF_1",
        heading: "Portfolio Management",
        subHeading: "To help individual present themseleves professionally",
        imageUrl: "/assets/images/portfolio-management.png",
        color: "#B38FD8",
        textColor: "#271481",
        features: [
          {
            id: "pm_01",
            label: "Resume Creation",
            description:
              "Crafting customized resumes that showcase relevant skills and experiences.",
          },
          {
            id: "pm_02",
            label: "Video Introduction",
            description:
              "Guidance for creating engaging, professional video introductions.",
          },
          {
            id: "pm_03",
            label: "Scrip Editing:",
            description:
              "Support for refining presentation scripts for clear, impactful communication.",
          },
        ],
      },
      {
        id: "WF_2",
        heading: "Interviewing Skills",
        subHeading:
          "Prepare users for various interview formats and expectations",
        imageUrl: "/assets/images/interviewing-skill.png",
        color: "#EB4B7B",
        textColor: "#66001F",
        features: [
          {
            id: "is_01",
            label: "Interview Etiquette",
            description: "Guidance on professional demeanor and behaviour",
          },
          {
            id: "is_02",
            label: "Scheduling Interview",
            description:
              "Tips for managing interview timings and confirmations.",
          },
          {
            id: "is_03",
            label: "Face-to-face and Video Interviewing",
            description: "Best practices for in-persong and virtual interviews",
          },
        ],
      },
      {
        id: "WF_3",
        heading: "Grooming and Professional Image",
        subHeading:
          "Guide users on professional appearance and behavior to make a positive impression",
        imageUrl: "/assets/images/grooming-professional.png",

        color: "#FFBC05",
        textColor: "#4A3602",
        features: [
          {
            id: "gpi_01",
            label: "Dressing and Styling Recommendataions",
            description:
              "Advice on appropriate attire for professional setting. ",
          },
          {
            id: "gpi_02",
            label: "Image Management",
            description: "Strategies for cultivating a professional image.",
          },
          {
            id: "gpi_03",
            label: "Grooming Tips:",
            description:
              "Suggestions from maintaining a polished professional appearance",
          },
        ],
      },
      {
        id: "WF_4",
        heading: "WhatsApp Manners",
        subHeading: "Educate users on professional WhatsApp etiquette",
        imageUrl: "/assets/images/whatsapp-manner.png",
        color: "#F96A00",
        textColor: "#582702",
        features: [
          {
            id: "wm_01",
            label: "Texting Etiquette",
            description:
              "Guidelines for respectfull and concise communication. ",
          },
          {
            id: "wm_02",
            label: "Content Appropriateness",
            description:
              "Recommendataions on what to share and avoid in a professional setting.",
          },
          {
            id: "wm_03",
            label: "Communication Limits",
            description:
              "Advice on maintaining a professional tone and volume of communication",
          },
        ],
      },
      {
        id: "WF_5",
        heading: "Career Support Services",
        subHeading:
          "Provide access to top career advice, guidance on trending domains and expert insights",
        imageUrl: "/assets/images/career-support.png",
        color: "#0CC5BD",
        textColor: "#003533",
        features: [
          {
            id: "css_01",
            label: "Trending Domains and Career Paths",
            description: "Tips on building a career in high-demand fields",
          },
          {
            id: "css_02",
            label: "Social Media Guidance",
            description:
              "Support for managing professional social media presence",
          },
          {
            id: "css_03",
            label: "10-minute Complimentary Calls",
            description: "Short consultations with industry experts.",
          },
        ],
      },
    ],
    points: [
      {
        img: "/assets/camps/teenpoints (1).png",
        text: "Interactive group discussions",
      },
      {
        img: "/assets/camps/teenpoints (2).png",
        text: "Peer learning activities",
      },
      { img: "/assets/camps/teenpoints (3).png", text: "Practical workshops" },
      { img: "/assets/camps/teenpoints (4).png", text: "Expert guidance" },
      { img: "/assets/camps/teenpoints (5).png", text: "Personal development" },
    ],
    testimonials: [
      {
        title: "Raj",
        img: "/assets/camps/img-tt.png",
        message:
          "An excellent program that addresses modern challenges faced by teenagers.",
      },
      {
        title: "Priya",
        img: "/assets/camps/img-tt.png",
        message:
          "The interactive sessions and expert guidance made a real difference.",
      },
    ],
  },
  parents: {
    cat: "parents",
    title: "Family Camp",
    subTitle: "Guiding Parents in Modern Parenting",
    description:
      "Empower yourself with effective parenting strategies for the digital age.",
    mainImage: "/assets/camps/Family.png",
    heroImage: "/assets/images/family-camp-hero.png",
    video: `${
      import.meta.env.VITE_STATIC_URL
    }static/How parents can bond with their kids_02.mp4`,
    texts: ["Digital Parenting", "Communication Skills", "Child Development"],
    bgUrl: "/assets/camps/cc.png",
    color: "#4395DD",
    workshop_features: [
      {
        id: "WF_1",
        heading: "Portfolio Management",
        subHeading: "To help individual present themseleves professionally",
        imageUrl: "/assets/images/portfolio-management.png",
        color: "#B38FD8",
        textColor: "#271481",
        features: [
          {
            id: "pm_01",
            label: "Resume Creation",
            description:
              "Crafting customized resumes that showcase relevant skills and experiences.",
          },
          {
            id: "pm_02",
            label: "Video Introduction",
            description:
              "Guidance for creating engaging, professional video introductions.",
          },
          {
            id: "pm_03",
            label: "Scrip Editing:",
            description:
              "Support for refining presentation scripts for clear, impactful communication.",
          },
        ],
      },
      {
        id: "WF_2",
        heading: "Interviewing Skills",
        subHeading:
          "Prepare users for various interview formats and expectations",
        imageUrl: "/assets/images/interviewing-skill.png",
        color: "#EB4B7B",
        textColor: "#66001F",
        features: [
          {
            id: "is_01",
            label: "Interview Etiquette",
            description: "Guidance on professional demeanor and behaviour",
          },
          {
            id: "is_02",
            label: "Scheduling Interview",
            description:
              "Tips for managing interview timings and confirmations.",
          },
          {
            id: "is_03",
            label: "Face-to-face and Video Interviewing",
            description: "Best practices for in-persong and virtual interviews",
          },
        ],
      },
      {
        id: "WF_3",
        heading: "Grooming and Professional Image",
        subHeading:
          "Guide users on professional appearance and behavior to make a positive impression",
        imageUrl: "/assets/images/grooming-professional.png",

        color: "#FFBC05",
        textColor: "#4A3602",
        features: [
          {
            id: "gpi_01",
            label: "Dressing and Styling Recommendataions",
            description:
              "Advice on appropriate attire for professional setting. ",
          },
          {
            id: "gpi_02",
            label: "Image Management",
            description: "Strategies for cultivating a professional image.",
          },
          {
            id: "gpi_03",
            label: "Grooming Tips:",
            description:
              "Suggestions from maintaining a polished professional appearance",
          },
        ],
      },
      {
        id: "WF_4",
        heading: "WhatsApp Manners",
        subHeading: "Educate users on professional WhatsApp etiquette",
        imageUrl: "/assets/images/whatsapp-manner.png",
        color: "#F96A00",
        textColor: "#582702",
        features: [
          {
            id: "wm_01",
            label: "Texting Etiquette",
            description:
              "Guidelines for respectfull and concise communication. ",
          },
          {
            id: "wm_02",
            label: "Content Appropriateness",
            description:
              "Recommendataions on what to share and avoid in a professional setting.",
          },
          {
            id: "wm_03",
            label: "Communication Limits",
            description:
              "Advice on maintaining a professional tone and volume of communication",
          },
        ],
      },
      {
        id: "WF_5",
        heading: "Career Support Services",
        subHeading:
          "Provide access to top career advice, guidance on trending domains and expert insights",
        imageUrl: "/assets/images/career-support.png",
        color: "#0CC5BD",
        textColor: "#003533",
        features: [
          {
            id: "css_01",
            label: "Trending Domains and Career Paths",
            description: "Tips on building a career in high-demand fields",
          },
          {
            id: "css_02",
            label: "Social Media Guidance",
            description:
              "Support for managing professional social media presence",
          },
          {
            id: "css_03",
            label: "10-minute Complimentary Calls",
            description: "Short consultations with industry experts.",
          },
        ],
      },
    ],
    points: [
      {
        img: "/assets/camps/teenpoints (1).png",
        text: "Interactive group discussions",
      },
      {
        img: "/assets/camps/teenpoints (2).png",
        text: "Peer learning activities",
      },
      { img: "/assets/camps/teenpoints (3).png", text: "Practical workshops" },
      { img: "/assets/camps/teenpoints (4).png", text: "Expert guidance" },
      { img: "/assets/camps/teenpoints (5).png", text: "Personal development" },
    ],
    testimonials: [
      {
        title: "Mithran",
        img: "/assets/camps/img-tt.png",
        message: "As a teacher, I find Mentoons' resources invaluable.",
      },
      {
        title: "Sarah",
        img: "/assets/camps/img-tt.png",
        message:
          "The workshop helped my child develop better social skills and confidence.",
      },
    ],
  },
  "20+": {
    cat: "20+",
    title: "Career Corner",
    subTitle: "Career Guidance for Students",
    description:
      "Expert guidance to help students explore and plan their career paths.",
    mainImage: "/assets/camps/Group 540.png",
    heroImage: "/assets/images/career-corner-hero-image.png",
    video: `${
      import.meta.env.VITE_STATIC_URL
    }static/The Challenges Youngsters Face Today (20+)_01 (1).mp4`,
    texts: ["Career Exploration", "Skill Assessment", "Industry Insights"],
    bgUrl: "/assets/camps/cc.png",
    color: "#4395DD",
    workshop_features: [
      {
        id: "WF_1",
        heading: "Portfolio Management",
        subHeading: "To help individual present themseleves professionally",
        imageUrl: "/assets/images/portfolio-management.png",
        color: "#B38FD8",
        textColor: "#271481",
        features: [
          {
            id: "pm_01",
            label: "Resume Creation",
            description:
              "Crafting customized resumes that showcase relevant skills and experiences.",
          },
          {
            id: "pm_02",
            label: "Video Introduction",
            description:
              "Guidance for creating engaging, professional video introductions.",
          },
          {
            id: "pm_03",
            label: "Scrip Editing:",
            description:
              "Support for refining presentation scripts for clear, impactful communication.",
          },
        ],
      },
      {
        id: "WF_2",
        heading: "Interviewing Skills",
        subHeading:
          "Prepare users for various interview formats and expectations",
        imageUrl: "/assets/images/interviewing-skill.png",
        color: "#EB4B7B",
        textColor: "#66001F",
        features: [
          {
            id: "is_01",
            label: "Interview Etiquette",
            description: "Guidance on professional demeanor and behaviour",
          },
          {
            id: "is_02",
            label: "Scheduling Interview",
            description:
              "Tips for managing interview timings and confirmations.",
          },
          {
            id: "is_03",
            label: "Face-to-face and Video Interviewing",
            description: "Best practices for in-persong and virtual interviews",
          },
        ],
      },
      {
        id: "WF_3",
        heading: "Grooming and Professional Image",
        subHeading:
          "Guide users on professional appearance and behavior to make a positive impression",
        imageUrl: "/assets/images/grooming-professional.png",

        color: "#FFBC05",
        textColor: "#4A3602",
        features: [
          {
            id: "gpi_01",
            label: "Dressing and Styling Recommendataions",
            description:
              "Advice on appropriate attire for professional setting. ",
          },
          {
            id: "gpi_02",
            label: "Image Management",
            description: "Strategies for cultivating a professional image.",
          },
          {
            id: "gpi_03",
            label: "Grooming Tips:",
            description:
              "Suggestions from maintaining a polished professional appearance",
          },
        ],
      },
      {
        id: "WF_4",
        heading: "WhatsApp Manners",
        subHeading: "Educate users on professional WhatsApp etiquette",
        imageUrl: "/assets/images/whatsapp-manner.png",
        color: "#F96A00",
        textColor: "#582702",
        features: [
          {
            id: "wm_01",
            label: "Texting Etiquette",
            description:
              "Guidelines for respectfull and concise communication. ",
          },
          {
            id: "wm_02",
            label: "Content Appropriateness",
            description:
              "Recommendataions on what to share and avoid in a professional setting.",
          },
          {
            id: "wm_03",
            label: "Communication Limits",
            description:
              "Advice on maintaining a professional tone and volume of communication",
          },
        ],
      },
      {
        id: "WF_5",
        heading: "Career Support Services",
        subHeading:
          "Provide access to top career advice, guidance on trending domains and expert insights",
        imageUrl: "/assets/images/career-support.png",
        color: "#0CC5BD",
        textColor: "#003533",
        features: [
          {
            id: "css_01",
            label: "Trending Domains and Career Paths",
            description: "Tips on building a career in high-demand fields",
          },
          {
            id: "css_02",
            label: "Social Media Guidance",
            description:
              "Support for managing professional social media presence",
          },
          {
            id: "css_03",
            label: "10-minute Complimentary Calls",
            description: "Short consultations with industry experts.",
          },
        ],
      },
    ],
    points: [
      {
        img: "/assets/camps/teenpoints (1).png",
        text: "Interactive group discussions",
      },
      {
        img: "/assets/camps/teenpoints (2).png",
        text: "Peer learning activities",
      },
      { img: "/assets/camps/teenpoints (3).png", text: "Practical workshops" },
      { img: "/assets/camps/teenpoints (4).png", text: "Expert guidance" },
      { img: "/assets/camps/teenpoints (5).png", text: "Personal development" },
    ],
    testimonials: [
      {
        title: "Arjun",
        img: "/assets/camps/img-tt.png",
        message:
          "The guidance I received was life-changing and set me on the right career path.",
      },
      {
        title: "Ritika",
        img: "/assets/camps/img-tt.png",
        message:
          "The workshop provided clarity and helped me build confidence for interviews.",
      },
    ],
  },
};
const AnimatedSection = ({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className: string;
  style?: React.CSSProperties;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.6,
            ease: "easeOut",
          },
        },
      }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
};

const WorkshopMain = () => {
  const navigate = useNavigate();
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [showForm, setShowForm] = React.useState<boolean>(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const category = (searchParams.get("workshop") as Category) || "6-12";

  const [selectedCategory, setSelectedCategory] = useState(category);

  useEffect(() => {
    setSearchParams({ workshop: selectedCategory });
  }, [selectedCategory, setSearchParams]);

  const handleCategoryChange = (newCategory: Category) => {
    setSelectedCategory(newCategory);

    navigate(`/mentoons-workshops?workshop=${newCategory}`);
  };

  const handleNextTestimonial = () => {
    setCurrentTestimonialIndex((prev) =>
      prev === content.testimonials.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrevTestimonial = () => {
    setCurrentTestimonialIndex((prev) =>
      prev === 0 ? content.testimonials.length - 1 : prev - 1
    );
  };

  const content = CATEGORY_CONTENT[selectedCategory as Category];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prevIndex) =>
        prevIndex === content.texts.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [selectedCategory, content.texts.length, currentTextIndex]);

  return (
    <div className="overflow-x-hidden relative w-full scrollbar-hidden">
      <AnimatedSection className="bg-[#FDF7EE] pb-7 pt-4 lg:pt-12 relative">
        <div
          className="absolute -right-4 lg:g:right-2 top-1/2 -translate-y-1/2 cursor-pointer z-10"
          onClick={() => handleCategoryChange("20+")}
        >
          <img
            src="/assets/images/career-corner.png"
            alt="Career Corner"
            className="w-24 h-20 lg:w-full lg:h-44 hover:scale-105 transition-duration-300"
          />
        </div>

        {/* All Categories Including Career Corner */}
        <div className="w-[95%] lg:w-[90%] mx-auto flex justify-center gap-4 lg:gap-24 flex-nowrap">
          {(Object.keys(CATEGORY_CONTENT) as Category[])
            .filter((category) => category !== "20+")
            .map((category) => (
              <div className="flex items-center justify-center gap-3 relative">
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`
                                      relative
                                      px-1 lg:px-4 
                                      py-1 lg:py-4 
                                      text-sm lg:text-lg
                                       rounded-xl
                                       transition-all duration-300 
                                       before:absolute
                                       before:inset-0
                                       before:content-['']
                                       before:z-[-1]
                                       before:rounded-xl
                                       before:translate-y-[6px]
                                      before:transition-transform
                                      before:duration-300
                                      hover:before:translate-y-[4px]
                                      ${
                                        selectedCategory === category
                                          ? "text-white [clip-path:polygon(0_0,100%_10%,100%_90%,0%_100%)] before:[clip-path:polygon(0_0,100%_10%,100%_90%,0%_100%)]"
                                          : "text-[#4A3602] hover:text-white [clip-path:polygon(0_10%,100%_0,100%_100%,0%_90%)] before:[clip-path:polygon(0_10%,100%_0,100%_100%,0%_90%)]"
                                      }
                                  `}
                  style={
                    {
                      backgroundColor:
                        selectedCategory === category ? "#765EED" : "#CEC4FF",
                      "--before-bg":
                        selectedCategory === category ? "#5840C4" : "#9B8BFF",
                    } as React.CSSProperties
                  }
                >
                  <h1>
                    {category.charAt(0).toLocaleUpperCase() + category.slice(1)}
                  </h1>
                </button>
                {/* <figure className="absolute -top-5 -right-5 w-full h-full">
                                <img src={CATEGORY_CONTENT[category].mainImage} alt="" />
                            </figure> */}
              </div>
            ))}
        </div>
      </AnimatedSection>

      {/* Hero Section - Animated */}
      <AnimatedSection className="h-full w-full py-16 bg-[#FDF7EE]">
        <div className="w-[90%] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-[60%] space-y-8">
              <div className="flex flex-col md:flex-row items-center gap-8 border border-green-600">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  className="w-1/2 h-1/2"
                >
                  <figure className="w-full h-full">
                    <motion.img
                      src={content.mainImage}
                      alt="workshop title"
                      className="h-full w-full object-contain"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    />
                  </figure>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-center md:text-left"
                >
                  <h1 className="text-4xl md:text-5xl font-bold">
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      className="block text-2xl"
                    >
                      Welcome to
                    </motion.span>
                    <motion.span
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                      className="block mt-2"
                    >
                      {content.title}
                    </motion.span>
                  </h1>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="mt-4 text-gray-600 text-lg"
                  >
                    {content.subTitle}
                    <br />
                    <motion.p
                      key={currentTextIndex}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="text-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent font-bold"
                    >
                      {content.texts[currentTextIndex]}
                    </motion.p>
                  </motion.div>
                </motion.div>
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-lg text-gray-700 leading-relaxed"
              >
                {content.description}
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:w-[40%]"
            >
              <figure className="transform hover:scale-105 transition-transform duration-300">
                <motion.img
                  src={content.heroImage}
                  alt="workshop img"
                  className="h-full w-full object-contain"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />
              </figure>
            </motion.div>
          </div>
        </div>
      </AnimatedSection>
      {/* Features Section */}
      <AnimatedSection
        className="w-full min-h-screen pt-32 bg-no-repeat bg-cover lg:bg-repeat"
        style={{
          background: `url(${content.bgUrl})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full flex flex-wrap lg:flex-nowrap gap-8 px-4 md:px-8"
        >
          {/* Left Column */}
          <div className="w-full lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="p-6 md:p-12"
            >
              <motion.img
                initial={{ scale: 0.9 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                src="/assets/images/career-corner-section-headline.png"
                alt=""
                className="w-full max-w-[400px] mx-auto object-contain"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 p-4 md:p-6"
            >
              {content.workshop_features.map((feature, index) => (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1, // Stagger effect
                  }}
                  className="max-w-[200px] mx-auto"
                >
                  <Dialog>
                    <div className="relative">
                      <DialogTrigger asChild>
                        <motion.img
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                          src={feature.imageUrl}
                          alt="portfolio management"
                          className="w-full h-auto object-cover"
                        />
                      </DialogTrigger>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute top-2 left-2"
                      >
                        <input type="checkbox" className="w-4 h-4" />
                      </motion.div>
                    </div>
                  </Dialog>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-full lg:w-1/2"
          >
            <div className="flex flex-col items-center justify-center p-6 md:p-12">
              <motion.div
                initial={{ scale: 0.9 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-[500px] w-full relative"
              >
                <img
                  src="/assets/camps/video-bg (2).png"
                  alt="Career corner video"
                  className="w-full h-auto object-contain mb-6"
                />
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <video
                    playsInline
                    webkit-playsinline
                    src={content.video}
                    className="w-[60%] h-[60%] absolute top-[10%] left-[18%] rounded-lg shadow-lg"
                    autoPlay
                    controls
                    muted
                  />
                </motion.div>
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-center text-lg max-w-xl px-4 text-white"
              >
                Our workshops provides essential knowledge and skills for
                teenagers navigating the complexities of adolescence. It offers
                a supportive space for young people to learn, grow, and connect
                with others facing similar challenges.
              </motion.p>
            </div>
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl text-white md:text-5xl font-bold text-center mt-20"
        >
          What to expect from teen camp?
        </motion.h1>
      </AnimatedSection>

      {/* Points Section - Animated */}
      <AnimatedSection
        className="px-4 py-6"
        style={{ background: content.color }}
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            staggerChildren: 0.1,
          }}
          className="flex gap-20 p-20 overflow-x-auto snap-x snap-mandatory scrollbar-hide"
        >
          {content.points.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="min-w-[250px] flex-none snap-center px-2 transform hover:scale-105 transition-all duration-300"
            >
              <div className="backdrop-blur-md bg-white/10 rounded-xl p-6 flex flex-col items-center space-y-4">
                <img
                  src={point.img}
                  alt={point.text}
                  className="w-[70%] aspect-square object-cover rounded-lg shadow-xl"
                />
                <p className="text-center text-lg text-white font-medium">
                  {point.text}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonials Section - Animated */}
        <AnimatedSection className="mt-10 md:mt-20 mb-6 md:mb-10">
          <h1 className="text-3xl md:text-4xl text-center text-white font-semibold mb-8 md:mb-12 px-4">
            What People Say About Us
          </h1>
          <div className="relative w-full max-w-4xl mx-auto px-2 md:px-4">
            {/* Testimonials Slider */}
            <div className="overflow-hidden">
              <motion.div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${currentTestimonialIndex * 100}%)`,
                }}
              >
                {content.testimonials.map((testimonial, index) => (
                  <div
                    key={index}
                    className="w-full flex-shrink-0 px-2 md:px-4"
                  >
                    <TestimonialCard testimonial={testimonial} />
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center gap-1.5 md:gap-2 mt-4 md:mt-6">
              {content.testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonialIndex(index)}
                  className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 
                        ${
                          currentTestimonialIndex === index
                            ? "bg-white scale-125"
                            : "bg-white/50 hover:bg-white/70"
                        }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={handlePrevTestimonial}
              className="absolute -left-2 md:left-0 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-1.5 md:p-2 rounded-full backdrop-blur-sm transition-all duration-300 Z-50"
              aria-label="Previous testimonial"
            >
              <svg
                className="w-4 h-4 md:w-6 md:h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={handleNextTestimonial}
              className="absolute -right-2 md:right-0 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-1.5 md:p-2 rounded-full backdrop-blur-sm transition-all duration-300"
              aria-label="Next testimonial"
            >
              <svg
                className="w-4 h-4 md:w-6 md:h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </AnimatedSection>

        {/* Registration Section - Animated */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="backdrop-blur-md bg-white/90 w-[80%] mx-auto text-center p-8 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300"
        >
          <h1 className="mb-4 text-3xl font-bold bg-gradient-to-r from-[#765EED] to-[#4395DD] bg-clip-text text-transparent">
            Register Now
          </h1>
          <p className="mb-6 text-xl text-gray-700">
            Join {selectedCategory} today!
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-[#FF8C1E] to-[#FF6B1E] px-6 py-3 rounded-xl text-2xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Get Started
          </button>
        </motion.div>
      </AnimatedSection>

      {/* Workshop Form - Modal remains the same */}
      {showForm && (
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogOverlay className="fixed inset-0 bg-black/50 z-[100]" />
          <DialogContent className="fixed z-[101] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl bg-transparent rounded-xl">
            <div className="w-full">
              <WorkshopForm
                selectedWorkshop={content.cat}
                setShowForm={setShowForm}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default WorkshopMain;
