import LogoMini from "@/assets/imgs/logo mini.png";
import Logo from "@/assets/imgs/logo.png";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@radix-ui/react-menubar";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DropdownMenu from "./DropdownMenu";
import { MiniSidebar } from "./Sidebar";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [showShadow, setShowShadow] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    const storedMuteState = localStorage.getItem("isMuted");
    return storedMuteState ? JSON.parse(storedMuteState) : false;
  });
  const [audio] = useState(new Audio("/audio.mp3"));

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShowShadow(true);
      } else {
        setShowShadow(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    audio.volume = isMuted ? 0 : 1;
  }, [isMuted, audio]);

  const handleMuteToggle = () => {
    if (audio.paused) {
      audio
        .play()
        .catch((error) => console.error("Error playing audio:", error));
    } else {
      audio.pause();
    }
    setIsMuted((prev) => !prev);
  };

  useEffect(() => {
    localStorage.setItem("isMuted", JSON.stringify(isMuted));
  }, [isMuted]);

  return (
    <>
      {/* for desktop & big devices */}
      <div
        className={`sticky top-0 ${
          showShadow ? "shadow-xl" : ""
        } hidden lg:flex items-center justify-between text-black bg-primary transition-all duration-1000 ease-in-out z-[9999] px-5`}
      >
        <ul className="flex items-center justify-between">
          {/* <li className="text-white hover:bg-red-500 hover:text-white h-full py-6 px-3 transition-all ease-in-out duration-300 cursor-pointer">
          Comics
        </li>
        <li className="text-white hover:bg-red-500 hover:text-white h-full py-6 px-3 transition-all ease-in-out duration-300 cursor-pointer">
          Latest
        </li>
        <li className="text-white hover:bg-red-500 hover:text-white h-full py-6 px-3 transition-all ease-in-out duration-300 cursor-pointer">
          Audio Comics
        </li>
        <li className="text-white hover:bg-red-500 hover:text-white h-full py-6 px-3 transition-all ease-in-out duration-300 cursor-pointer">
          Workshops
        </li> */}
          <DropdownMenu />
        </ul>
        <Link
          to="/"
          className="absolute hover:bg-red-500 rounded-b-full left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] pb-4 pt-8 px-10 bg-primary"
        >
          <img className="w-32 cursor-pointer" src={Logo} alt="Logo" />
        </Link>
        <div className="w-[40%] pl-4 flex items-center justify-between">
          <ul className="w-[60%] flex items-center justify-between">
            <li className="text-white hover:bg-red-500 hover:text-white h-full py-6 px-3 transition-all ease-in-out duration-300 cursor-pointer rounded-sm">
              <Link to="/mentoons-podcast">Podcast</Link>
            </li>
            <Menubar className="w-[31rem] flex items-center justify-between bg-primary border-none text-white text-base">
              <MenubarMenu>
                <Link to="/mentoons-comics">
                  <MenubarTrigger className=" cursor-pointer hover:text-white hover:bg-red-500 h-[4.5rem] px-6 text-base">
                    Comics
                  </MenubarTrigger>
                </Link>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger className=" cursor-pointer hover:text-white hover:bg-red-500 h-[4.5rem] px-6 text-base whitespace-nowrap">
                  Audio Comics
                </MenubarTrigger>
                <MenubarContent>
                  <MenubarSub>
                    <MenubarSubTrigger>Age Groups</MenubarSubTrigger>
                    <MenubarSubContent>
                      <MenubarItem
                        onClick={() =>
                          navigate(
                            "/mentoons-comics/audio-comics?filter=groupSmall"
                          )
                        }
                      >
                        Age 6 - 12
                      </MenubarItem>
                      <MenubarItem
                        onClick={() =>
                          navigate(
                            "/mentoons-comics/audio-comics?filter=groupMedium"
                          )
                        }
                      >
                        Age 13 - 19
                      </MenubarItem>
                      <MenubarItem
                        onClick={() =>
                          navigate(
                            "/mentoons-comics/audio-comics?filter=groupLarge"
                          )
                        }
                      >
                        Age 20+
                      </MenubarItem>
                    </MenubarSubContent>
                  </MenubarSub>
                  <MenubarSub>
                    <MenubarItem
                      onClick={() =>
                        navigate(
                          "/mentoons-comics/audio-comics?filter=groupLarge"
                        )
                      }
                    >
                      Family
                    </MenubarItem>
                  </MenubarSub>
                </MenubarContent>
              </MenubarMenu>
              {/* <MenubarMenu>
                <MenubarTrigger className=" cursor-pointer hover:text-white hover:bg-red-500 h-[4.5rem] px-6 text-base">
                  Workshops
                </MenubarTrigger>
                <MenubarContent>
                  <MenubarItem
                    onClick={() =>
                      navigate("/mentoons-workshops?workshop=buddy")
                    }
                  >
                    Buddy Camp (Age 6 - 12)
                  </MenubarItem>
                  <MenubarItem
                    onClick={() =>
                      navigate("/mentoons-workshops?workshop=teen")
                    }
                  >
                    Teen Camp (Age 13 - 15)
                  </MenubarItem>
                  <MenubarItem
                    onClick={() =>
                      navigate("/mentoons-workshops?workshop=family")
                    }
                  >
                    Family Camp (Age 20+)
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>*/}
            </Menubar>
            <li className="text-white hover:bg-red-500 hover:text-white h-full py-6 px-3 transition-all ease-in-out duration-300 cursor-pointer rounded-sm">
              <button
                onClick={handleMuteToggle}
                className="bg-transparent text-black"
                aria-label="Toggle mute"
              >
                {isMuted ? (
                  <figure className="h-8 w-8">
                    <img
                      src="/assets/images/play.png"
                      className="h-full w-full object-contain"
                      alt="Play"
                    />
                  </figure>
                ) : (
                  <figure className="h-8 w-8">
                    <img
                      src="/assets/images/pause.png"
                      className="h-full w-full object-contain"
                      alt="Pause"
                    />
                  </figure>
                )}
              </button>
            </li>
          </ul>
          <MiniSidebar content="" className="block md:hidden" />
        </div>
      </div>

      {/* for small devices */}
      <div
        className={`sticky top-0 ${
          showShadow ? "shadow" : ""
        } container flex lg:hidden items-center justify-between text-black bg-primary py-6 transition-all duration-1000 ease-in-out z-50`}
      >
        <div className="w-[65%] lg:w-[60%] flex items-center justify-between gap-4 lg:gap-8">
          <Link to="/">
            <h2 className="text-xl font-extrabold cursor-pointer flex flex-row-reverse items-center justify-center gap-4">
              <img
                className="w-32 mt-2 cursor-pointer"
                src={LogoMini}
                alt="Mini Logo"
              />
              <img
                className="w-8 cursor-pointer"
                src="/assets/home/home-icn.png"
                alt="home Logo"
              />
            </h2>
          </Link>
        </div>
        <div className="w-[35%] lg:w-[40%] flex items-center justify-end gap-2 lg:gap-8">
          <MiniSidebar content="" className="block" />
        </div>
      </div>
    </>
  );
};

export default Navbar;
