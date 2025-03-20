import { PROBLEMS_FACED } from "@/constant/constants";
import { SwiperSlide, Swiper } from "swiper/react";
import { Navigation, Autoplay, Pagination, EffectCards } from "swiper/modules";
import "swiper/swiper-bundle.css";

const ProblemCard = () => {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12">
      <Swiper
        modules={[Navigation, Autoplay, Pagination, EffectCards]}
        spaceBetween={50}
        navigation
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        loop
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        className="w-full"
        breakpoints={{
          320: {
            slidesPerView: 1,
            spaceBetween: 30,
          },
          640: {
            slidesPerView: 1,
            spaceBetween: 40,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 50,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 60,
          },
        }}
      >
        {PROBLEMS_FACED.map((data, index) => (
          <SwiperSlide
            key={index}
            className="flex flex-col justify-center items-center py-8"
          >
            <div className="w-full max-w-md mx-auto aspect-square p-6 rounded-full flex justify-center items-center shadow-xl transition-all duration-300 hover:shadow-2xl hover:translate-y-[-5px] bg-white overflow-hidden">
              <img
                src={data.img}
                alt={data.text}
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <div className="mt-6 w-full max-w-md mx-auto">
              <h1 className="inter font-bold text-2xl text-white text-center px-2 leading-tight">
                {data.text}
              </h1>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProblemCard;
