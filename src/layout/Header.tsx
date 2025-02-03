import { NAV_LINKS } from "@/constant";
import { getCart } from "@/redux/cartSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { SignedIn, SignedOut, useAuth, UserButton } from "@clerk/clerk-react";

import { useEffect, useState } from "react";
import { IoCart, IoClose, IoMenu } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
const Header = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [lastScrollY, setLastScrollY] = useState<number>(0);
  const { cart } = useSelector((state: RootState) => state.cart);
  const { getToken, userId } = useAuth();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchCart = async () => {
      const token = await getToken();

      if (token && userId) {
        const response = await dispatch(getCart({ token, userId }));
        console.log("Response Data", response);
      }
    };

    fetchCart();
  }, [dispatch, getToken, userId]);
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

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

  return (
    <div
      className={`h-16 bg-primary border-b-[.5px] border-gray-200 fixed top-0 w-full z-[999] transition-transform duration-300 ${
        isVisible || lastScrollY < 64 ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="flex items-center justify-between px-4 h-full  ">
        {/* Left Section - Hidden on mobile */}
        <div className=" hidden lg:flex items-center space-x-6  flex-1 font-semibold text-black md:hidden  pl-6 ">
          {NAV_LINKS.filter((link) =>
            ["Date", "Call us", "Join Us", "Plans", "Store"].includes(
              link.label
            )
          ).map((link) => (
            <div key={link.id} className="text-white whitespace-nowrap">
              {link.label === "Date" ? (
                <span className="bg-white text-primary p-1 rounded-sm whitespace-nowrap ">
                  {new Date().toDateString()}
                </span>
              ) : link.label === "Call us" ? (
                <a
                  href="tel:+91 90360 33300"
                  className="bg-white text-primary p-1 rounded-sm whitespace-nowrap"
                >
                  Call us: +91 90360 33300
                </a>
              ) : (
                <NavLink to={link.url}>{link.label} </NavLink>
              )}
            </div>
          ))}
        </div>

        {/* Middle Section - Logo */}
        <div
          className=" items-center hidden lg:flex"
          onClick={() => navigate("/")}
        >
          <img
            src="/assets/images/mentoons-logo.png"
            alt="Company Logo"
            className="max-h-24 pr-1 pt-4 pb-2 bg-primary rounded-full relative z-50 border-b"
          />
        </div>

        {/* Right Section */}
        <div className=" hidden lg:flex items-center flex-1 justify-end font-semibold md:hidden ">
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center justify-betwee space-x-6 text-white">
            {/* <NavLink
              to="/mentoons-store"
              className="text-white hover:text-gray-200"
            >
              {" "}
              Store
            </NavLink> */}
            <NavLink
              to="/mentoons-comics"
              className="text-white hover:text-gray-200"
            >
              {" "}
              Comics
            </NavLink>
            <NavLink
              to="/mentoons-comics/audio-comics"
              className="text-white hover:text-gray-200 whitespace-nowrap"
            >
              {" "}
              Audio Comics
            </NavLink>

            <NavLink
              to="/mentoons-podcast"
              className="text-white hover:text-gray-200"
            >
              Podcasts
            </NavLink>
            <NavLink
              to="/mentoons-workshops"
              className="text-white hover:text-gray-200"
            >
              Workshops
            </NavLink>
            <SignedIn>
              <NavLink to="/cart" className="text-white hover:text-gray-200">
                <div className="relative ">
                  <span className=" absolute -top-3 -right-3 bg-red-600 text-xs px-1 rounded-sm font-medium">
                    {cart.totalItemCount}
                  </span>
                  <IoCart className="text-2xl font-bold " />
                </div>
              </NavLink>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <NavLink to="/sign-in">
                <button className="text-white hover:text-gray-200 whitespace-nowrap">
                  Sign In
                </button>
              </NavLink>
            </SignedOut>
            <button className="text-white">
              <i className="fas fa-user" />
            </button>
          </div>
        </div>
        {/* Mobile Menu */}
        <div className=" flex items-center justify-between sm:flex md:flex lg:hidden  w-full ">
          <figure className="w-6 h-6">
            <img
              src="/assets/home/home-icn.png"
              alt="home icon"
              className="h-full w-full object-contain "
            />
          </figure>
          <div
            className="flex items-center  lg:hidden"
            onClick={() => navigate("/")}
          >
            <img
              src="/src/assets/imgs/logo.png"
              alt="Company Logo"
              className="max-h-24 pr-1 pt-4 pb-2 bg-primary rounded-full relative z-[999] border-b"
            />
          </div>
          <div className="w-6 h-6" onClick={handleMenuToggle}>
            {menuOpen ? (
              <IoClose className="w-full h-full text-white font-semibold" />
            ) : (
              <IoMenu className="w-full h-full text-white" />
            )}
          </div>
          {isVisible && menuOpen && (
            <div className=" absolute bg-amber-50 border border-gray-200 top-16 left-0 w-full text-center h-[calc(100vh-64px)]  z-50  pt-[100px]">
              <ul>
                {NAV_LINKS.filter(
                  (link) => !["Date", "Call us"].includes(link.label)
                ).map((link) => (
                  <li
                    key={link.id}
                    className="py-2 cursor-pointer text-2xl font-semibold text-gray-700"
                    onClick={() => {
                      setMenuOpen(false);
                      navigate(link.url);
                    }}
                  >
                    {link.label}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
