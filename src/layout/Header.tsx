import { date } from "@/constant/websiteConstants";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { FaCalendarAlt, FaHome, FaPhone } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdOutlineClose } from "react-icons/md";
import { NavLink, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [lastScrollY, setLastScrollY] = useState<number>(0);
  // const [audioDropdownOpen, setAudioDropdownOpen] = useState<boolean>(false);

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
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [menuOpen]);

  // Toggle Audio Comics Dropdown for mobile
  // const toggleAudioDropdown = () => setAudioDropdownOpen(!audioDropdownOpen);

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
            <button className="cursor-pointer hover:text-white hover:bg-red-500 h-[4.5rem] text-base whitespace-nowrap text-white font-semibold lg:px-2  lg:rounded-xl">
              Join Us
            </button>
          </NavLink>
          <NavLink to="/mentoons-store" onClick={() => setMenuOpen(false)}>
            <button className="cursor-pointer hover:text-white hover:bg-red-500 h-[4.5rem] text-base whitespace-nowrap text-white font-semibold flex items-center justify-around gap-2 lg:px-2  lg:rounded-xl">
              {/* <IoCart /> */}
              Store
            </button>
          </NavLink>
          <NavLink to="/membership" onClick={() => setMenuOpen(false)}>
            <button className="cursor-pointer hover:text-white hover:bg-red-500 h-[4.5rem] text-base whitespace-nowrap text-white font-semibold flex items-center justify-around gap-2 lg:px-2  lg:rounded-xl">
              {/* <FaUsers className="mr-2" /> */}
              Plans
            </button>
          </NavLink>
        </nav>
      </div>

      {/* Logo Section */}
      <div className="relative flex-1 max-w-[7vw]">
        <NavLink to="/" onClick={() => setMenuOpen(false)}>
          <figure className="w-[4rem] h-[4rem] md:h-[5.5rem] md:w-[5.5rem] lg:h-[6.5rem] lg:w-[6.5rem] absolute bg-primary rounded-full top-[-1.8rem] lg:top-[-2rem] left-1/2 transform -translate-x-1/2 z-40 lg:pb-8 pb-2">
            <img
              src="/assets/images/mentoons-logo.png"
              alt="mentoonsLogo"
              className="h-full w-full object-contain"
            />
          </figure>
        </NavLink>
      </div>

      {/* Right Section - Navigation */}
      <div className="flex-1 flex justify-end lg:justify-between lg:px-5">
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
            items-center gap-[10%]
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
          <NavLink
            to="/"
            className="lg:hidden"
            onClick={() => setMenuOpen(false)}
          >
            <button className="cursor-pointer lg:hover:text-white lg:hover:bg-red-500 h-[2.5rem] lg:h-[4.5rem] text-base font-semibold pt-6 lg:px-2  lg:rounded-xl">
              Home
            </button>
          </NavLink>

          <NavLink to="/mentoons-comics" onClick={() => setMenuOpen(false)}>
            <button className="cursor-pointer lg:hover:text-white lg:hover:bg-red-500 h-[2.5rem] lg:h-[4.5rem] text-base font-semibold lg:px-2 lg:rounded-xl">
              Comics
            </button>
          </NavLink>

          <NavLink to="/mentoons-podcast" onClick={() => setMenuOpen(false)}>
            <button className="cursor-pointer lg:hover:text-white lg:hover:bg-red-500 h-[2.5rem] lg:h-[4.5rem] text-base font-semibold lg:px-2 lg:rounded-xl">
              Podcasts
            </button>
          </NavLink>
          <NavLink
            to="/hiring"
            onClick={() => setMenuOpen(false)}
            className="lg:hidden"
          >
            <button className="cursor-pointer lg:hover:text-white lg:hover:bg-red-500 h-[2.5rem] lg:h-[4.5rem] text-base font-semibold lg:px-2 lg:rounded-xl">
              Join Us
            </button>
          </NavLink>
          <NavLink
            to="/mentoons-store"
            onClick={() => setMenuOpen(false)}
            className="lg:hidden"
          >
            <button className="cursor-pointer lg:hover:text-white lg:hover:bg-red-500 h-[2.5rem] lg:h-[4.5rem] text-base font-semibold">
              {/* <IoCart /> */}
              Store
            </button>
          </NavLink>
          <NavLink
            to="/membership"
            onClick={() => setMenuOpen(false)}
            className="lg:hidden"
          >
            <button className="cursor-pointer lg:hover:text-white lg:hover:bg-red-500 h-[2.5rem] lg:h-[4.5rem] text-base font-semibold flex items-center">
              {/* <FaUsers className="mr-2" /> */}
              Plans
            </button>
          </NavLink>

          <NavLink to="/mentoons-workshops" onClick={() => setMenuOpen(false)}>
            <button className="cursor-pointer lg:hover:text-white lg:hover:bg-red-500 h-[2.5rem] lg:h-[4.5rem] text-base font-semibold lg:px-2 lg:rounded-xl">
              Workshop
            </button>
          </NavLink>

          {/* Audio Comics Dropdown */}
          <div className="relative group">
            <button
              className="cursor-pointer lg:hover:text-white lg:hover:bg-red-500 
                h-[2.5rem] lg:h-[4.5rem] text-base whitespace-nowrap font-semibold hidden lg:block lg:px-2  lg:rounded-xl"
              onClick={() => navigate("/mentoons-comics/audio-comics")}
            >
              Audio Comics
            </button>

            {/* Desktop Dropdown Menu */}
            <div
              className="hidden group-hover:flex 
            absolute bg-white text-primary shadow-lg 
            top-[5rem] left-0 w-[200px] flex-col border rounded-lg 
            transition-opacity duration-300 ease-in-out"
            >
              <NavLink to="/mentoons-comics/audio-comics?filter=groupSmall">
                <button className="px-4 py-2 hover:bg-gray-100 text-sm w-full text-left">
                  6 - 12 Kids & Preteens
                </button>
              </NavLink>

              <NavLink to="/mentoons-comics/audio-comics?filter=groupMedium">
                <button className="px-4 py-2 hover:bg-gray-100 text-sm w-full text-left">
                  13 - 19 Teenagers
                </button>
              </NavLink>

              <NavLink to="/mentoons-comics/audio-comics?filter=groupLarge">
                <button className="px-4 py-2 hover:bg-gray-100 text-sm w-full text-left">
                  20+ Young Adults
                </button>
              </NavLink>
            </div>
          </div>

          {/* Mobile Audio Comics link */}
          <NavLink
            to="/mentoons-comics/audio-comics"
            className="lg:hidden"
            onClick={() => setMenuOpen(false)}
          >
            <button className="cursor-pointer lg:hover:text-white lg:hover:bg-red-500 h-[2.5rem] lg:h-[4.5rem] text-base font-semibold ">
              Audio Comics
            </button>
          </NavLink>

          {/* Authentication */}
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <NavLink to="/sign-in">
              <button className="cursor-pointer lg:hover:text-white lg:hover:bg-red-500 h-[2.5rem] lg:h-[4.5rem] text-base font-semibold ">
                Sign In
              </button>
            </NavLink>
          </SignedOut>
        </nav>
      </div>
    </div>
  );
};

export default Header;
