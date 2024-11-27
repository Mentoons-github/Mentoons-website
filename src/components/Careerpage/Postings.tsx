import { useState } from "react";

interface PostingsProps {
  onClick: () => void;
  title: string;
}

const Postings = ({ onClick, title}: PostingsProps) => {
  const [postingData] = useState(() => {
    switch(title.toUpperCase()) {
      // TIRED OF CHANGING BACKEND EVERYTIME SO, I'M DOING THIS
      case "FILMMAKER":
        return {
          image: "/assets/Career/film.png",
          subText: "Lights, Camera, Magic"
        }
      case "ACTOR":
        return {
          image: "/assets/Career/actor.png",
          subText: "More than a role, it's a journey"
        }
      case "STORYTELLER":
        return {
          image: "/assets/Career/story.png",
          subText: "Words have power, let's make them count"
        }
      case "MERN DEVELOPER":
        return {
          image: "/assets/Career/mern.png",
          subText: "Code your way to success"
        }
      case "ILLUSTRATOR":
        return {
          image: "/assets/Career/draw.png",
          subText: "Bringing ideas to life"
        }
      case "VIDEO EDITOR":
        return {
          image: "/assets/Career/video.png",
          subText: "Shaping stories with every frame"
        }
      default:
        return {
          image: "",
          subText: ""
        }
    }
  });

  return (
    <div onClick={onClick} className="cursor-pointer">
      <div className="flex flex-col gap-3 sm:gap-5 transform skew-x-[-10deg] sm:skew-x-[-20deg] lg:skew-x-[-40deg] bg-gradient-to-t from-[#449BB6] to-[#68D2F3] p-3 sm:p-5 relative w-full rounded-lg shadow-[3px_3px_6px_0px_#30819AAD,3px_3px_6px_0px_#36B3DAAD]">
        <img 
          src={postingData.image} 
          alt="arrow-right" 
          className="absolute top-0 right-0 w-full h-full object-left object-contain skew-x-[10deg] sm:skew-x-[20deg] lg:skew-x-[40deg]" 
        />
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold transform skew-x-[10deg] sm:skew-x-[20deg] lg:skew-x-[40deg] text-center whitespace-nowrap ">
          {title}
        </h1>
        <p className="text-sm sm:text-base lg:text-lg transform skew-x-[10deg] sm:skew-x-[20deg] lg:skew-x-[40deg] text-center whitespace-nowrap absolute bottom-0 right-1 lg:right-5 text-white font-bold">{postingData.subText}</p>
      </div>
    </div>
  )
}

export default Postings
