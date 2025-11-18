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
        const token = (await getToken()) || "";
        await dispatch(
          fetchProducts({
            type: ProductType.ASSESSMENT,
            token,
          })
        ).unwrap();
      } catch (error: unknown) {
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
    <div className="w-full">
      {/* Hero Sections */}
      <DiscoverYourself />
      <SampleReport />

      {/* Main Content Area */}
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 py-8 sm:py-10 md:py-12 lg:py-16">
        <div className="max-w-[1920px] mx-auto">
          {isLoading ? (
            <div className="w-full text-center py-12 sm:py-16 lg:py-20">
              <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 border-4 border-blue-100 rounded-full animate-spin border-t-blue-500 mx-auto"></div>
              <p className="mt-4 sm:mt-6 text-base sm:text-lg lg:text-xl text-gray-600 font-medium">
                Loading assessments...
              </p>
            </div>
          ) : error ? (
            <div className="w-full text-center py-12 sm:py-16 lg:py-20">
              <div className="max-w-md mx-auto px-4">
                <svg
                  className="w-16 h-16 sm:w-20 sm:h-20 mx-auto text-red-500 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-red-600 text-base sm:text-lg lg:text-xl font-semibold mb-4">
                  {error}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 sm:px-8 py-2.5 sm:py-3 bg-red-600 text-white text-sm sm:text-base rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium shadow-md hover:shadow-lg"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="w-full text-center py-12 sm:py-16 lg:py-20">
              <div className="max-w-md mx-auto px-4">
                <svg
                  className="w-16 h-16 sm:w-20 sm:h-20 mx-auto text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="text-gray-600 text-base sm:text-lg lg:text-xl font-medium">
                  No assessments available at the moment
                </p>
                <p className="text-gray-500 text-sm sm:text-base mt-2">
                  Please check back later
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col xl:flex-row items-start gap-6 sm:gap-8 lg:gap-10 xl:gap-12">
              {/* Assessment Cards Grid */}
              <div className="w-full xl:w-[calc(100%-320px)] 2xl:w-[calc(100%-360px)]">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-6 sm:mb-8 lg:mb-10">
                  Available Assessments
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3  gap-4 sm:gap-5 md:gap-6 lg:gap-7 xl:gap-8">
                  {products.map((product, index) => (
                    <div
                      key={product._id || index}
                      className="flex justify-center"
                    >
                      <AssessmentCards data={product} index={index} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Sidebar - We Are Hiring */}
              <aside className="w-full xl:w-[300px] 2xl:w-[340px] xl:sticky xl:top-24 xl:self-start">
                <div className="space-y-6">
                  <WeAreHiring hiring={hiring} />
                </div>
              </aside>
            </div>
          )}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="w-full">
        <FAQ data={FAQ_ASSESSMENT} />
      </div>
    </div>
  );
};

export default Assessment;
