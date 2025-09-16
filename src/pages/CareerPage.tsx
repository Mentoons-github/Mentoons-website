import { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { AppDispatch } from "@/redux/store";
import { getOpenPositions } from "@/redux/careerSlice";
import HeroSection from "@/components/Careerpage/heroSection/heroSection";
import JobsList from "@/components/Careerpage/jobsList";
import EmployeeTestimonials from "@/components/Careerpage/EmployeeTestimonials";

export type OpenPositionsType = {
  _id: string;
  jobTitle: string;
  jobDescription: string;
  jobType: string;
  location: string;
  applicationCount: number;
  skillsRequired: string[];
  thumbnail: string;
};

const CareerPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchTerm, setSearchTerm] = useState("");
  const jobsListRef = useRef<HTMLDivElement>(null);

  const [searchParams] = useSearchParams();
  const jobName = searchParams.get("job");

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (jobsListRef.current && value) {
      jobsListRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const getOpenPositionsData = async () => {
    await dispatch(getOpenPositions({}));
  };

  useEffect(() => {
    getOpenPositionsData();
  }, []);

  useEffect(() => {
    if (jobName && jobsListRef.current) {
      setTimeout(() => {
        jobsListRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 500);
    }
  }, [jobName]);

  return (
    <div>
      <HeroSection onSearch={handleSearch} />
      <JobsList
        searchTerm={searchTerm}
        ref={jobsListRef}
        targetJobName={jobName}
      />
      <EmployeeTestimonials />
    </div>
  );
};

export default CareerPage;
