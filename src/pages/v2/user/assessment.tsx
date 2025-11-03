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

const Assessment = () => {
  const [hiring, setHiring] = useState<Hiring[] | []>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { getToken } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const { items: products } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    setHiring(HIRING);
  }, []);

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        setIsLoading(true);
        const token = await getToken();
        if (!token) {
          throw new Error("Authentication token not found");
        }
        const result = await dispatch(
          fetchProducts({
            type: ProductType.ASSESSMENT,
            token,
          })
        ).unwrap();
        console.log("Fetched Assessments:", result);
      } catch (error: unknown) {
        console.error("Error fetching assessments:", error);
        setError(
          error instanceof Error ? error.message : "Failed to load assessments"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssessments();
  }, [dispatch, getToken]);

  return (
    <>
      <DiscoverYourself />
      <SampleReport />

      <div className="flex flex-col items-start justify-between gap-6 sm:gap-8 p-4 sm:p-6 md:p-8 lg:p-10 mt-12 sm:mt-16 md:mt-20">
        {isLoading ? (
          <div className="w-full text-center py-8">
            <div className="w-16 h-16 border-4 border-blue-100 rounded-full animate-spin border-t-blue-500 mx-auto"></div>
            <p className="mt-4 text-lg text-gray-600">Loading assessments...</p>
          </div>
        ) : error ? (
          <div className="w-full text-center py-8">
            <p className="text-red-600 text-lg">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="w-full text-center py-8">
            <p className="text-gray-600 text-lg">No assessments available</p>
          </div>
        ) : (
          <div className="w-full lg:w-3/4">
            <AssessmentCards assessmentData={products} />
          </div>
        )}

        <div className="flex flex-col items-center justify-start w-full gap-6 sm:gap-8 p-3 lg:w-1/4">
          <WeAreHiring hiring={hiring} />
        </div>
      </div>

      <FAQ data={FAQ_ASSESSMENT} />
    </>
  );
};

export default Assessment;
