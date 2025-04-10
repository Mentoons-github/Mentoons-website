import FilterComics from "@/components/comics/FilterComics";
import { ASSESSMENT_DATA } from "@/constant/assessments/assesments";
import { fetchProducts } from "@/redux/productSlice";
import { AppDispatch } from "@/redux/store";
import { ProductType } from "@/utils/enum";
import { useAuth } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const AssesmentPage: React.FC = () => {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        // Fetch products with the current filters
        const token = await getToken();

        const assesment = await dispatch(
          fetchProducts({
            type: ProductType.ASSESSMENT,
            token: token!,
          })
        );
        console.log("Assessment", assesment.payload);
      } catch (error: unknown) {
        console.error("Error fetching products:", error);
      }
    };

    fetchAssessments();
  }, [dispatch, getToken]);
  return (
    <motion.div
      className="px-4 py-8 space-y-6 md:py-16 md:px-5 lg:py-20 md:space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col justify-center items-center space-y-5 md:space-y-7">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <motion.div
            className="text-2xl text-red-500 uppercase md:text-3xl lineBefore"
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            transition={{ delay: 0.2 }}
          >
            ASSESSMENTS
          </motion.div>
        </div>

        <motion.div
          className="space-y-4 font-medium md:space-y-8"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="mt-3 mb-10 text-xl font-extrabold text-center md:text-6xl lg:text-6xl">
            Empower yourself with the{" "}
            <span className="text-primary md:block md:tracking-widest">
              knowledge to become
            </span>{" "}
            the best version of yourself
          </h1>
          <p className="text-base md:text-lg lg:text-xl">
            Discover your true potential with our psychologist-developed
            assessments. Designed to provide actionable insights, these
            assessments are your first step towards personal and professional
            growth.
          </p>
        </motion.div>
      </div>

      <div>
        {ASSESSMENT_DATA.length > 0 && (
          <>
            <div className="block mb-6 w-full text-center lg:hidden">
              <FilterComics />
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
              {ASSESSMENT_DATA?.map((item, index) => (
                <motion.div
                  key={index}
                  className="p-4 mx-auto space-y-3 w-full max-w-md text-black bg-white rounded-2xl shadow-lg group md:p-5" // Added max-width and center alignment
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ y: -5 }}
                >
                  <div className="overflow-hidden rounded-2xl">
                    <figure className="w-full h-[23rem] lg:h-[16rem] rounded-2xl group-hover:scale-105 transition-all ease-in-out duration-300 cursor-pointer">
                      <img
                        src={item.thumbnail}
                        alt={item.name}
                        className="object-contain w-full h-full"
                      />
                    </figure>
                  </div>
                  <div className="space-y-2">
                    <div className="text-lg font-semibold tracking-wide md:text-xl">
                      {item?.name}
                    </div>
                    <div className="text-sm tracking-wide text-black">
                      {item?.desc}
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <div className="text-xs text-rose-500 md:text-sm">
                      Credit: {item.credits}
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-5 py-1 text-sm font-semibold text-white rounded-full border-2 cursor-pointer bg-primary border-primary md:text-base"
                      onClick={() =>
                        navigate(`/assesment-questions`, {
                          state: {
                            questionGallery: item.questionGallery,
                          },
                        })
                      }
                    >
                      TEST NOW
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default AssesmentPage;
