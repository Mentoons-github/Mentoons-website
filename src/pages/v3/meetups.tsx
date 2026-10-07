import MeetupsBanner from "@/components/v3/meetups/meetupsBanner";
import MeetupList from "@/components/v3/meetups/meetupList";
import MeetupDetail from "@/components/v3/meetups/meetupDetails";
import { GraduationCap, UsersRound } from "lucide-react";
import { FaUsers } from "react-icons/fa6";

const Meetups = () => {
  const bannerDetails = [
    {
      icon: <FaUsers size={30} />,
      title: "All Meetups",
    },
    {
      icon: <UsersRound size={30} />,
      title: "For Parents",
    },
    {
      icon: <GraduationCap size={30} />,
      title: "For Teens (13-19 yrs)",
    },
  ];

  return (
    <>
      <MeetupsBanner />
      <div className="px-10 mt-10 space-y-5">
        <div className="flex items-start">
          <div className="flex items-center gap-5">
            {bannerDetails.map((data, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center rounded-lg gap-4 w-56 h-28 bg-gray-200"
              >
                {data.icon}
                <p className="text-md font-semibold max-w-[140px] text-center text-nowrap">
                  {data.title}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-stretch gap-5">
          <div className="flex-1">
            <MeetupList />
          </div>
          <MeetupDetail />
        </div>
      </div>
    </>
  );
};

export default Meetups;
