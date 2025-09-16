// import { OPEN_POSITION } from "@/constant";
import { getOpenPositions } from "@/redux/careerSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import Loader from "../../common/Loader";
// import FAQCard from "./FAQCard";

const FrequentlyAskeQuestion = () => {
  const dispatch = useDispatch<AppDispatch>();

  const getOpenPositionsData = async () => {
    try {
      await dispatch(getOpenPositions({}));
      toast.success("Open Positions fetched successfully");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
        console.error("Failed to fetch open positions:", error);
      } else {
        toast.error("An unknown error occurred");
        console.error("Failed to fetch open positions:", error);
      }
    }
  };
  useEffect(() => {
    getOpenPositionsData();
  }, []);

  const { openPositions, loading } = useSelector(
    (state: RootState) => state.career
  );
  if (loading) return <Loader />;
  return (
    <section className="flex flex-col items-center p-4 py-8 transition-all duration-300">
      {/* <h1 className='pb-8 text-4xl font-semibold text-center rubik-bubbles-regular text-dark-gray'>
        Frequently Ask Question
      </h1> */}
      <div className="p-1 flex flex-col gap-4 md:w-[80%] lg:w-[65%]">
        {Array.isArray(openPositions) && openPositions.length > 0 ? (
          openPositions.map((position) => (
            // <FAQCard key={position._id} position={position} />
            // //todo:fix this
            <h1>{position.jobTitle}</h1>
          ))
        ) : (
          <p className="text-2xl font-bold text-center">
            No open positions available at the moment.
          </p>
        )}
      </div>
    </section>
  );
};

export default FrequentlyAskeQuestion;
