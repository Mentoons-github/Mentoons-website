import React from "react";
import TeamImage from "@/assets/imgs/team Illustration.jpg";
import Wordbreak from "./Wordbreak";
import { MiniTestimonailsSlider } from "./Sliders";
import { motion } from "framer-motion";
import WhyMentoons from "./WhyMentoons";

export interface AboutFeatures {
  title: string;
  desc: string;
}
const AboutSection: React.FC = () => {
  const data: AboutFeatures[] = [
    {
      title: "Engaging Learning:",
      desc: "Complex topics presented in an easy-to-understand format.",
    },
    {
      title: "Understanding Puberty:",
      desc: "Navigate the changes of growing up with relatable characters.",
    },
    {
      title: "Relatable Scenarios:",
      desc: "Real-life situations that resonate with young readers",
    },
    {
      title: "Family Bonding:",
      desc: "Perfect for shared reading experiences between parents and children.",
    },
  ];

  return (
    <div
      id="about"
      className="container overflow-hidden py-20 bg-[#59B2DC] space-y-5"
    >
      <div className="flex flex-col lg:flex-row space-y-10   items-center justify-between">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative w-full flex items-center justify-center lg:w-[50%]"
        >
          <motion.img
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 3 }}
            className="rounded-full w-[80%]"
            src={TeamImage}
          />
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 3 }}
            className="absolute top-[-2rem] left-0 lg:top-[-3rem] lg:left-12 bg-white rounded-full h-[6rem] w-[6rem] lg:h-[10rem] lg:w-[10rem]"
          >
            <div className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]  rounded-full text-gray-500 font-medium tracking-wider text-center">
              <span className="text-primary text-2xl lg:text-4xl font-extrabold">
                4K{" "}
              </span>{" "}
              <Wordbreak /> Users
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 3 }}
            className="absolute bottom-0 left-0 bg-primary text-white rounded-full h-[8em] w-[8rem] lg:h-[13rem] lg:w-[13rem]"
          >
            <div className="w-full absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]  rounded-full font-medium tracking-wider text-center px-4">
              <span className="text-2xl lg:text-5xl font-extrabold">20+ </span>{" "}
              <Wordbreak /> Years of comic journey
            </div>
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="space-y-5 w-full lg:w-[50%] text-center lg:text-start text-white"
        >
          <motion.div
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
            className="text-red-500 text-4xl  lg:text-3xl lineBefore"
          >
            About Us
          </motion.div>
          <motion.h2 className="text-2xl lg:text-4xl w-full font-semibold leading-[1.10]">
            Our comics and stories are designed to help children and teenagers
            navigate important life topics with ease and enjoyment.
          </motion.h2>
          <p className="font-semibold text-lg text-red-500">
            Why Our Comics Matter
          </p>
          <div className="space-y-3 flex flex-col w-full m-auto text-center lg:text-start">
            {data?.map((item, idx) => {
              return (
                <div
                  key={idx}
                  className="m-auto lg:m-0 gap-2 text-gray-800 font-bold"
                >
                  <span className="font-semibold text-primary">{idx}.</span>{" "}
                  <span className="underline">{item.title}</span> <br />
                  <span className="pl-0 lg:pl-5  text-white font-thin">
                    {item.desc}
                  </span>
                </div>
              );
            })}
          </div>
          <WhyMentoons />
        </motion.div>
      </div>
      <MiniTestimonailsSlider />
    </div>
  );
};

export default AboutSection;
