import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { FaCalendarAlt, FaHome, FaPhone, FaUsers } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoCart } from "react-icons/io5";
import { MdOutlineClose } from "react-icons/md";
import { date } from "@/constant/websiteConstants";

const Header = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [lastScrollY, setLastScrollY] = useState<number>(0);

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const controlHeaderVisibility = () => {
    if (window.scrollY > lastScrollY) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
    setLastScrollY(window.scrollY);
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(controlHeaderVisibility, 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeoutId);
    };
  }, [lastScrollY]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [menuOpen]);

  return (
    <div
      className={`
        w-full min-h-fit bg-primary flex items-center justify-around p-2 lg:p-1 top-0 sticky z-[40] gap-[1.8rem] 
        transition-transform duration-300 
        ${isVisible ? "translate-y-0" : "-translate-y-full"}
      `}
      style={{ boxShadow: "rgba(0, 0, 0, 0.2) 0px 1.25vw 1.875vw" }}
    >
      {/* Left Section - Desktop Navigation */}
      <div className="flex-1 flex lg:justify-end">
        {/* Mobile Home Icon */}
        <div className="lg:hidden">
          <NavLink to="/">
            <FaHome className="text-white text-2xl" />
          </NavLink>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex bg-transparent justify-between w-full items-center space-x-4">
          <div>
            <span className="bg-white text-primary rounded-full py-[0.25vw] px-[0.75vw] text-[0.875vw] font-semibold shadow-md whitespace-nowrap flex items-center">
              <FaCalendarAlt className="mr-[0.5vw]" />
              {date}
            </span>
          </div>
          <a href="tel:+919036033300" className="no-underline">
            <span className="bg-white text-primary rounded-full py-[0.25vw] px-[0.75vw] text-[0.875vw] font-semibold shadow-md whitespace-nowrap flex items-center">
              <FaPhone className="mr-[0.5vw]" />
              Call us: +91 90360 33300
            </span>
          </a>
          <NavLink to="/hiring" onClick={() => setMenuOpen(false)}>
            <button className="cursor-pointer hover:text-white hover:bg-red-500 h-[4.5rem] text-base whitespace-nowrap text-white font-semibold">
              Join Us
            </button>
          </NavLink>
          <NavLink to="/mentoons-store" onClick={() => setMenuOpen(false)}>
            <button className="cursor-pointer hover:text-white hover:bg-red-500 h-[4.5rem] text-base whitespace-nowrap text-white font-semibold flex items-center justify-around gap-2">
              <IoCart />
              Store
            </button>
          </NavLink>
          <NavLink to="/membership" onClick={() => setMenuOpen(false)}>
            <button className="cursor-pointer hover:text-white hover:bg-red-500 h-[4.5rem] text-base whitespace-nowrap text-white font-semibold flex items-center justify-around gap-2">
              <FaUsers className="mr-2" />
              Plans
            </button>
          </NavLink>
        </nav>
      </div>

      {/* Logo Section */}
      <div className="relative flex-1 max-w-[7vw]">
        <NavLink to="/" onClick={() => setMenuOpen(false)}>
          <figure className="w-[4rem] h-[4rem] md:h-[5.5rem] md:w-[5.5rem] lg:h-[6.5rem] lg:w-[6.5rem] absolute bg-primary rounded-full top-[-1.8rem] lg:top-[-2rem] left-1/2 transform -translate-x-1/2 z-40">
            <img
              src="/assets/images/mentoons-logo.png"
              alt="mentoonsLogo"
              className="h-full w-full object-contain"
            />
          </figure>
        </NavLink>
      </div>

      {/* Right Section - Navigation */}
      <div className="flex-1 flex justify-end lg:justify-between">
        {/* Mobile Menu Toggle */}
        <div className="lg:hidden">
          {menuOpen ? (
            <MdOutlineClose
              className="text-[1.5rem] text-white my-[0.75vw]"
              onClick={handleMenuToggle}
            />
          ) : (
            <GiHamburgerMenu
              className="text-[1.5rem] text-white my-[0.75vw]"
              onClick={handleMenuToggle}
            />
          )}
        </div>

        {/* Mobile and Desktop Navigation Menu */}
        <nav
          className={`
            ${menuOpen ? "flex" : "hidden"} 
            z-10 lg:flex flex-col lg:flex-row 
            items-center justify-between 
            bg-[#f0ebe5] lg:bg-transparent 
            border-none text-[#989ba2] lg:text-white 
            text-[1vw] lg:static 
            absolute top-[2.5rem] right-0 
            w-full lg:w-full 
            p-[4vw] lg:p-0 
            h-90 lg:h-[2.5vw]
          `}
        >
          {/* Mobile-specific Home link */}
          <NavLink to="/" className="lg:hidden" onClick={() => setMenuOpen(false)}>
            <button className="cursor-pointer lg:hover:text-white lg:hover:bg-red-500 h-[2.5rem] lg:h-[4.5rem] text-base font-semibold">
              Home
            </button>
          </NavLink>

          <NavLink to="/mentoons-comics" onClick={() => setMenuOpen(false)}>
            <button className="cursor-pointer lg:hover:text-white lg:hover:bg-red-500 h-[2.5rem] lg:h-[4.5rem] text-base font-semibold">
              Comics
            </button>
          </NavLink>

          <NavLink to="/mentoons-podcast" onClick={() => setMenuOpen(false)}>
            <button className="cursor-pointer lg:hover:text-white lg:hover:bg-red-500 h-[2.5rem] lg:h-[4.5rem] text-base font-semibold">
              Podcasts
            </button>
          </NavLink>
          ]


          
          {/* Audio Comics Dropdown */}
          <div className="relative group">
            <button
              className="
      cursor-pointer lg:hover:text-white lg:hover:bg-red-500 
      h-[2.5rem] lg:h-[4.5rem] 
      text-base whitespace-nowrap font-semibold 
      hidden lg:block
      transition-colors duration-300 ease-in-out
    "
              onClick={() => navigate("/mentoons-comics/audio-comics")}
            >
              Audio Comics
            </button>

            {/* Full Screen Overlay */}
            <div
              className="
      hidden group-hover:flex 
      fixed inset-0 
      bg-black/70 
      backdrop-blur-md 
      z-[100] 
      items-center 
      justify-center 
      animate-fade-in
    "
              style={{
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)'
              }}
            >
              <div
                className="
        w-11/12 
        max-w-4xl 
        bg-white/10 
        rounded-2xl 
        p-8 
        shadow-2xl 
        border 
        border-white/20 
        text-white
        animate-slide-up
      "
              >
                <h2 className="text-4xl font-bold mb-8 text-center">
                  Audio Comics
                </h2>

                <div className="grid grid-cols-3 gap-6">
                  <button
                    onClick={() => navigate("/mentoons-comics/audio-comics?filter=groupSmall")}
                    className="
            bg-white/10 
            hover:bg-white/20 
            border 
            border-white/20 
            rounded-xl 
            p-6 
            text-center 
            transition-all 
            duration-300 
            transform 
            hover:scale-105 
            hover:shadow-2xl
            group
          "
                  >
                    <div className="text-3xl font-bold mb-4 group-hover:text-primary">
                      6 - 12
                    </div>
                    <div className="text-sm text-gray-300 group-hover:text-primary">
                      Kids & Preteens
                    </div>
                  </button>

                  <button
                    onClick={() => navigate("/mentoons-comics/audio-comics?filter=groupMedium")}
                    className="
            bg-white/10 
            hover:bg-white/20 
            border 
            border-white/20 
            rounded-xl 
            p-6 
            text-center 
            transition-all 
            duration-300 
            transform 
            hover:scale-105 
            hover:shadow-2xl
            group
          "
                  >
                    <div className="text-3xl font-bold mb-4 group-hover:text-primary">
                      13 - 19
                    </div>
                    <div className="text-sm text-gray-300 group-hover:text-primary">
                      Teenagers
                    </div>
                  </button>

                  <button
                    onClick={() => navigate("/mentoons-comics/audio-comics?filter=groupLarge")}
                    className="
            bg-white/10 
            hover:bg-white/20 
            border 
            border-white/20 
            rounded-xl 
            p-6 
            text-center 
            transition-all 
            duration-300 
            transform 
            hover:scale-105 
            hover:shadow-2xl
            group
          "
                  >
                    <div className="text-3xl font-bold mb-4 group-hover:text-primary">
                      20+
                    </div>
                    <div className="text-sm text-gray-300 group-hover:text-primary">
                      Young Adults
                    </div>
                  </button>
                </div>

                <div className="mt-8 text-center">
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="
            bg-white/10 
            hover:bg-white/20 
            border 
            border-white/20 
            rounded-xl 
            px-6 
            py-3 
            text-sm 
            transition-all 
            duration-300
          "
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile-specific additional links */}
          <NavLink to="/mentoons-comics/audio-comics" className="lg:hidden" onClick={() => setMenuOpen(false)}>
            <button className="cursor-pointer lg:hover:text-white lg:hover:bg-red-500 h-[2.5rem] lg:h-[4.5rem] text-base font-semibold">
              Audio Comics
            </button>
          </NavLink>

          <NavLink to="/hiring" className="lg:hidden" onClick={() => setMenuOpen(false)}>
            <button className="cursor-pointer hover:text-white hover:bg-red-500 h-full text-base whitespace-nowrap text-[#989ba2] lg:text-white font-semibold">
              Join Us
            </button>
          </NavLink>

          <NavLink to="/mentoons-store" className="lg:hidden" onClick={() => setMenuOpen(false)}>
            <button className="cursor-pointer hover:text-white hover:bg-red-500 text-base whitespace-nowrap text-[#989ba2] lg:text-white font-semibold flex items-center justify-around gap-2">
              <IoCart />
              Store
            </button>
          </NavLink>

          <NavLink to="/membership" className="lg:hidden" onClick={() => setMenuOpen(false)}>
            <button className="cursor-pointer hover:text-white hover:bg-red-500 text-base whitespace-nowrap text-[#989ba2] lg:text-white font-semibold flex items-center justify-around gap-2">
              <FaUsers className="mr-2" />
              Plans
            </button>
          </NavLink>

          <SignedOut>
            <NavLink to="/sign-up" onClick={() => setMenuOpen(false)}>
              <button className="cursor-pointer hover:text-white hover:bg-red-500 h-full text-base whitespace-nowrap text-[#989ba2] lg:text-white font-semibold">
                Sign up
              </button>
            </NavLink>
          </SignedOut>

          <SignedIn>
            <div className="cursor-pointer hover:text-white hover:bg-red-500 h-full text-base whitespace-nowrap text-[#989ba2] lg:text-white font-semibold">
              <UserButton />
            </div>
          </SignedIn>
        </nav>
      </div>
    </div>
  );
};

export default Header;