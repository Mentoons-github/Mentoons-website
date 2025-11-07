import { AssessmentProduct, ProductBase } from "@/types/productTypes";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import useInView from "@/hooks/useInView";

const AssessmentCards = ({
  assessmentData,
}: {
  assessmentData: ProductBase[];
}) => {
  const navigate = useNavigate();
  const isMobile = window.innerWidth < 768;
  const { ref, isInView } = useInView(isMobile ? 0.1 : 0.2, false);

  return (
    <div
      ref={ref}
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 place-items-center"
    >
      {assessmentData.map((data, index) => (
        <motion.div
          className="min-h-[600px] w-full max-w-[400px] p-5 shadow-xl rounded-xl space-y-3 bg-white flex flex-col justify-between"
          key={data._id}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.2 }}
          whileHover={{
            scale: 1.02,
            boxShadow: "0px 10px 30px rgba(0,0,0,0.1)",
          }}
        >
          <motion.div
            className="overflow-hidden bg-yellow-300 rounded-xl"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={
              isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.1 }
            }
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              background:
                (data.details as AssessmentProduct["details"])?.color ||
                "bg-yellow-300",
            }}
          >
            <img
              src={
                data.productImages?.[0]?.imageUrl || "/placeholder-image.jpg"
              }
              alt={data.title}
              className="object-cover w-full h-52 sm:h-56"
            />
          </motion.div>
          <motion.h1 className="font-semibold text-lg sm:text-xl lg:text-2xl tracking-[0.5px]">
            {data.title}
          </motion.h1>
          <motion.p className="text-sm sm:text-base lg:text-lg tracking-[0.35px] flex-grow">
            {data.description}
          </motion.p>
          <div className="flex flex-col items-start gap-3 sm:gap-4">
            <p className="text-sm sm:text-base">
              <span className="text-red-500">🕒</span> Duration:{" "}
              {(data.details as AssessmentProduct["details"])?.duration
                ? `${
                    (data.details as AssessmentProduct["details"]).duration
                  } minutes`
                : "N/A"}
            </p>
            <p className="text-sm sm:text-base">
              <span className="text-blue-500">📚</span> Reading level:{" "}
              {(data.details as AssessmentProduct["details"])?.difficulty ||
                "N/A"}
            </p>
            <p className="text-sm sm:text-base">
              <span className="text-green-500">🎯</span> Age:{" "}
              {data.ageCategory || "N/A"}
            </p>
          </div>
          <motion.div className="flex flex-col items-center justify-between w-full p-3 space-y-3 sm:flex-row sm:space-y-0">
            <p className="text-sm sm:text-base">
              <span className="text-xl sm:text-2xl md:text-3xl font-medium">
                ₹ {data.price || "N/A"}/
              </span>{" "}
              Report
            </p>
            <motion.button
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#EC9600] rounded-full font-extrabold text-white text-sm sm:text-base"
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 5px 15px rgba(255,153,31,0.5)",
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
      ))}
    </div>
  );
};

export default AssessmentCards;
