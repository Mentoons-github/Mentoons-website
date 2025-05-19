import { BiLogoInstagramAlt } from "react-icons/bi";
import { FaFacebookF, FaLinkedinIn } from "react-icons/fa";

const FounderNote = ({ scroll = false }: { scroll?: boolean }) => {
  return (
    <section
      className={`w-full p-[.6px] rounded-xl max-h-[calc(100vh-204px)] overflow-y-auto ${
        scroll ? "" : "lg:bg-orange-100"
      }`}
    >
      <div className="flex items-start justify-center h-full gap-5">
        <div
          className={`flex flex-col items-center w-full h-full max-w-xl gap-2 sm:gap-3 lg:gap-4 p-4 sm:p-4 rounded-xl ${
            scroll ? "h-full" : "shadow-xl"
          }`}
        >
          <div className="flex flex-col items-center justify-center pt-4 text-center ">
            <h1
              className={`text-3xl sm:text-4xl lg:text-5xl font-semibold ${
                scroll ? "text-[#FF4500]" : "text-orange-800"
              }`}
            >
              Mentor Mahesh
            </h1>
            <h2
              className={`text-xl sm:text-2xl lg:text-3xl font-medium ${
                scroll ? "text-[#008080]" : "text-orange-800"
              }`}
            >
              Mentoons Founder
            </h2>
          </div>

          <div className="flex justify-center">
            <img
              src="/assets/home/homepage fillers/sir Illustration.png"
              alt="founder image"
              className="w-full max-w-[140px] sm:max-w-[160px] md:max-w-[180px] lg:max-w-[280px] rounded-lg object-contain"
            />
          </div>

          <p className="px-1 mt-2 text-sm leading-relaxed text-gray-600 sm:text-base lg:text-lg sm:mt-3 ">
            I hope this letter finds you in good health and high spirits. I am
            writing to bring to your attention a matter of great concern that
            has been witnessed in our society lately – social media addiction.
            <br />
            <a
              href="#"
              className="text-orange-900 font-semibold underline hover:text-[#c77f00] text-sm sm:text-base lg:text-lg"
            >
              Read More
            </a>
          </p>

          <div className="pt-2 pb-4 sm:pt-3">
            <h4 className="text-base font-bold tracking-wide text-orange-800 sm:text-lg lg:text-xl">
              CONNECT WITH ME HERE
            </h4>
            <div className="flex gap-3 pt-2 sm:gap-4 sm:pt-3">
              {[
                {
                  icon: <FaFacebookF />,
                  label: "Facebook",
                  url: "https://www.facebook.com/mentor.mahesh",
                },
                {
                  icon: <FaLinkedinIn />,
                  label: "LinkedIn",
                  url: "https://www.linkedin.com/in/metalmahesh/",
                },
                {
                  icon: <BiLogoInstagramAlt />,
                  label: "Instagram",
                  url: "https://www.instagram.com/toonmentoons",
                },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 text-xl text-white transition-all duration-300 bg-orange-600 rounded-full shadow-md sm:w-12 sm:h-12 lg:w-14 lg:h-14 sm:text-2xl lg:text-3xl hover:bg-orange-700"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FounderNote;
