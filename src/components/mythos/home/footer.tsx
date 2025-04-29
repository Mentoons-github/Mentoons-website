import { CAREER, CONTACT_INFO, PLANET } from "@/constant/constants";
import { BiLogoInstagramAlt } from "react-icons/bi";
import { FaFacebookF, FaLinkedinIn, FaTwitter } from "react-icons/fa";
import FooterLinks from "./footerLinks";

const MythosFooter = () => {
  return (
    <footer className="w-full py-10 px-5 md:px-20 flex justify-center items-center bg-[#E39712]">
      <div className="grid w-full grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 md:gap-16 max-w-7xl">
        {[CONTACT_INFO, CAREER, PLANET].map((items, index) => (
          <FooterLinks
            key={index}
            Links={items}
            label={
              index === 0 ? "CONTACT INFO" : index === 1 ? "CAREER" : "PLANET"
            }
          />
        ))}
        <div className="w-full space-y-6 text-center sm:text-left">
          <h1 className="font-forum text-[18px] sm:text-[20px] md:text-[24px] text-[#1A1D3B] tracking-wide">
            SIGN-UP FOR OUR NEWSLETTER
          </h1>
          <div className="flex flex-col items-center w-full gap-2 sm:items-start">
            <div className="flex w-full max-w-xs sm:max-w-sm">
              <input
                type="text"
                placeholder="Email..."
                className="w-full p-3 border border-gray-800 outline-none"
              />
              <button className="flex items-center gap-2 px-4 py-3 bg-white border border-l-0">
                <span>✦</span>
                <span className="text-[#E39712] font-mulish text-[13px]">
                  SUBMIT
                </span>
              </button>
            </div>
            <span className="text-xs text-gray-500 sm:text-sm">
              We promise not to spam you
            </span>
          </div>
          <div>
            <h1 className="font-forum text-[18px] sm:text-[20px] md:text-[24px] text-[#1A1D3B] tracking-wide">
              SOCIAL MEDIA
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
              {[FaFacebookF, FaTwitter, FaLinkedinIn, BiLogoInstagramAlt].map(
                (Icon, index) => (
                  <div
                    key={index}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-[#9FE9FF]"
                  >
                    <Icon />
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MythosFooter;
