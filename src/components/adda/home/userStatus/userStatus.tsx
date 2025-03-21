import { useEffect, useState } from "react";
import { StatusInterface } from "@/types";
import { FaPlus } from "react-icons/fa";
import { STATUSES } from "@/constant/adda/status";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { FreeMode } from "swiper/modules";
import Status from "@/components/common/modal/status";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  markAsWatched,
  fetchStatus,
  sendWatchedStatus,
} from "@/redux/adda/statusSlice";

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
    <section className="relative w-[95%] sm:max-w-[83%]">
      <div className="flex justify-center items-center gap-10 overflow-x-auto scrollbar-hide">
        <div className="flex flex-col justify-center items-center gap-1">
          <label
            htmlFor="upload"
            className="w-20 h-20 relative bg-[#FFDC9F] outline-[#EC9600] outline-dashed outline-offset-2 rounded-full flex justify-center items-center cursor-pointer"
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
            {statuses.map((status) => (
              <SwiperSlide
                key={status.id}
                className="!w-fit flex flex-col gap-1"
                style={{ justifyItems: "center" }}
              >
                <div
                  className={`w-24 h-24 rounded-full outline flex justify-center items-center ${
                    status.status === "unwatched"
                      ? "outline-gray-400"
                      : "outline-[#EC9600]"
                  }`}
                >
                  <img
                    src={status.userProfilePicture}
                    alt={status.username}
                    className="w-full h-full object-cover rounded-full"
                    onClick={() => handleStatus(status)}
                  />
                </div>
                <span className="text-center text-sm">{status.username}</span>
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
