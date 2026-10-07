import { Heart, Lightbulb } from "lucide-react";
import { FaUsers } from "react-icons/fa6";

const MeetupsBanner = () => {
  const bannerDetails = [
    {
      icon: <FaUsers size={30} />,
      title: "Meaningful discussions",
    },
    {
      icon: <Heart size={30} />,
      title: "Supportive Community",
    },
    {
      icon: <Lightbulb size={30} />,
      title: "Expert Moderation",
    },
  ];
  return (
    <div className="flex flex-col items-start justify-between px-20 mx-auto my-10 h-96">
      <div className="space-y-3">
        <h1 className="max-w-sm font-semibold">Meetups For Parents & Teens</h1>
        <p className="max-w-lg text-xl">
          Open conversations , real experience and supportive communities. Join
          group discussions to learn, share and grow together
        </p>
      </div>
      <div className="flex items-center gap-5">
        {bannerDetails.map((data, i) => (
          <div
            key={i}
            className="flex items-center justify-center rounded-lg gap-4 text-gray-600"
          >
            {data.icon}
            <p className="text-lg font-semibold max-w-[140px]">{data.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MeetupsBanner;
