import { FaFacebookF, FaLinkedinIn, FaTwitter } from "react-icons/fa";
import { CONTACT_INFO, CAREER, PLANET } from "@/constant/constants";
import FooterLinks from "./footerLinks";
import { BiLogoInstagramAlt } from "react-icons/bi";

const MythosFooter = () => {
  return (
    <footer className="w-full py-10 px-5 md:px-20 flex justify-center items-center bg-[#E39712]">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 w-full max-w-7xl">
        <FooterLinks Links={CONTACT_INFO} label="CONTACT INFO" />
        <FooterLinks Links={CAREER} label="CAREER" />
        <FooterLinks Links={PLANET} label="PLANET" />
        <div className="w-full space-y-6 text-center sm:text-left">
          <h1 className="forum text-[18px] sm:text-[20px] md:text-[24px] text-[#1A1D3B] tracking-wide">
            SIGN-UP FOR OUR NEWSLETTER
          </h1>
          <div className="flex flex-col items-center sm:items-start gap-2 w-full">
            <div className="flex w-full max-w-xs sm:max-w-sm">
              <input
                type="text"
                placeholder="Email..."
                className="border border-gray-800 p-3 w-full outline-none"
              />
              <button className="border border-l-0 flex items-center gap-2 bg-white px-4 py-3">
                <span>✦</span>
                <span className="text-[#E39712] mulish text-[13px]">
                  SUBMIT
                </span>
              </button>
            </div>
            <span className="text-xs sm:text-sm text-gray-500">
              We promise not to spam you
            </span>
          </div>
          <div>
            <h1 className="forum text-[18px] sm:text-[20px] md:text-[24px] text-[#1A1D3B] tracking-wide">
              SOCIAL MEDIA
            </h1>
            <div className="flex justify-center sm:justify-start items-center gap-3 flex-wrap">
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
