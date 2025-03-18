import { FaCheck, FaStar, FaTimes } from "react-icons/fa";
import { Membership } from "@/types/home/membership";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const MembershipCard = ({ membership }: { membership: Membership }) => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.3 });

  return (
    <motion.div
      ref={sectionRef}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="border-transparent border shadow-xl rounded-lg relative bg-yellow-200 w-full max-w-md p-4 sm:p-5 font-akshar"
    >
      {membership.type === "Platinum" && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="absolute -top-5 left-1/3 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-blue-700 px-3 py-1.5 rounded-md shadow-lg border border-blue-800 z-20"
        >
          <h1 className="text-xs font-medium flex items-center gap-2 text-white">
            Recommended Plan <FaStar className="text-yellow-400" />
          </h1>
        </motion.div>
      )}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center w-full bg-gray-100 p-3 rounded-lg">
          <div>
            <h2
              className={`text-lg font-semibold ${
                membership.type === "Platinum"
                  ? "bg-gradient-to-r from-gray-400 to-gray-500 text-transparent bg-clip-text"
                  : "bg-gradient-to-r from-yellow-400 to-orange-500 text-transparent bg-clip-text"
              }`}
            >
              Mentoons {membership.type}
            </h2>

            <strong className="text-lg md:text-xl text-gray-800">
              ₹{membership.price}
              <span className="text-sm text-gray-500"> / annum</span>
            </strong>
            <p className="text-xs md:text-sm font-medium text-gray-500">
              (~₹{(membership.price / 12).toFixed(0)} per month)
            </p>
          </div>
          <img
            src={membership.character}
            alt={membership.type}
            className="w-10 sm:w-12 object-contain"
          />
        </div>

        <ul className="w-full">
          {membership.benefits.map((data, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className={`flex justify-between items-center gap-2 p-2 rounded-md text-xs md:text-sm transition-all
                ${
                  membership.type === "Platinum"
                    ? data.important
                      ? "bg-gradient-to-l from-purple-500 to-indigo-600 text-white font-bold shadow-lg border-l-4 border-purple-700"
                      : "bg-indigo-50 border-l-4 border-indigo-500 font-semibold"
                    : data.important
                    ? "bg-yellow-200 text-black font-medium shadow border-l-4 border-yellow-500"
                    : "bg-gray-100 border-l-4 border-gray-300 text-gray-600"
                }`}
            >
              <span>{data.feature}</span>
              <div className="flex items-center gap-2">
                <span>{data.details}</span>
                {data.details === "Not available" ? (
                  <FaTimes className="text-red-500" />
                ) : (
                  <FaCheck className="text-green-500" />
                )}
              </div>
            </motion.li>
          ))}
        </ul>
        <div className="flex justify-center mt-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-1.5 text-white text-sm rounded-md transition-all duration-300 shadow-md 
            ${
              membership.type === "Platinum"
                ? "bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800"
                : "bg-gray-500 hover:bg-gray-600"
            }`}
          >
            Buy Now
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default MembershipCard;
