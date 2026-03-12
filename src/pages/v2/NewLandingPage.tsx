import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import LandingBanner from "@/components/adda/landing/landingHero/banner";
import { FaChevronDown } from "react-icons/fa6";
import {
  LandingAchievements,
  LandingColors,
  LandingCommunities,
  LandingIssues,
  LandingItems,
  LandingParentPoints,
  LandingResults,
} from "@/constant/adda/Landing/landingItems";
import { ExternalLink } from "lucide-react";
import { BiSolidMessage } from "react-icons/bi";
import { toast } from "sonner";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { User } from "@/types";
import EnquiryModal from "@/components/modals/EnquiryModal";
import { ModalMessage } from "@/utils/enum";

const NewLandingPage = () => {
  const navigate = useNavigate();
  const [colorIndex, setColorIndex] = useState(0);
  const [openIssue, setOpenIssue] = useState<null | number>(null);
  const [openAchievement, setOpenAchievement] = useState<null | number>(null);
  const [openParent, setOpenParent] = useState<null | number>(null);
  const [openResults, setOpenResults] = useState<null | number>(null);
  const [enquiryMessage, setEnquiryMessage] = useState("");
  const [enquiryEmail, setEnquiryEmail] = useState("");
  const [enquiryName, setEnquiryName] = useState("");
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const { getToken } = useAuth();
  const [user, setUser] = useState<null | User>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % LandingColors.length);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = await getToken();
      if (!token) {
        throw new Error("No token found");
      }
      const response = await axios.get(
        `${import.meta.env.VITE_PROD_URL}/user/user/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.status !== 200) {
        throw new Error("Failed to fetch user details");
      }
      setUser(response.data.data);
    };
    fetchUserDetails();
  }, []);

  const handleDoubtSubmission = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (enquiryMessage.trim().length < 50) {
      toast.error("Message must be at least 50 characters long.");
      return;
    }

    try {
      const queryResponse = await axios.post(
        `${import.meta.env.VITE_PROD_URL}/query`,
        {
          message: enquiryMessage,
          name: enquiryName,
          email: enquiryEmail,
          queryType: "general",
        },
      );
      if (queryResponse.status === 201) {
        setEnquiryMessage("");
        setShowEnquiryModal(true);
      }
    } catch (error: any) {
      setEnquiryMessage("");
      toast.error(error?.response?.data?.message || "Failed to submit message");
    }
  };

  return (
    <>
      <LandingBanner />
      <div className="min-h-screen bg-gradient-to-b from-white to-orange-50 px-4 md:px-12 lg:px-28 pb-8 lg:py-16 space-y-10 md:space-y-14">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-10 flex flex-col-reverse lg:flex-col">
            <div className="flex flex-wrap gap-3 md:gap-6 mt-5 lg:mt-0">
              {LandingItems.map((item, ind) => (
                <div
                  key={ind}
                  onClick={() => navigate(item.url)}
                  className="px-3 md:px-6 py-2 md:py-3 rounded-xl border border-orange-200 
                bg-white shadow-sm md:text-lg font-semibold cursor-pointer
                transition-all duration-300
                hover:bg-orange-500 hover:text-white hover:scale-105 hover:shadow-lg"
                >
                  {item.title}
                </div>
              ))}
            </div>

            <div className="space-y-6 max-w-2xl">
              <h2 className="text-3xl lg:text-6xl font-bold leading-tight text-gray-900">
                <span style={{ color: LandingColors[colorIndex] }}>
                  Mentoring
                </span>{" "}
                Through{" "}
                <span style={{ color: LandingColors[colorIndex] }}>
                  Cartoons
                </span>
              </h2>

              <p className="text-xl text-gray-600">
                Discover how our services help families create a healthy balance
                between gadgets, social media and real-life relationships.
              </p>

              <div className="w-full flex justify-between">
                <img
                  src="/assets/home/psychologist-developed.png"
                  alt=""
                  className="h-40 md:h-60 lg:h-40"
                />
                <img
                  src="/assets/home/landing-mobile.png"
                  alt=""
                  className="h-40 md:h-60 lg:h-40 block"
                />
              </div>
            </div>
          </div>

          <div className="hidden lg:flex justify-center lg:justify-end">
            <div className="relative">
              <div className="absolute -inset-4 bg-orange-200 blur-2xl opacity-40 rounded-full"></div>

              <img
                src="https://mentoons-products.s3.ap-northeast-1.amazonaws.com/1234/team+Illustration+3.png"
                alt="Mentoon Team"
                className="relative w-full max-w-lg drop-shadow-xl"
              />
            </div>
          </div>
        </div>

        {/* ISSUES SECTION */}
        <div className="space-y-8 md:space-y-12">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 relative">
            <span className="relative z-10">
              Are you struggling with the following issues?
            </span>
            <div className="absolute left-1/2 -bottom-3 -translate-x-1/2 w-24 h-1 bg-orange-400 rounded-full"></div>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-8 items-start self-start">
            {LandingIssues.map((issue, ind) => {
              const isOpen = openIssue === ind;

              return (
                <div
                  key={ind}
                  onClick={() => setOpenIssue(isOpen ? null : ind)}
                  className="cursor-pointer bg-white p-6 rounded-3xl border-2 border-orange-100 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 via-yellow-400 to-pink-400"></div>

                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-14 h-14 flex items-center justify-center rounded-xl text-2xl"
                        style={{
                          color: issue.iconColor,
                          backgroundColor: `${issue.iconColor}20`,
                        }}
                      >
                        {issue.icon}
                      </div>

                      <h3 className="text-xl font-semibold text-gray-800">
                        {issue.title}
                      </h3>
                    </div>

                    <FaChevronDown
                      className={`transition-transform duration-300 text-gray-500 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>

                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      isOpen ? "max-h-40 mt-4 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <p className="text-lg font-medium text-gray-600">
                      {issue.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION BREAK */}
        <div className="relative py-14 lg:py-24 bg-gradient-to-br from-orange-50 via-white to-yellow-50 rounded-3xl overflow-hidden">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-orange-200 rounded-full blur-3xl opacity-40"></div>
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-pink-200 rounded-full blur-3xl opacity-40"></div>

          <div className="grid lg:grid-cols-2 gap-10 items-center max-w-6xl mx-auto px-6">
            <div className="space-y-6 ">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight">
                If you're facing these challenges,
                <span className="block text-[#FFAA15] mt-2">don't worry!</span>
              </h2>

              <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                We understand what families go through in today's digital world.
                Our programs help children build emotional balance, creativity,
                and meaningful real-life relationships.
              </p>

              <button
                onClick={() => navigate("/mentoons-workshops")}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-orange-400 to-orange-500 text-white font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                Discover How →
              </button>
            </div>

            {/* IMAGE */}
            <div className="flex justify-center lg:justify-end">
              <img
                src="/assets/home/help.png"
                alt="Help Illustration"
                className="w-[320px] md:w-[420px] drop-shadow-xl hover:scale-105 transition duration-300"
              />
            </div>
          </div>
        </div>

        {/* ACHIEVEMENTS */}
        <div className="space-y-12">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800">
            By choosing Mentoons as your guide you can achieve the following
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-8 items-start self-start">
            {LandingAchievements.map((item, ind) => {
              const isOpen = openAchievement === ind;
              return (
                <div
                  key={ind}
                  onClick={() => setOpenAchievement(isOpen ? null : ind)}
                  className="group bg-white p-4 lg:p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 hover:bg-[#e8eeee]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-14 h-14 flex items-center justify-center rounded-xl text-2xl"
                        style={{
                          color: item.color,
                          backgroundColor: `${item.color}20`,
                        }}
                      >
                        {item.icon}
                      </div>

                      <h3 className="text-xl font-semibold text-gray-800">
                        {item.title}
                      </h3>
                    </div>

                    <FaChevronDown
                      className={`transition-transform duration-300 text-gray-500 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>

                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      isOpen ? "max-h-40 mt-4 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <p className="text-lg font-medium text-gray-600">
                      {item.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* PARENTS SECTION */}
        <div className="relative overflow-hidden rounded-3xl py-5 lg:py-16">
          <div className="relative grid lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-5 md:space-y-8 bg-white shadow-md border border-gray-100 p-5 lg:p-8 rounded-3xl">
              <h2 className="text-5xl font-bold text-gray-700">PARENTS!</h2>

              <div className="space-y-1">
                <p className="text-xl text-gray-500 leading-relaxed max-w-xl">
                  Begin your journey with us today and unlock the true potential
                  of your child.
                </p>

                <button
                  className="inline-flex items-center gap-2 text-blue-700 font-medium cursor-pointer group w-fit"
                  onClick={() => navigate("/messag-from-founder")}
                >
                  <span className="relative">
                    Message from the founder
                    <span className="absolute left-0 -bottom-0.5 w-0 h-[2px] bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                  </span>

                  <ExternalLink className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </div>

              <div className="space-y-4">
                {LandingParentPoints.map((item, ind) => {
                  const isOpen = openParent === ind;

                  return (
                    <div
                      key={ind}
                      onClick={() => setOpenParent(isOpen ? null : ind)}
                      className="cursor-pointer bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition"
                    >
                      {/* header */}
                      <div className="flex justify-between items-center">
                        <div className="flex gap-4 items-center">
                          <div
                            className={`w-12 h-12 flex items-center justify-center rounded-xl text-xl ${item.color}`}
                          >
                            {item.icon}
                          </div>

                          <p className="text-lg font-semibold text-gray-800">
                            {item.title}
                          </p>
                        </div>

                        <FaChevronDown
                          className={`transition-transform duration-300 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </div>

                      {/* animated text */}
                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          isOpen
                            ? "max-h-40 mt-4 opacity-100"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        <p className="text-gray-600 text-lg">{item.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => navigate("/")}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-orange-400 to-orange-500 text-white font-semibold  shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                Start Your Journey →
              </button>
            </div>

            <div className="space-y-8 shadow-md border border-gray-100 bg-white p-5 lg:p-8 rounded-3xl">
              <h2 className="text-4xl font-bold text-gray-700">
                Join Our Community
              </h2>

              <p className="text-gray-500 text-lg">
                Be part of a growing family focused on learning, creativity and
                emotional well-being.
              </p>

              <div className="grid grid-cols-2 gap-4 md:gap-5">
                {LandingCommunities.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 md:gap-4 bg-white p-3 md:p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  >
                    <div
                      className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl text-xl ${item.color}`}
                    >
                      {item.icon}
                    </div>

                    <p className="text-lg font-semibold text-gray-700">
                      {item.name}
                    </p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigate("/community")}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-orange-400 to-orange-500 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                Join Now →
              </button>
            </div>
          </div>
        </div>

        {/* RESULTS SECTION */}
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div className=" lg:space-y-10 space-y-5 md:space-y-8 bg-white shadow-md border border-gray-100 p-5 lg:p-8 rounded-3xl">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-700">
              The Results You Will See
            </h2>

            <div className="grid gap-5 lg:gap-6 items-start">
              {LandingResults.map((item, ind) => {
                const isOpen = openResults === ind;

                return (
                  <div
                    key={ind}
                    onClick={() => setOpenResults(isOpen ? null : ind)}
                    className="cursor-pointer relative group rounded-xl p-[2px] bg-gradient-to-br from-orange-400 via-pink-400 to-indigo-400 transition-all duration-300 hover:scale-[1.03]"
                  >
                    <div className="bg-white rounded-3xl p-4 lg:p-7 shadow-lg group-hover:shadow-2xl transition">
                      {/* HEADER */}
                      <div className="flex items-center justify-between ">
                        <div className="flex items-center gap-4">
                          <div
                            className="w-14 h-14 flex items-center justify-center rounded-xl text-2xl"
                            style={{
                              color: item.color,
                              backgroundColor: `${item.color}20`,
                            }}
                          >
                            {item.icon}
                          </div>

                          <h3 className="text-xl font-semibold text-gray-800">
                            {item.title}
                          </h3>
                        </div>

                        {/* Arrow */}
                        <FaChevronDown
                          className={`text-gray-500 transition-transform duration-300 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </div>

                      {/* EXPANDABLE TEXT */}
                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          isOpen
                            ? "max-h-40 opacity-100 mt-2"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        <p className="text-gray-600 text-lg leading-relaxed">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-6 p-8 text-center border border-orange-100 bg-gradient-to-br from-white to-orange-50 shadow-xl rounded-3xl">
            <div className="md:px-4 lg:px-8 mx-auto">
              <div className="flex items-center justify-center gap-4 py-2 md:pb-6">
                <div>
                  <BiSolidMessage
                    className="text-5xl"
                    style={{ color: "#FFAA15" }}
                  />
                </div>
              </div>
              <div>
                <h3
                  className="text-xl font-bold md:text-3xl md:pb-4"
                  style={{ color: "#FFAA15" }}
                >
                  Have Doubts? We are here to help you!
                </h3>
                <p className="pt-2 pb-2 text-gray-600 md:text-xl md:pb-6">
                  Contact us for additional help regarding your workshop or
                  purchase made on this platform, We will help you!
                </p>
              </div>
              <div>
                <form
                  className="flex flex-col w-full gap-4"
                  onSubmit={(e) => handleDoubtSubmission(e)}
                >
                  <div className="flex gap-4">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      placeholder="Your Name"
                      value={user?.name || enquiryName}
                      onChange={(e) => setEnquiryName(e.target.value)}
                      className="w-full p-3 rounded-xl border-2 border-orange-200 focus:border-orange-400 outline-none shadow-sm"
                      style={{
                        border: `2px solid #FFAA15`,
                      }}
                      required
                    />
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={user?.email || enquiryEmail}
                      onChange={(e) => setEnquiryEmail(e.target.value)}
                      placeholder="Your Email"
                      className="w-full p-3 rounded-xl border-2 border-orange-200 focus:border-orange-400 outline-none shadow-sm"
                      style={{
                        border: `2px solid #FFAA15`,
                      }}
                      required
                    />
                  </div>
                  <textarea
                    required
                    name="doubt"
                    id="doubt"
                    value={enquiryMessage}
                    onChange={(e) => setEnquiryMessage(e.target.value)}
                    placeholder="Enter your doubt here"
                    className="w-full p-3 rounded-xl border-2 border-orange-200 focus:border-orange-400 outline-none shadow-sm min-h-[120px]"
                    style={{
                      border: `2px solid #FFAA15`,
                    }}
                  ></textarea>
                  <button
                    className="w-full py-4 text-lg font-bold text-white rounded-xl bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl"
                    style={{
                      backgroundColor: "#FFAA15",
                    }}
                    type="submit"
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
        {showEnquiryModal && (
          <EnquiryModal
            isOpen={showEnquiryModal}
            onClose={() => setShowEnquiryModal(false)}
            message={ModalMessage.ENQUIRY_MESSAGE}
          />
        )}
      </div>
    </>
  );
};

export default NewLandingPage;
