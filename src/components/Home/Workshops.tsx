import Heading from "../common/Heading";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";

type CampDetails = {
  id: number;
  imgUrl: string;
  CornerImgUrl: string;
  title: string;
  description: string;
  ageGroup: string;
  timetable: string;
};

const Workshops = () => {
  const navigate = useNavigate();

  const campDetails: CampDetails[] = [
    {
      id: 1,
      imgUrl: "/Kids_camp.jpg",
      CornerImgUrl: "/Buddy camp.png",
      title: "Buddy Camp",
      description:
        "Interactive Friendship Workshop for Children (Ages 6-12). Social Skills Development & Moral Values Education. Buddy Camp is a fun and educational workshop designed to help children ages 6-12 build lasting friendships and develop important social skills. Our interactive program focuses on teaching kids about moral values and how to start conversations with confidence.",
      ageGroup: "6-12 years",
      timetable: "Monday - Friday, 9 AM - 12 PM",
    },
    {
      id: 2,
      imgUrl: "/Teen_camp.jpg",
      CornerImgUrl: "/Teen camp .png",
      title: "Teen Camp",
      description:
        "Teen Camp: Identity Workshop For Teenagers (13-19 Years). Substance De-Addiction, Scrolling De-Addiction & Hormonal Changes. Help your teenager navigate the challenges of adolescence with our comprehensive Teen Camp workshop. Designed for young people aged 13-19, our program addresses crucial topics that impact today's youth.",
      ageGroup: "13-18 years",
      timetable: "Monday - Friday, 1 PM - 4 PM",
    },
    {
      id: 3,
      imgUrl: "/Family_camp.jpg",
      CornerImgUrl: "/Family camp.png",
      title: "Family Camp",
      description:
        "Family Camp is designed to strengthen family bonds through engaging activities and workshops. Our program includes art workshops, social media de-addiction, and gaming de-addiction for all family members.",
      ageGroup: "All ages",
      timetable: "Saturday - Sunday, 10 AM - 2 PM",
    },
  ];

  const [selectedCamp, setSelectedCamp] = useState<CampDetails | null>(
    campDetails[0]
  );

  const handleCampClick = (id: number) => {
    const camp = campDetails.find((camp) => camp.id === id);
    setSelectedCamp(camp || null);
  };

  const handleImageClick = () => {
    navigate("/mentoons-workshops");
  };

  return (
    <div className="w-full h-full py-10 relative">
      <Heading heading="Workshops" />
      <div className="h-[3rem]"></div>
      <div
        className="h-[10rem] w-[20rem] absolute right-0 top-28 hidden lg:block transition-all duration-500"
        style={{ opacity: selectedCamp ? 1 : 0 }} 
      >
        <img
          src={selectedCamp?.CornerImgUrl}
          alt="Corner"
          className="transition-opacity duration-500"
        />
      </div>
      <div className="w-4/5 m-auto relative">
        <div className="flex flex-col lg:flex-row mb-10 lg:mb-0 gap-4 lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2 lg:top-[-4rem]">
          {campDetails.map((camp) => (
            <button
              key={camp.id}
              onClick={() => handleCampClick(camp.id)}
              className="bg-men-blue text-white p-2 lg:p-5 font-bold rounded-lg lg:rounded-none lg:rounded-t-2xl transition-transform duration-300 ease-in-out transform hover:scale-105 hover:bg-men-light-blue hover:shadow-lg"
            >
              {camp.title}
            </button>
          ))}
        </div>

        {selectedCamp && (
          <div className="text-center bg-light-yellow flex flex-col lg:flex-row items-center justify-center gap-6 py-10 px-4 w-full rounded-xl">
            <div
              className="w-[15rem] h-[15rem] rounded-full overflow-hidden border-4 border-white relative cursor-pointer transform transition-transform duration-300 hover:scale-105 hover:shadow-xl"
              style={{
                backgroundImage: `url(${selectedCamp.imgUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                boxShadow: "6px 6px 0px rgba(103, 102, 102, 0.2)",
              }}
              onClick={handleImageClick}
            >
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 h-[4rem] flex items-center justify-center transition-all duration-300 ease-in-out">
                <span className="text-white text-lg font-bold flex items-center gap-3">
                  <FaEye />
                  View More
                </span>
              </div>
            </div>
            <div className="w-3/4">
              <h2 className="text-5xl font-extrabold mt-4 text-men-blue">
                {selectedCamp.title}
              </h2>

              <div className="mt-4 flex flex-col gap-5">
                <div>
                  <p className="text-lg mt-2 text-center lg:text-left px-5 py-2">
                    {selectedCamp.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Workshops;
