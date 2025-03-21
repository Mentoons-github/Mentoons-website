import { useState, lazy } from "react";
import { motion } from "framer-motion";
import { ClipLoader } from "react-spinners";

const Contests = lazy(() => import("../contests/contests"));
const FreeComics = lazy(() => import("../freeComics/freeComics"));

const NewsAndContests = () => {
  const [activeTab, setActiveTab] = useState("Mentoons Comics");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedComicType, setSelectedComicType] = useState<
    "picture" | "audio"
  >("picture");

  const handleTabChange = (tab: string) => {
    if (activeTab !== tab) {
      setIsLoading(true);
      setActiveTab(tab);
      setTimeout(() => setIsLoading(false), 300);
    }
  };

  return (
    <div className="w-full h-[500px] border border-transparent border-t-0 bg-white rounded-xl overflow-hidden shadow-xl z-10">
      <div className="flex w-full relative flex-col">
        <div className="flex w-full">
          {["Mentoons Comics", "Contests | Fun Section"].map((tab) => (
            <motion.button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`relative px-5 py-3 w-1/2 text-lg font-semibold tracking-wide transition-all duration-300 ${
                activeTab === tab
                  ? "text-white"
                  : "text-gray-800 hover:text-[#2575fc]"
              }`}
              style={{
                background:
                  activeTab === tab
                    ? "linear-gradient(to left,rgb(22, 192, 84),rgb(103, 255, 76))"
                    : "#d0e1ff",
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tab}
              {tab === "Mentoons Comics" && (
                <span className="absolute top-1/6 right-1/6 text-white px-3 text-xs bg-red-600 rounded-full">
                  Free
                </span>
              )}
            </motion.button>
          ))}
        </div>
        {activeTab === "Mentoons Comics" && (
          <div className="flex justify-start items-start gap-2">
            <button
              type="button"
              onClick={() => setSelectedComicType("picture")}
              className={`flex items-center justify-center px-3 py-2 w-1/4 text-xs sm:text-sm md:text-lg lg:text-xs xl:text-md font-semibold shadow-md transition-all duration-300 h-16 p-4 ${
                selectedComicType === "picture"
                  ? "bg-purple-600 text-white"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              <span className="text-center leading-tight">
                Illustrated <br /> Comic
              </span>
            </button>
            <button
              onClick={() => setSelectedComicType("audio")}
              className={`flex items-center justify-center px-3 py-2 w-1/4 text-xs sm:text-sm md:text-lg lg:text-xs font-semibold shadow-md transition-all duration-300 h-16 ${
                selectedComicType === "audio"
                  ? "bg-orange-500 text-white"
                  : "bg-green-100 text-green-800"
              }`}
            >
              <span className="text-center leading-tight">
                Illustrated Audio <br /> Comic
              </span>
            </button>
          </div>
        )}
      </div>
      <div className="relative w-full h-[445px] z-999 bg-gradient-to-b from-[#87CEFA] via-[#64B5F6] to-[#42A5F5] rounded-lg shadow-md overflow-hidden">
        <img
          src="/assets/home/background/Vector.png"
          alt="cloud"
          className="absolute top-10 left-10 w-1/5"
        />
        <img
          src="/assets/home/background/rb_35675 copy 1.png"
          alt="cloud"
          className="absolute top-10 right-10 w-sm"
        />
        <img
          src="/assets/home/background/Group 566.png"
          alt="cloud"
          className="absolute top-10 right-5 w-24"
        />
        <img
          src="/assets/home/background/Vector.png"
          alt="cloud"
          className="absolute bottom-10 left-10 w-1/5"
        />
        <img
          src="/assets/home/background/Group 566.png"
          alt="cloud"
          className="absolute bottom-10 right-5 w-24"
        />
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-md rounded-lg">
            <ClipLoader color="#36d7b7" loading={true} size={50} />
            <p className="akshar text-gray-700">Loading ...</p>
          </div>
        ) : (
          <div className="w-full p-5 max-h-full overflow-auto bg-white/90 rounded-md shadow-inner">
            {activeTab === "Mentoons Comics" ? (
              <FreeComics comicType={selectedComicType} />
            ) : (
              <Contests />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsAndContests;
