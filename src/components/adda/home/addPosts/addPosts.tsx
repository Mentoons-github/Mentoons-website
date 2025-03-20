import { useState } from "react";
import { PHOTO_POST } from "@/constant/constants";
import PostUpload from "../modal/postUpload";

const AddPosts = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handlePost = (type: string) => {
    console.log(type);
    setIsOpen(true);
  };

  return (
    <>
      <div className="flex flex-col justify-start items-center rounded-xl p-5 shadow-xl w-full">
        <div className="flex justify-center items-center gap-5 py-5 w-full ">
          <div className="w-20 h-18 rounded-full overflow-hidden border-2 border-white">
            <img
              src="/assets/adda/profilePictures/pexels-simon-robben-55958-614810.jpg"
              alt="userProfilePicture"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <input
            type="text"
            placeholder="What's in your mind ?"
            className="w-full border-none outline-none w-full"
          />
        </div>
        <hr className="border border-1 w-full border-gray-300" />
        <div className="flex flex-wrap justify-between items-center gap-5 p-5 w-full">
          {PHOTO_POST.map(({ icon, purpose }, index) => (
            <button
              className="outline-none flex items-center gap-2 sm:gap-3 cursor-pointer"
              key={index}
              onClick={() => handlePost(purpose.toLowerCase())}
            >
              <img
                src={icon}
                alt="addImage"
                className="w-5 h-5 sm:w-6 sm:h-6"
              />
              <span className="figtree text-xs sm:text-sm font-medium text-[#605F5F]">
                {purpose}
              </span>
            </button>
          ))}
        </div>
      </div>
      <PostUpload isOpen={isOpen} onClose={setIsOpen} />
    </>
  );
};

export default AddPosts;
