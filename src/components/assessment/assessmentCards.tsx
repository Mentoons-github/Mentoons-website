import { AssessmentProduct, ProductBase } from "@/types/productTypes";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const AssessmentCards = ({
  isInView,
  assessmentData,
}: {
  isInView: boolean;
  assessmentData: ProductBase[];
}) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 place-items-center">
      {assessmentData.map((data, index) => (
        <motion.div
          className="h-[600px] w-full max-w-[400px] p-5 shadow-xl rounded-xl space-y-3 bg-white flex flex-col justify-between"
          key={data._id}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.2 }}
          whileHover={{
            scale: 1.02,
            boxShadow: "0px 10px 30px rgba(0,0,0,0.1)",
          }}
        >
          <motion.div
            className="rounded-xl overflow-hidden bg-yellow-300"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              background: (data.details as AssessmentProduct["details"])?.color,
            }}
          >
            <img
              src={data.productImages?.[0].imageUrl}
              alt="card-img"
              className="w-full h-52 md:h-56 object-cover"
            />
          </motion.div>
          <motion.h1 className="font-semibold text-xl lg:text-2xl tracking-[0.5px]">
            {data.title}
          </motion.h1>
          <motion.p className="text-sm lg:text-md tracking-[0.35px]">
            {data.description}
          </motion.p>
          <div className=" flex flex-col items-start  gap-4">
            <p>
              <span className="text-red-500">🕒</span> Duration:{" "}
              {(data.details as AssessmentProduct["details"]).duration +
                "minutes"}
            </p>
            <p>
              <span className="text-blue-500">📚</span> Reading level:{" "}
              {(data.details as AssessmentProduct["details"]).difficulty}
            </p>
            <p>
              <span className="text-green-500">🎯</span> Age: {data.ageCategory}
            </p>
          </div>
          <motion.div className="flex flex-col md:flex-row justify-between items-center w-full p-3 space-y-3 md:space-y-0">
            <p className="text-sm">
              <span className="font-medium text-2xl md:text-3xl">
                ₹ {data.price}/
              </span>{" "}
              Report
            </p>
            <motion.button
              className="px-4 py-2 bg-[#EC9600] rounded-full font-extrabold text-white"
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 5px 15px rgba(255,153,31,0.5)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                navigate(`/assesment-questions`, {
                  state: {
                    questionGallery: (
                      data.details as AssessmentProduct["details"]
                    )?.questionGallery,
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
