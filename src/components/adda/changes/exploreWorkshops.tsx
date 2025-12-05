import { WorkshopFormValues } from "@/utils/formik/admin/addWorkshopForm";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

const UNWANTED_IMAGE = [
  "https://mentoons-products.s3.ap-northeast-1.amazonaws.com/uploads/OpinionJournal/1759234938507-b72e75aa-f04d-495a-bdb8-23ee0223d299.png",
  "https://mentoons-products.s3.ap-northeast-1.amazonaws.com/uploads/OpinionJournal/1759234940170-86763a83-9253-4a79-8e39-9d1260ad5fd5.png",
  "https://mentoons-products.s3.ap-northeast-1.amazonaws.com/uploads/OpinionJournal/1759235982570-cdc97188-a8d5-498c-bd65-9faf59c02781.png",
];

const ExploreWorkshops = () => {
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [workshops, setWorkshops] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const fetchWorkshops = useCallback(async () => {
    try {
      const token = await getToken();
      const response = await axios.get(
        `${import.meta.env.VITE_PROD_URL}/workshop/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const workshops = response.data.data.flatMap(
        (workshop: WorkshopFormValues) => {
          const allImages = workshop.workshops.flatMap((w) =>
            w.ageGroups.map((g) => g.image)
          );
          const uniqueImages = [...new Set(allImages)];

          const filteredImages = uniqueImages.filter(
            (img) => !UNWANTED_IMAGE.includes(img as string)
          );
          return filteredImages;
        }
      );

      setWorkshops(workshops);
    } catch (error) {
      console.error("Error fetching workshops:", error);
    }
  }, [getToken]);

  useEffect(() => {
    fetchWorkshops();
  }, [fetchWorkshops]);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || workshops.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % workshops.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, workshops.length]);

  const total = workshops.length;
  const leftIndex = (currentIndex - 1 + total) % total;
  const rightIndex = (currentIndex + 1) % total;

  const handleNavigate = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  return (
    <div className="p-4 my-20">
      <div className="text-center mb-12">
        <h2 className="text-5xl md:text-6xl font-extrabold text-orange-600 mb-4">
          Explore Our Workshops
        </h2>
        <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
          Discover engaging workshops designed to inspire creativity and
          learning
        </p>
        {workshops.length > 0 && (
          <div className="mt-4 text-sm text-gray-600">
            <span className="font-semibold text-orange-600">
              {currentIndex + 1}
            </span>{" "}
            / {total}
          </div>
        )}
      </div>

      {workshops.length === 0 ? (
        <div className="flex items-center justify-center text-6xl font-extrabold text-orange-800 animate-pulse">
          Loading Workshops
        </div>
      ) : (
        <div className="flex items-center justify-center gap-4">
          <div className="w-1/3 h-1/3 cursor-pointer transition-all duration-300 hover:scale-105 hover:opacity-70">
            <img
              src={workshops[leftIndex]}
              alt={`Workshop ${leftIndex + 1}`}
              className="w-full h-full object-contain opacity-50"
              onClick={() => handleNavigate(leftIndex)}
            />
          </div>

          <div
            onClick={() => navigate("/mentoons-workshops")}
            className="group relative cursor-pointer w-1/2 h-1/2 -mx-10 z-10 rounded-xl border-2 border-gray-600 overflow-hidden shadow-2xl transition-transform duration-300 hover:scale-105"
          >
            <div className="absolute inset-0 bg-gray-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            <img
              src={workshops[currentIndex]}
              alt={`Workshop ${currentIndex + 1}`}
              className="w-full h-full object-contain"
            />

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => handleNavigate(leftIndex)}
                  className="bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full transition-all duration-200"
                  aria-label="Previous workshop"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  className="bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full transition-all duration-200"
                  aria-label={isAutoPlaying ? "Pause" : "Play"}
                >
                  {isAutoPlaying ? (
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  )}
                </button>
                <button
                  onClick={() => handleNavigate(rightIndex)}
                  className="bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full transition-all duration-200"
                  aria-label="Next workshop"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="w-1/3 h-1/3 cursor-pointer transition-all duration-300 hover:scale-105 hover:opacity-70">
            <img
              src={workshops[rightIndex]}
              alt={`Workshop ${rightIndex + 1}`}
              className="w-full h-full object-contain opacity-50"
              onClick={() => handleNavigate(rightIndex)}
            />
          </div>
        </div>
      )}

      {workshops.length > 0 && (
        <div className="flex justify-center gap-2 mt-8">
          {workshops.map((_, index) => (
            <button
              key={index}
              onClick={() => handleNavigate(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-orange-600 w-8"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to workshop ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ExploreWorkshops;
