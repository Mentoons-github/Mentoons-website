import { useEffect, useState } from "react";
import { UserStatusInterface } from "../../../../types";
import { FaPlus } from "react-icons/fa";
import { STATUSES } from "../../../../constants";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { FreeMode } from "swiper/modules";
import Status from "../../../common/modal/status";
// import axios, { AxiosError } from "axios";

const UserStatus = () => {
  const [statuses, setStatuses] = useState<UserStatusInterface[]>(STATUSES);
  const [selectedUser, setSelectedUser] = useState<UserStatusInterface | null>(
    null
  );

  useEffect(() => {
    setStatuses(STATUSES); //remove
  }, []);

  // useEffect(() => {
  //   const fetchUserStatus = async () => {
  //     try {
  //       const userData = await axios.get(
  //         `${import.meta.env.VITE_BASE_URL}/api/user/status`
  //       );

  //       console.log(userData);
  //       // setStatuses(userData.data);
  //     } catch (error: unknown) {
  //       if (error instanceof AxiosError) {
  //         console.log(error.message);
  //       } else {
  //         console.log(error);
  //       }
  //     }
  //   };

  //   fetchUserStatus();
  // }, []);

  return (
    <section className="relative w-[95%] sm:max-w-[83%]">
      <div className="flex justify-center items-center gap-5 overflow-x-auto scrollbar-hide">
        <div className="flex flex-col justify-center items-center gap-1 flex-shrink-0">
          <label
            htmlFor="upload"
            className="w-24 h-24 relative bg-[#FFDC9F] border-dotted border-3 border-[#EC9600] rounded-full flex justify-center items-center cursor-pointer"
          >
            <FaPlus className="absolute text-[#EC9600] text-3xl p-1 border-3 border-[#EC9600] rounded-full" />
            <input
              type="file"
              id="upload"
              hidden
              accept="image/jpeg, image/jpg"
            />
          </label>
          <span className="text-center text-sm">Share Story</span>
        </div>
        <div className="w-3/4 overflow-x-hidden">
          <Swiper
            spaceBetween={10}
            freeMode={true}
            modules={[FreeMode]}
            className="w-full"
            breakpoints={{
              320: { slidesPerView: 3, spaceBetween: 5 },
              480: { slidesPerView: 4, spaceBetween: 8 },
              768: { slidesPerView: 5, spaceBetween: 10 },
              1024: { slidesPerView: 6, spaceBetween: 15 },
              1280: { slidesPerView: "auto", spaceBetween: 20 },
            }}
          >
            {statuses.map((user, index) => (
              <>
                <SwiperSlide
                  key={index + 1}
                  className="!w-fit flex flex-col gap-1 flex-shrink-0"
                  style={{ justifyItems: "center" }}
                >
                  <div
                    className={`w-24 h-24 rounded-full border-3 flex justify-center items-center ${
                      user.isWatched ? "border-gray-400" : "border-blue-500"
                    }`}
                  >
                    <img
                      src={user.userProfilePic}
                      alt={user.userName}
                      className="w-full h-full object-cover rounded-full"
                      onClick={() => setSelectedUser(user)}
                    />
                  </div>
                  <span className="text-center text-sm">{user.userName}</span>
                </SwiperSlide>
              </>
            ))}
          </Swiper>
        </div>
      </div>
      {selectedUser && (
        <Status status={selectedUser} setStatus={() => setSelectedUser(null)} />
      )}
    </section>
  );
};

export default UserStatus;
