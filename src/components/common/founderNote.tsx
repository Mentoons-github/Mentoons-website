import { BiLogoInstagramAlt } from "react-icons/bi";
import { FaFacebookF, FaLinkedinIn } from "react-icons/fa";

const FounderNote = ({ scroll = false }: { scroll?: boolean }) => {
  return (
    <section
      className={`w-full p-2 rounded-xl ${
        scroll ? "" : "lg:bg-gradient-to-b from-[#FBB13E] to-[#FFE3A6]"
      }`}
    >
      <div className="flex justify-center items-start gap-10">
        <div
          className={`flex flex-col items-center w-full max-w-xl gap-10 bg-white p-6 rounded-lg ${
            scroll ? "h-fit" : "shadow-xl h-[400px] overflow-y-auto"
          }`}
        >
          <div className="text-center flex flex-col justify-center items-center">
            <h1
              className={`text-6xl font-semibold ${
                scroll ? "text-[#FF4500]" : "text-[#0C0A09]"
              }`}
            >
              Mahesh
            </h1>
            <h2
              className={`text-2xl font-medium ${
                scroll ? "text-[#008080]" : "text-[#131315]"
              }`}
            >
              Founder & CEO
            </h2>
          </div>

          <div className="flex justify-center">
            <img
              src="/assets/home/homepage fillers/sir Illustration.png"
              alt="founder image"
              className="rounded-lg shadow-lg max-w-xs w-50 h-50"
            />
          </div>

          <p className="text-lg text-[#0C0A09] leading-relaxed mt-6">
            I hope this letter finds you in good health and high spirits. I am
            writing to bring to your attention a matter of great concern that
            has been witnessed in our society lately – social media addiction.
            <br />
            <a
              href="#"
              className="text-[#EC9600] font-semibold underline hover:text-[#c77f00]"
            >
              Read More
            </a>
          </p>

          <div className="pt-5">
            <h4 className="font-bold text-lg tracking-wide text-[#131315]">
              CONNECT WITH ME HERE
            </h4>
            <div className="flex gap-4 pt-5">
              {[
                {
                  icon: <FaFacebookF />,
                  label: "Facebook",
                  url: "https://facebook.com",
                },
                {
                  icon: <FaLinkedinIn />,
                  label: "LinkedIn",
                  url: "https://linkedin.com/in/metalmahesh",
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
                  className="w-12 h-12 flex items-center justify-center bg-[#EC9600] text-white text-2xl rounded-full transition-all duration-300 hover:bg-[#c77f00] shadow-md"
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
