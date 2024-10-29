// import { OPEN_POSITION } from "@/constant";
import { useEffect } from "react";
import FAQCard from "./FAQCard";
import { AppDispatch, RootState } from "@/redux/store";
import { getOpenPositions } from "@/redux/careerSlice";
import { useDispatch, useSelector } from "react-redux";
import Loader from "@/components/common/Loader";
import { toast } from "sonner";

const FrequentlyAskeQuestion = () => {
  const dispatch = useDispatch<AppDispatch>();
 
const getOpenPositionsData = async () => {
  try {
    await dispatch(getOpenPositions());
    toast.success('Open Positions fetched successfully');
  } catch (error:any) {
    toast.error(error.message);
    console.error('Failed to fetch open positions:', error);
  }
}

  useEffect(() => {
    getOpenPositionsData();
  }, [dispatch]);

  const {openPositions,loading} = useSelector((state: RootState) => state.career);
  useEffect(() => {
    getOpenPositionsData();
  }, []);
  if(loading) return <Loader/>
  return (
    <section className="flex flex-col items-center p-4 transition-all duration-300 py-8">
      {/* <h1 className='text-4xl font-semibold pb-8 rubik-bubbles-regular text-dark-gray  text-center'>
        Frequently Ask Question
      </h1> */}
        <div className="p-1 flex flex-col gap-4 md:w-[80%] lg:w-[65%]">
          {Array.isArray(openPositions) && openPositions.length > 0 ? (
            openPositions.map((position: any) => (
              <FAQCard key={position._id} position={position} id={position._id}/>
            ))
          ) : (
            <p className="text-2xl font-bold text-center">No open positions available at the moment.</p>
          )}
        </div>
    </section>
  );
};

export default FrequentlyAskeQuestion;
