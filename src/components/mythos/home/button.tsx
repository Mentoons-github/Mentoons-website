import { IconType } from "react-icons/lib";

const MythosButton = ({
  label,
  bg = "white",
  textClr = "black",
  icon: Icon,
}: {
  label: string;
  bg?: string;
  textClr?: string;
  icon?: IconType;
}) => {
  return (
    <button
      className={`flex justify-center items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 cursor-pointer z-3 cursor-pointer ${
        !bg && "rounded-md"
      } shadow-md hover:shadow-lg transition-all duration-300`}
      style={{
        background: bg,
        color: textClr,
      }}
    >
      {Icon ? (
        <div className="flex items-center justify-center w-10 h-10 border rounded-full">
          <Icon className="w-5 h-5 text-black" />
        </div>
      ) : (
        <img
          src="/assets/mythos/icons/star.png"
          alt="star-icon"
          className="h-3 w-3 sm:h-4 sm:w-4"
        />
      )}

      <span
        className="font-extrabold text-xs sm:text-sm tracking-[1px] sm:tracking-[1.3px] font-mulish"
        style={{ color: textClr }}
      >
        {label}
      </span>
    </button>
  );
};

export default MythosButton;
