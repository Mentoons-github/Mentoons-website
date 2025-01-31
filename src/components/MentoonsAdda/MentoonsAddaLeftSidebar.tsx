const MentoonsAddaLeftSidebar = () => {
  return (
    <div className="h-full border border-blue-700 w-1/8 p-4">
      <div className="border shadow-xl  p-4 rounded-xl">
        <div className=" flex gap-4">
          <div className="w-14 h-14 rounded-full overflow-hidden">
            <img
              src="../../../public/Buddy camp.png"
              alt="User Display Picture"
            />
          </div>
          <div>
            <h3 className="text-lg text-neutral-800 font-semibold">
              Buddy Camp
            </h3>
            <p className="text-sm text-stone-500">Teacher @kidzzPlay </p>
          </div>
        </div>
        <div className="mt-4 w-full   text-lg text-neutral-800 text-semibold">
          <ul>
            <li className="flex items-center gap-2 hover:bg-orange-100 py-2 rounded-lg">
              <div className="w-12 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                <img
                  src="../../../public/assets/mentoons-adda/home.svg"
                  alt="Home icon"
                />
              </div>
              <a href="#" className="text-lg text-neutral-800 font-medium">
                Home
              </a>
            </li>
            <li className="flex items-center gap-2 hover:bg-orange-100 py-2 rounded-lg">
              <div className="w-12 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                <img
                  src="../../../public/assets/mentoons-adda/notification.svg"
                  alt="Home icon"
                />
              </div>
              <a href="#" className="text-lg text-neutral-800 font-medium">
                Notification
              </a>
            </li>
            <li className="flex items-center gap-2 hover:bg-orange-100 py-2 rounded-lg">
              <div className="w-12 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                <img
                  src="../../../public/assets/mentoons-adda/message.svg"
                  alt="Home icon"
                />
              </div>
              <a href="#" className="text-lg text-neutral-800 font-medium">
                Message
              </a>
            </li>
            <li className="flex items-center gap-2 hover:bg-orange-100 py-2 rounded-lg">
              <div className="w-12 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                <img
                  src="../../../public/assets/mentoons-adda/group.svg"
                  alt="Home icon"
                />
              </div>
              <a href="#" className="text-lg text-neutral-800 font-medium">
                Groups
              </a>
            </li>
            <li className="flex items-center gap-2 hover:bg-orange-100 py-2 rounded-lg">
              <div className="w-12 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                <img
                  src="../../../public/assets/mentoons-adda/user.svg"
                  alt="Home icon"
                />
              </div>
              <a href="#" className="text-lg text-neutral-800 font-medium">
                My Profile
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MentoonsAddaLeftSidebar;
