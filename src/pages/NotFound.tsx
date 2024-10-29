import React from "react";
import { useNavigate } from "react-router-dom";
// import Logo from "@/assets/imgs/logo.png";
import NotFoundImg from "/404page.png";
import NotFoundCTA from "/404pageCTA.png";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    // <div className="w-screen h-[90vh] flex flex-col items-center justify-center space-y-4">
    //   <img className="w-[20rem]" src={Logo} alt="Not Found" />
    //   <div className="font-semibold text-4xl">Page Not Found!</div>
    //   <button
    //     onClick={() => navigate("/")}
    //     className="bg-primary px-4 py-2 rounded-full border border-primary text-white hover:bg-white hover:text-primary transition-all ease-in-out duration-300"
    //   >
    //     Go to Home
    //   </button>
    // </div>
    <div className="relative flex flex-col items-center justify-evenly h-[93vh] md:h-full">
      <img
        className="w-full h-[40%] md:w-[70%] md:h-[90%] lg:h-[70%]"
        src={NotFoundImg}
        alt="page not found!"
      />
      <div className="absolute bottom-[29%] md:-bottom-4 flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out">
        <img
          onClick={() => navigate("/")}
          className="w-1/2 lg:w-[70%]"
          src={NotFoundCTA}
          alt="home cta button"
        />
      </div>
    </div>
  );
};

export default NotFound;
