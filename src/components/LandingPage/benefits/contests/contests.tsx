import MembershipModal from "@/components/common/modal/membershipModal";
import { CONSTESTS } from "@/constant/constants";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ComingSoonModal from "@/components/common/ComingSoonModal";
import { useAuth } from "@clerk/clerk-react";
import LoginModal from "@/components/common/modal/loginModal";

const Contests = () => {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [soon, setSoon] = useState(false);
  const navigate = useNavigate();

  const { getToken } = useAuth();

  const handleClick = async (url: string | string[]) => {
    const token = await getToken();

    if (!token) {
      setLoginModalOpen(true);
      return;
    }

    const urls = Array.isArray(url) ? url : [url];

    urls.forEach((fileUrl) => {
      const link = document.createElement("a");
      link.href = fileUrl;
      link.target = "_blank";
      link.download = fileUrl.split("/").pop() || "download.pdf";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  return (
    <div className="relative w-full h-full overflow-hidden p-4">
      <div className="flex flex-col items-center gap-6">
        {CONSTESTS.length > 0 ? (
          CONSTESTS.map(({ image, title, text, url, comingSoon }, index) => (
            <div
              className="flex flex-col md:flex-row w-full max-w-4xl items-center justify-between border-b pb-6 gap-6 bg-blue-200 bg-opacity-50 p-4 rounded-lg shadow-sm"
              key={index}
            >
              <div className="flex flex-col gap-4 flex-1 text-center md:text-left">
                <h1 className="text-lg font-semibold">{title}</h1>
                <button
                  className="px-6 py-2 bg-yellow-400 text-black font-medium rounded-lg shadow-md hover:bg-yellow-500 transition-all w-full md:w-42"
                  onClick={() => {
                    if (comingSoon) {
                      setSoon(true);
                    } else if (text === "Apply") {
                      navigate("/hiring");
                    } else if (text === "Download" && url) {
                      handleClick(url);
                    } else {
                      setIsModalOpen(true);
                    }
                  }}
                >
                  {text}
                </button>
              </div>
              <div className="flex justify-center md:justify-end bg-white">
                <img
                  src={image}
                  alt={title}
                  className="w-[120px] h-[120px] md:w-[150px] md:h-[150px] object-cover rounded-lg shadow-md"
                />
              </div>
            </div>
          ))
        ) : (
          <h1 className="text-xl font-semibold text-gray-600">
            No contests found
          </h1>
        )}
      </div>
      {isModalOpen && <MembershipModal onClose={() => setIsModalOpen(false)} />}
      {soon && <ComingSoonModal setIsModalOpen={setSoon} />}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />
    </div>
  );
};

export default Contests;
