import { Navigation, Pagination, A11y, Autoplay } from "swiper/modules";
import Brand1 from "@/assets/imgs/brand1.png";
import Brand2 from "@/assets/imgs/brand2.png";
import Brand3 from "@/assets/imgs/brand3.png";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import React from "react";

const CompanySlider: React.FC = () => {
  return (
    <Swiper
      // install Swiper modules
      modules={[Navigation, Pagination, A11y, Autoplay]}
      spaceBetween={50}
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      loop={true} // Enable infinite looping
      className="py-10"
      breakpoints={{
        // Up to 767px (mobile size)
        0: {
          slidesPerView: 2, // Show only 1 card on mobile
        },
        // From 768px to 1023px (tablet size)
        768: {
          slidesPerView: 3, // Show 2 cards on tablet
        },
        // Above 1024px (desktop size)
        1024: {
          slidesPerView: 4, // Show 3 cards on desktop (default)
        },
      }}
    >
      <SwiperSlide>
        <div className=" text-center rounded-2xl text-white py-8 px-4 space-y-4">
          <img className="rounded-full mx-auto company-image" src={Brand1} />
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className=" text-center rounded-2xl text-white py-8 px-4 space-y-4">
          <img className="rounded-full mx-auto company-image" src={Brand2} />
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className=" text-center rounded-2xl text-white py-8 px-4 space-y-4">
          <img className="rounded-full mx-auto company-image" src={Brand3} />
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className=" text-center rounded-2xl text-white py-8 px-4 space-y-4">
          <img className="rounded-full mx-auto company-image" src={Brand1} />
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className=" text-center rounded-2xl text-white py-8 px-4 space-y-4">
          <img className="rounded-full mx-auto company-image" src={Brand2} />
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className=" text-center rounded-2xl text-white py-8 px-4 space-y-4">
          <img className="rounded-full mx-auto company-image" src={Brand3} />
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className=" text-center rounded-2xl text-white py-8 px-4 space-y-4">
          <img className="rounded-full mx-auto company-image" src={Brand1} />
        </div>
      </SwiperSlide>
    </Swiper>
  );
};

export default CompanySlider;
