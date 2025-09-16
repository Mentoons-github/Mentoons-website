import AssessmentCards from "@/components/assessment/assessmentCards";
import DiscoverYourself from "@/components/assessment/discoverYourself";
import SampleReport from "@/components/assessment/sampleRepoert";
import WeAreHiring from "@/components/assessment/weAreHiring";
import { HIRING } from "@/constant/constants";
import { FAQ_ASSESSMENT } from "@/constant/faq";
import useInView from "@/hooks/useInView";
import { fetchProducts } from "@/redux/productSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { Hiring } from "@/types";
import { ProductType } from "@/utils/enum";
import { useAuth } from "@clerk/clerk-react";
import { motion} from "framer-motion";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FAQ from "./faq/faq";

const Assessment = () => {
  const [hiring, setHiring] = useState<Hiring[] | []>([]);

  useEffect(() => {
    setHiring(HIRING);
  }, []);

  const { getToken } = useAuth();
  const dispatch = useDispatch<AppDispatch>();

  const { items: products } = useSelector((state: RootState) => state.products);
  const isMobile = window.innerWidth < 768;
  const { ref, isInView } = useInView(isMobile ? 0.1 : 0.3, false);

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const token = await getToken();
        const assessment = await dispatch(
          fetchProducts({
            type: ProductType.ASSESSMENT,
            token: token!,
          })
        );
        console.log("Assessment", assessment.payload);
      } catch (error: unknown) {
        console.error("Error fetching products:", error);
      }
    };

    fetchAssessments();
  }, [dispatch, getToken]);

  return (
    <>
      <DiscoverYourself />
      <SampleReport />

      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 100 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-start justify-between gap-10 p-5 mt-20 lg:flex-row md:p-10 lg:p-15"
      >
        <div className="w-full lg:w-3/4">
          <AssessmentCards assessmentData={products} isInView={isInView} />
        </div>

        <div className="flex flex-col items-center justify-start w-full gap-10 p-3 lg:w-1/4">
          <WeAreHiring hiring={hiring} />
        </div>
      </motion.div>

      <FAQ data={FAQ_ASSESSMENT} />
    </>
  );
};

export default Assessment;
