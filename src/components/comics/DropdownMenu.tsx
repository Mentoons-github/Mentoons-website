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
import { Link, useNavigate } from "react-router-dom";

const DropdownMenu = () => {
  const navigate = useNavigate();
  return (
    <Menubar className="w-[31rem] flex items-center justify-between bg-primary border-none text-white text-base">
      <MenubarMenu>
        <Link to="/mentoons-comics">
          <MenubarTrigger className="lg:hidden cursor-pointer hover:text-white hover:bg-red-500 h-[4.5rem] px-6 text-base">
            Comics
          </MenubarTrigger>
        </Link>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger className="lg:hidden cursor-pointer hover:text-white hover:bg-red-500 h-[4.5rem] px-6 text-base whitespace-nowrap">
          Audio Comics  
        </MenubarTrigger>
        <MenubarContent>
          <MenubarSub>
            <MenubarSubTrigger>Age Groups</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem
                onClick={() =>
                  navigate("/mentoons-comics/audio-comics?filter=groupSmall")
                }
              >
                Age 6 - 12
              </MenubarItem>
              <MenubarItem
                onClick={() =>
                  navigate("/mentoons-comics/audio-comics?filter=groupMedium")
                }
              >
                Age 13 - 19
              </MenubarItem>
              <MenubarItem
                onClick={() =>
                  navigate("/mentoons-comics/audio-comics?filter=groupLarge")
                }
              >
                Age 20 +{" "}
              </MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSub>
            <MenubarItem
              onClick={() =>
                navigate("/mentoons-comics/audio-comics?filter=groupLarge")
              }
            >
              Family
            </MenubarItem>
          </MenubarSub>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger className="lg:hidden cursor-pointer hover:text-white hover:bg-red-500 h-[4.5rem] px-6 text-base">
          Workshops
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem
            onClick={() => navigate("/mentoons-workshops?workshop=buddy")}
          >
            Buddy Camp (Age 6 - 12)
          </MenubarItem>
          <MenubarItem
            onClick={() => navigate("/mentoons-workshops?workshop=teen")}
          >
            Teen Camp (Age 13 - 15)
          </MenubarItem>
          <MenubarItem
            onClick={() => navigate("/mentoons-workshops?workshop=family")}
          >
            Family Camp (Age 20+)
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <div className="invisible">Akash</div>
      </MenubarMenu>
      <MenubarMenu>
        <Link to="/mentoons-comics">
          <MenubarTrigger className=" cursor-pointer hover:text-white hover:bg-red-500 h-[4.5rem] px-6 text-base">
            <span className="bg-white text-primary rounded-full py-1 px-3 text-sm font-semibold shadow-md whitespace-nowrap">
              {date}
            </span>
          </MenubarTrigger>
        </Link>
      </MenubarMenu>
      <MenubarMenu>
        <a href="tel:+918886543210" className="no-underline">
          <MenubarTrigger className=" cursor-pointer hover:text-white hover:bg-red-500 h-[4.5rem] px-6 text-base">
            <span className="bg-white text-primary rounded-full py-1 px-3 text-sm font-semibold shadow-md whitespace-nowrap">
              Call us: +91 8886 543 210
            </span>
          </MenubarTrigger>
        </a>
      </MenubarMenu>
      <MenubarMenu>
        <Link to="/hiring">
          <MenubarTrigger className=" cursor-pointer hover:text-white hover:bg-red-500 h-[4.5rem] px-6 text-base whitespace-nowrap">
            Join Us
          </MenubarTrigger>
        </Link>
      </MenubarMenu>
    </Menubar>
  );
};

export default DropdownMenu;
