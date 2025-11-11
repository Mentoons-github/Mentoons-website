import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AssessmentProduct, ProductBase } from "@/types/productTypes";
import useInView from "@/hooks/useInView";

const AssessmentCard = ({
  data,
  index,
}: {
  data: ProductBase;
  index: number;
}) => {
  const navigate = useNavigate();
  const isMobile = window.innerWidth < 768;

  const { ref, isInView } = useInView(isMobile ? 0.05 : 0.1, true);

  return (
    <motion.div
      ref={ref}
      className="
        h-full
        w-full 
        max-w-[340px] 
        sm:max-w-[360px] 
        md:max-w-[380px] 
        lg:max-w-[400px]
        min-h-[520px]
        sm:min-h-[560px]
        md:min-h-[580px]
        lg:min-h-[600px]
        p-4 
        sm:p-5 
        md:p-6
        shadow-md 
        hover:shadow-2xl 
        rounded-xl 
        sm:rounded-2xl
        space-y-3 
        sm:space-y-4
        bg-white 
        flex 
        flex-col 
        justify-between
        transition-shadow 
        duration-300
      "
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{
        duration: 0.5,
        ease: "easeOut",
        delay: index * 0.15,
      }}
      whileHover={{
        scale: 1.02,
        boxShadow: "0px 10px 30px rgba(0,0,0,0.15)",
      }}
    >
      {/* Image Container */}
      <motion.div
        className="
          overflow-hidden 
          rounded-lg 
          sm:rounded-xl
          w-full
          h-48
          sm:h-52
          md:h-56
          lg:h-60
        "
        initial={{ opacity: 0, scale: 1.1 }}
        animate={
          isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.1 }
        }
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          background:
            (data.details as AssessmentProduct["details"])?.color || "#FFD54F",
        }}
      >
        <img
          src={data.productImages?.[0]?.imageUrl || "/placeholder-image.jpg"}
          alt={data.title}
          className="object-cover w-full h-full"
        />
      </motion.div>

      {/* Title */}
      <motion.h1
        className="
          font-semibold 
          text-lg 
          sm:text-xl 
          md:text-2xl
          tracking-[0.5px]
          line-clamp-2
          min-h-[3.5rem]
          sm:min-h-[4rem]
        "
      >
        {data.title}
      </motion.h1>

      {/* Description */}
      <motion.p
        className="
          text-sm 
          sm:text-base 
          md:text-lg
          tracking-[0.35px] 
          flex-grow
          line-clamp-3
          text-gray-600
        "
      >
        {data.description}
      </motion.p>

      {/* Details Section */}
      <div className="flex flex-col gap-2 sm:gap-2.5 md:gap-3 py-2">
        <div className="flex items-center gap-2 text-sm sm:text-base">
          <span className="text-lg sm:text-xl">🕒</span>
          <span className="font-medium text-gray-700">Duration:</span>
          <span className="text-gray-600">
            {(data.details as AssessmentProduct["details"])?.duration
              ? `${(data.details as AssessmentProduct["details"]).duration} min`
              : "N/A"}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm sm:text-base">
          <span className="text-lg sm:text-xl">📚</span>
          <span className="font-medium text-gray-700">Reading level:</span>
          <span className="text-gray-600">
            {(data.details as AssessmentProduct["details"])?.difficulty ||
              "N/A"}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm sm:text-base">
          <span className="text-lg sm:text-xl">🎯</span>
          <span className="font-medium text-gray-700">Age:</span>
          <span className="text-gray-600">{data.ageCategory || "N/A"}</span>
        </div>
      </div>

      {/* Price and CTA Section */}
      <motion.div
        className="
          flex 
          flex-col 
          sm:flex-row
          items-center 
          justify-between 
          w-full 
          pt-3
          sm:pt-4
          gap-3 
          sm:gap-2
          md:gap-3
          border-t
          border-gray-100
        "
      >
        <div className="text-center sm:text-left flex-shrink-0">
          <span
            className="
            text-xl
            sm:text-2xl 
            md:text-3xl
            font-bold
            text-gray-800
          "
          >
            ₹{data.price || "N/A"}
          </span>
          <span className="text-xs sm:text-sm text-gray-500 ml-1">/Report</span>
        </div>

        <motion.button
          className="
            px-4
            sm:px-5 
            md:px-6
            py-2
            sm:py-2
            md:py-2.5
            bg-[#EC9600] 
            rounded-full 
            font-bold
            sm:font-extrabold
            text-white 
            text-xs
            sm:text-sm 
            md:text-base
            whitespace-nowrap
            shadow-md
            hover:shadow-lg
            transition-all
            duration-200
            flex-shrink-0
          "
          whileHover={{
            scale: 1.05,
            boxShadow: "0px 5px 20px rgba(236, 150, 0, 0.4)",
          }}
          whileTap={{ scale: 0.95 }}
          onClick={() =>
            navigate(`/assessment-questions`, {
              state: {
                questionGallery:
                  (data.details as AssessmentProduct["details"])
                    ?.questionGallery || [],
                assessment: data.title,
              },
            })
          }
        >
          START TEST
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default AssessmentCard;
