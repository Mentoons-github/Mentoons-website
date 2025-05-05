import Status from "@/components/common/modal/status";
import { STATUSES } from "@/constant/adda/status";
import {
  fetchStatus,
  markAsWatched,
  sendWatchedStatus,
} from "@/redux/adda/statusSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { StatusInterface } from "@/types";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { FreeMode } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";

const UserStatus = () => {
  const dispatch = useDispatch<AppDispatch>();
  const fetchedStatus = useSelector(
    (state: RootState) => state.userStatus.statuses
  );

  const [statuses, setStatuses] = useState<StatusInterface[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<StatusInterface | null>(
    null
  );
  const [timeOutId, setTimeOutId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setStatuses(STATUSES);
    dispatch(fetchStatus);
  }, [dispatch]);

  useEffect(() => {
    if (fetchedStatus.length > 0) {
      setStatuses(fetchedStatus);
    } else {
      setStatuses(STATUSES); //remove it this is static
    }
  }, [fetchedStatus]);

  const handleStatus = (status: StatusInterface) => {
    console.log(status);
    setSelectedStatus(status);
    dispatch(markAsWatched({ id: status.id }));
    console.log("dispatched");

    if (timeOutId) clearTimeout(timeOutId);
    const id = setTimeout(() => {
      dispatch(sendWatchedStatus);
    }, 10000);

    setTimeOutId(id);
  };

  return (
    <section className="w-full ">
      <div className="flex flex-col items-center justify-start gap-4 px-2 py-2 sm:flex-row sm:gap-10 sm:px-4">
        <div className="flex flex-col items-center justify-center flex-shrink-0 gap-1">
          <label
            htmlFor="upload"
            className="w-16 h-16 sm:w-20 sm:h-20 relative bg-[#FFDC9F] outline-[#EC9600] outline-dashed outline-offset-2 rounded-full flex justify-center items-center cursor-pointer"
          >
            <FaPlus className="absolute text-[#EC9600] text-2xl sm:text-3xl p-1 border-2 sm:border-3 border-[#EC9600] rounded-full" />
            <input
              type="file"
              id="upload"
              hidden
              accept="image/jpeg, image/jpg"
            />
          </label>
          <span className="text-xs text-center sm:text-sm">Share Story</span>
        </div>
        <div className="flex-grow w-full mt-2 overflow-x-auto scrollbar-thin scrollbar-thumb-[#EC9600] scrollbar-track-gray-100 sm:mt-0">
          <Swiper
            spaceBetween={8}
            freeMode={true}
            modules={[FreeMode]}
            className="w-full"
            slidesPerView="auto"
            breakpoints={{
              320: { slidesPerView: 3.5, spaceBetween: 5 },
              480: { slidesPerView: 4, spaceBetween: 8 },
              640: { slidesPerView: 4.5, spaceBetween: 8 },
              768: { slidesPerView: 5, spaceBetween: 10 },
              1024: { slidesPerView: 7, spaceBetween: 12 },
              1280: { slidesPerView: 8, spaceBetween: 15 },
            }}
          >
            {statuses.map((status) => (
              <SwiperSlide
                key={status.id}
                className="!w-fit flex flex-col gap-1 flex-shrink-0"
                style={{ justifyItems: "center" }}
              >
                <div
                  className={`w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full outline flex justify-center items-center ${
                    status.status === "unwatched"
                      ? "outline-gray-400"
                      : "outline-[#EC9600]"
                  }`}
                >
                  <img
                    src={status.userProfilePicture}
                    alt={status.username}
                    className="object-cover w-full h-full rounded-full cursor-pointer"
                    onClick={() => handleStatus(status)}
                  />
                </div>
                <span className="text-xs sm:text-sm text-center truncate max-w-[80px]">
                  {status.username}
                </span>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      {selectedStatus && (
        <Status
          status={selectedStatus}
          setStatus={() => setSelectedStatus(null)}
        />
      )}
    </section>
  );
};

export default UserStatus;
