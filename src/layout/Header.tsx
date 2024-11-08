import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { date } from "@/constant/websiteConstants";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { FaCalendarAlt, FaHome, FaPhone, FaUsers } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoCart } from "react-icons/io5";
import { MdOutlineClose } from "react-icons/md";
import { NavLink, useNavigate } from "react-router-dom";

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

  return (
    <div
      className={`w-full min-h-fit bg-primary flex items-center justify-around px-4 lg:py-5 top-0 fixed z-[40] gap-[6rem] transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
      style={{ boxShadow: "rgba(0, 0, 0, 0.2) 0px 20px 30px" }}
    >
      <div className="flex-1 flex lg:justify-end">
        <Menubar className="lg:hidden bg-transparent border-0">
          <MenubarMenu>
            <NavLink to="/">
              <FaHome className="text-white text-2xl" />
            </NavLink>
          </MenubarMenu>
        </Menubar>
        <Menubar className="hidden lg:flex bg-transparent border-0 justify-between w-full">
          <MenubarMenu>
            <div>
              <span className="bg-white text-primary rounded-full py-1 px-3 text-sm font-semibold shadow-md whitespace-nowrap flex items-center">
                <FaCalendarAlt className="mr-2" />
                {date}
              </span>
            </div>
          </MenubarMenu>
          <MenubarMenu>
            <a href="tel:+919036033300" className="no-underline">
              <span className="bg-white text-primary rounded-full py-1 px-3 text-sm font-semibold shadow-md whitespace-nowrap flex items-center">
                <FaPhone className="mr-2" />
                Call us: +91 90360 33300
              </span>
            </a>
          </MenubarMenu>
          <MenubarMenu>
            <NavLink to="/hiring" onClick={() => setMenuOpen(false)}>
              <MenubarTrigger className="cursor-pointer hover:text-white hover:bg-red-500 h-[4.5rem] text-base whitespace-nowrap text-white font-semibold">
                Join Us
              </MenubarTrigger>
            </NavLink>
          </MenubarMenu>
          <MenubarMenu>
            <NavLink to="/mentoons-store" onClick={() => setMenuOpen(false)}>
              <MenubarTrigger className="cursor-pointer hover:text-white hover:bg-red-500 h-[4.5rem] text-base whitespace-nowrap text-white font-semibold">
                <div className="flex items-center justify-around gap-2">
                  <IoCart />
                  Store
                </div>
              </MenubarTrigger>
            </NavLink>
          </MenubarMenu>
          <MenubarMenu>
            <NavLink to="/membership" onClick={() => setMenuOpen(false)}>
              <MenubarTrigger className="cursor-pointer hover:text-white hover:bg-red-500 h-[4.5rem] text-base whitespace-nowrap text-white font-semibold">
                <div className="flex items-center justify-around gap-2">
                  <FaUsers className="mr-2" />
                  Plans
                </div>
              </MenubarTrigger>
            </NavLink>
          </MenubarMenu>
        </Menubar>
      </div>
      <div className="relative flex-1 max-w-[7em]">
        <NavLink to="/" onClick={() => setMenuOpen(false)}>
          <figure className="w-[5rem] h-[5rem] lg:h-[10rem] lg:w-[10rem] absolute bg-primary rounded-full top-[-2.3rem] lg:top-[-6rem] left-1/2 transform -translate-x-1/2 z-40">
            <img
              src="/assets/images/mentoons-logo.png"
              alt="mentoonsLogo"
              className="h-full w-full object-contain lg:mt-4"
            />
          </figure>
        </NavLink>
      </div>
      <div className="flex-1 flex justify-end lg:justify-between">
        <div className="lg:hidden">
          {menuOpen ? (
            <MdOutlineClose
              className="text-3xl text-white my-3"
              onClick={handleMenuToggle}
            />
          ) : (
            <GiHamburgerMenu
              className="text-3xl text-white my-3"
              onClick={handleMenuToggle}
            />
          )}
        </div>
        <Menubar
          className={`${
            menuOpen ? "flex" : "hidden"
          }  z-10 lg:flex flex-col lg:flex-row items-center justify-between bg-[#f0ebe5] lg:bg-transparent border-none text-[#989ba2] lg:text-white text-base lg:static absolute top-12 right-0 w-full lg:w-full p-4 lg:p-0  h-90 lg:h-10`}
        >
          <MenubarMenu>
            <NavLink to="/" onClick={() => setMenuOpen(false)}>
              <MenubarTrigger className="cursor-pointer lg:hover:text-white lg:hover:bg-red-500 h-[2.5rem] lg:h-[4.5rem] text-base font-semibold lg:hidden">
                Home
              </MenubarTrigger>
            </NavLink>
          </MenubarMenu>
          <MenubarMenu>
            <NavLink to="/mentoons-comics" onClick={() => setMenuOpen(false)}>
              <MenubarTrigger className="cursor-pointer lg:hover:text-white lg:hover:bg-red-500 h-[2.5rem] lg:h-[4.5rem] text-base font-semibold">
                Comics
              </MenubarTrigger>
            </NavLink>
          </MenubarMenu>
          <MenubarMenu>
            <NavLink to="/mentoons-podcast" onClick={() => setMenuOpen(false)}>
              <MenubarTrigger className="cursor-pointer lg:hover:text-white lg:hover:bg-red-500 h-[2.5rem] lg:h-[4.5rem] text-base font-semibold">
                Podcasts
              </MenubarTrigger>
            </NavLink>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger className="cursor-pointer lg:hover:text-white lg:hover:bg-red-500 h-[2.5rem] lg:h-[4.5rem] text-base whitespace-nowrap font-semibold hidden lg:block">
              Audio Comics
            </MenubarTrigger>
            <MenubarContent>
              <MenubarSub>
                <MenubarSubTrigger>Age Groups</MenubarSubTrigger>
                <MenubarSubContent>
                  <MenubarItem
                    onClick={() => {
                      navigate(
                        "/mentoons-comics/audio-comics?filter=groupSmall"
                      );
                      setMenuOpen(false);
                    }}
                  >
                    Age 6 - 12
                  </MenubarItem>
                  <MenubarItem
                    onClick={() => {
                      navigate(
                        "/mentoons-comics/audio-comics?filter=groupMedium"
                      );
                      setMenuOpen(false);
                    }}
                  >
                    Age 13 - 19
                  </MenubarItem>
                  <MenubarItem
                    onClick={() => {
                      navigate(
                        "/mentoons-comics/audio-comics?filter=groupLarge"
                      );
                      setMenuOpen(false);
                    }}
                  >
                    Age 20+
                  </MenubarItem>
                </MenubarSubContent>
              </MenubarSub>
              <MenubarSub>
                <MenubarItem
                  onClick={() => {
                    navigate("/mentoons-comics/audio-comics?filter=groupLarge");
                    setMenuOpen(false);
                  }}
                >
                  Family
                </MenubarItem>
              </MenubarSub>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <NavLink
              to="/mentoons-workshops"
              onClick={() => setMenuOpen(false)}
            >
              <MenubarTrigger className="cursor-pointer lg:hover:text-white lg:hover:bg-red-500 h-[2.5rem] lg:h-[4.5rem] text-base font-semibold">
                Workshops
              </MenubarTrigger>
            </NavLink>
          </MenubarMenu>
          <MenubarMenu>
            <NavLink
              to="/mentoons-comics/audio-comics"
              onClick={() => setMenuOpen(false)}
            >
              <MenubarTrigger className="cursor-pointer lg:hover:text-white lg:hover:bg-red-500 h-[2.5rem] lg:h-[4.5rem] text-base font-semibold lg:hidden">
                Audio Comics
              </MenubarTrigger>
            </NavLink>
          </MenubarMenu>
          <MenubarMenu>
            <NavLink to="/hiring" onClick={() => setMenuOpen(false)}>
              <MenubarTrigger className="cursor-pointer hover:text-white hover:bg-red-500 h-full text-base whitespace-nowrap text-[#989ba2] lg:text-white font-semibold lg:hidden">
                Join Us
              </MenubarTrigger>
            </NavLink>
          </MenubarMenu>
          <MenubarMenu>
            <NavLink to="/mentoons-store" onClick={() => setMenuOpen(false)}>
              <MenubarTrigger className="cursor-pointer hover:text-white hover:bg-red-500] text-base whitespace-nowrap text-[#989ba2] lg:text-white font-semibold lg:hidden">
                <div className="flex items-center justify-around gap-2">
                  <IoCart />
                  Store
                </div>
              </MenubarTrigger>
            </NavLink>
          </MenubarMenu>
          <MenubarMenu>
            <NavLink to="/membership" onClick={() => setMenuOpen(false)}>
              <MenubarTrigger className="cursor-pointer hover:text-white hover:bg-red-500 text-base whitespace-nowrap text-[#989ba2] lg:text-white font-semibold lg:hidden">
                <div className="flex items-center justify-around gap-2">
                  <FaUsers className="mr-2" />
                  Plans
                </div>
              </MenubarTrigger>
            </NavLink>
          </MenubarMenu>
          <SignedOut>
            <MenubarMenu>
              <NavLink to="/sign-up" onClick={() => setMenuOpen(false)}>
                <MenubarTrigger className="cursor-pointer hover:text-white hover:bg-red-500 h-full text-base whitespace-nowrap text-[#989ba2] lg:text-white font-semibold ">
                  Sign up
                </MenubarTrigger>
              </NavLink>
            </MenubarMenu>
          </SignedOut>
          <SignedIn>
            <MenubarMenu>
              <MenubarTrigger className="cursor-pointer hover:text-white hover:bg-red-500 h-full text-base whitespace-nowrap text-[#989ba2] lg:text-white font-semibold ">
                <UserButton />
              </MenubarTrigger>
            </MenubarMenu>
          </SignedIn>
        </Menubar>
      </div>
    </div>
  );
};

export default Header;
