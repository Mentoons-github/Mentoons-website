import React from "react";
import Wordbreak from "./Wordbreak";
import { FaLock } from "react-icons/fa";
import price1 from "@/assets/imgs/price1.png";
import price2 from "@/assets/imgs/price2.png";
import price3 from "@/assets/imgs/price3.png";
import { TiTick } from "react-icons/ti";
import { v4 as uuidv4 } from "uuid";
import { motion } from "framer-motion";

const Pricing: React.FC = () => {
  const data = [
    " Free Home Delivery",
    "Monthly Five Comic Books",
    "Download Limited Assets",
    "Free Comic Arts",
  ];

  return (
    <div className="container bg-green-500 py-10 space-y-10">
      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
          className="text-red-500 lineBefore text-4xl"
        >
          Price Plan
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
          className="font-extrabold text-white text-5xl lg:text-6xl leading-[1.15]"
        >
          Read Comics <Wordbreak /> Everyday.
        </motion.div>
      </div>
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row bg-white items-center justify-between">
          <motion.div
            initial={{ opacity: 0.5 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            whileHover={{ scale: 1.05 }}
            className="hover:scale-105 transition-all duration-700 ease-in-out bg-white text-center w-full space-y-4 py-6 px-6"
          >
            <div className="text-center">
              <div className="text-2xl font-semibold">Starter</div>
              <div className="text-gray-500 text-lg">Per Month</div>
            </div>
            <div className="m-auto">
              <img className="m-auto" src={price1} />
            </div>
            <div className="text-center font-bold text-4xl">Free</div>
            <div className="space-y-2">
              {data?.map((item: string) => {
                return (
                  <div key={uuidv4()} className="flex items-center gap-2">
                    <TiTick className="text-primary text-2xl" />
                    {item}
                  </div>
                );
              })}
            </div>
            <button className="bg-gray-700 font-semibold text-white px-9 py-3 rounded-full w-fit">
              Subscribe
            </button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0.5 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            whileHover={{ scale: 1.05 }}
            className="hover:scale-105 transition-all duration-700 ease-in-out bg-white text-center w-full space-y-4 py-6 px-6"
          >
            <div className="text-center">
              <div className="text-2xl font-semibold">Basic</div>
              <div className="text-gray-500 text-lg">Per Month</div>
            </div>
            <div className="m-auto">
              <img className="m-auto" src={price2} />
            </div>
            <div className="text-center font-bold text-4xl">Rs. 10.99</div>
            <div className="space-y-2">
              {data?.map((item: string) => {
                return (
                  <div key={uuidv4()} className="flex items-center gap-2">
                    <TiTick className="text-primary text-2xl" />
                    {item}
                  </div>
                );
              })}
            </div>
            <button className="bg-gray-700 font-semibold text-white px-9 py-3 rounded-full w-fit">
              Subscribe
            </button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0.5 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            whileHover={{ scale: 1.05 }}
            className="hover:scale-105 transition-all duration-700 ease-in-out bg-primary lg:relative lg:bottom-[2rem] rounded-md text-white text-center w-full space-y-4 py-6 px-6"
          >
            <div className="">
              <div className="text-2xl font-semibold">Recommended</div>
              <div className="text-white text-lg">Per Month</div>
            </div>
            <div className="">
              <img className="mx-auto airplane-image" src={price3} />
            </div>
            <div className="text-center font-bold text-4xl">Rs. 19.99</div>
            <div className="space-y-2">
              {data?.map((item: string) => {
                return (
                  <div key={uuidv4()} className="flex items-center gap-2">
                    <TiTick className="text-white text-2xl" />
                    {item}
                  </div>
                );
              })}
            </div>
            <button className="bg-white font-semibold text-primary px-9 py-3 rounded-full w-fit">
              Subscribe
            </button>
          </motion.div>
          {/* <div className="hover:scale-105 transition-all duration-700 ease-in-out bg-white text-center w-full space-y-4 py-6 px-6">
            <div className="text-center">
              <div className="text-2xl font-semibold">Superstars</div>
              <div className="text-gray-500 text-lg">Per Month</div>
            </div>
            <div className="m-auto">
              <img className="m-auto" src={price4} />
            </div>
            <div className="text-center font-bold text-4xl">$29.9</div>
            <div className="space-y-2">
              {data?.map((item: string) => {
                return (
                  <div key={uuidv4()} className="flex items-center gap-2">
                    <TiTick className="text-primary text-2xl" />
                    {item}
                  </div>
                );
              })}
            </div>
            <button className="bg-gray-700 font-semibold text-white px-9 py-3 rounded-full w-fit">
              Subscribe
            </button>
          </div> */}
        </div>
        <div className="flex flex-col space-y-2 lg:space-y-0 md:flex-row items-center  justify-between">
          <div className="text-red-500 underline font-medium text-lg">
            Ask Any Question
          </div>
          <div className="flex items-center justify-center text-gray-200 gap-2">
            <FaLock /> All Payments Are Highly Secured.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
