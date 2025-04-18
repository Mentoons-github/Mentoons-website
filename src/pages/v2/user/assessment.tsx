import AssessmentCards from "@/components/assessment/assessmentCards";
import DiscoverYourself from "@/components/assessment/discoverYourself";
import SampleReport from "@/components/assessment/sampleRepoert";
import WeAreHiring from "@/components/assessment/weAreHiring";
import { HIRING } from "@/constant/constants";
import { FAQ_ASSESSMENT } from "@/constant/faq";
import { fetchProducts } from "@/redux/productSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { Hiring } from "@/types";
import { ProductType } from "@/utils/enum";
import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FAQ from "./faq/faq";
import useInView from "@/hooks/useInView";
import { motion } from "framer-motion";

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
    <>
      <DiscoverYourself />
      <SampleReport />
      <motion.div
        ref={ref}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
        }}
        className="flex flex-col lg:flex-row justify-between items-start mt-20 p-5 md:p-10 lg:p-15 gap-10"
      >
        <div className="w-full lg:w-3/4">
          <AssessmentCards assessmentData={products} isInView={isInView} />
        </div>
        <div className="w-full lg:w-1/4 p-3 flex flex-col justify-start items-center gap-10">
          <WeAreHiring hiring={hiring} />
        </div>
      </motion.div>
      <FAQ data={FAQ_ASSESSMENT} />
    </>
  );
};

export default Assessment;
