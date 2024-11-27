import EmployeeTestimonials from "@/components/Careerpage/EmployeeTestimonials"
import HiringHeroSection from "@/components/Careerpage/HiringHeroSection"
import OpenPositions from "@/components/Careerpage/OpenPositions"
import { getOpenPositions } from "@/redux/careerSlice";
import { AppDispatch } from "@/redux/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export type OpenPositionsType = {
  _id: string;
  jobTitle: string;
  jobDescription: string;
  jobType: string;
  location: string;
  applicationCount: number;
  skillsRequired: string[];
  thumbnail: string;
}

const CareerPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const getOpenPositionsData = async () => {
    const data =  await dispatch(getOpenPositions());
    console.log(data.payload.data.jobs);
  };
  useEffect(() => {
    getOpenPositionsData();
  }, []);
  return (
    <div className="">
        <HiringHeroSection />
        <OpenPositions />
        <EmployeeTestimonials />
    </div>
  )
}

export default CareerPage
