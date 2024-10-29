import { Navigation, Pagination, A11y, Autoplay } from "swiper/modules";
import User2 from "@/assets/imgs/user2.png";
import User3 from "@/assets/imgs/user3.png";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { FaRegStarHalfStroke, FaStar } from "react-icons/fa6";
import React from "react";
import TestimonialImg2 from "@/assets/imgs/testimonials2.jpg";
import TestimonialImg4 from "@/assets/imgs/testemonials4.jpg";
import Comic1 from "@/assets/imgs/comic1.jpg";
import Comic2 from "@/assets/imgs/comic2.jpg";
import Comic3 from "@/assets/imgs/comic3.jpg";
import Comic4 from "@/assets/imgs/comic4.jpg";
import Comic5 from "@/assets/imgs/comic5.jpg";
import Comic6 from "@/assets/imgs/comic6.jpg";
import Comic7 from "@/assets/imgs/comic7.jpg";
import Comic8 from "@/assets/imgs/comic8.jpg";
import Comic9 from "@/assets/imgs/comic9.jpg";
import Dhanashekar from "@/assets/imgs/dhanasekar Illustration.jpg";
import Dhinesh from "@/assets/imgs/Dhinesh Illustration.jpg";
import Sankar from "@/assets/imgs/sankar Illustration.jpg";
import Ajay from "@/assets/imgs/ajay Illustration.jpg";
import { motion } from "framer-motion";

const TestimonialsSlider: React.FC = () => {
  return (
    <Swiper
      // install Swiper modules
      modules={[Navigation, Pagination, A11y, Autoplay]}
      spaceBetween={50}
      autoplay={{ delay: 2000, disableOnInteraction: false }}
      loop={true} // Enable infinite looping
      className="py-10 w-full md:w-[55%]"
      breakpoints={{
        // Up to 767px (mobile size)
        0: {
          slidesPerView: 1, // Show only 1 card on mobile
        },
        // Above 1024px (desktop size)
        1024: {
          slidesPerView: 2, // Show 3 cards on desktop (default)
        },
      }}
    >
      <SwiperSlide>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="rounded-2xl bg-amber-200 py-4 px-6 space-y-6"
        >
          <div className="space-y-5 border-b border-amber-500  py-4">
            <div className=" w-full flex items-start justify-start">
              <img
                src="/assets/images/quotation-mark.svg"
                alt="quotation mark icon"
                className="w-6"
              />
            </div>
            <div className="text-lg text-amber-400">2 Minutes Ago</div>
            <div className="h-[5rem] text-amber-600 font-semibold">
              These comics have helped my child understand difficult topics in a
              fun way!
            </div>
            <div className="flex items-center justify-between w-fit text-xl">
              <FaStar className="text-yellow-500 text-xl" />
              <FaStar className="text-yellow-500 text-xl" />
              <FaStar className="text-yellow-500 text-xl" />
              <FaStar className="text-yellow-500 text-xl" />
              <FaRegStarHalfStroke className="text-yellow-500" />
            </div>
          </div>
          <div className="flex items-center justify-start text-amber-600 gap-6 font-semibold text-xl">
            <img className="w-16 rounded-full" src={User2} />- Parent
          </div>
        </motion.div>
      </SwiperSlide>
      <SwiperSlide>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="rounded-2xl bg-rose-200 py-4 px-6 space-y-6"
        >
          <div className="space-y-5 border-b border-rose-500 py-4">
            <div className=" w-full flex items-start justify-start">
              <img
                src="/assets/images/quotation-mark.svg"
                alt="quotation mark icon"
                className="w-6"
              />
            </div>
            <div className="text-lg text-rose-400">2 Minutes Ago</div>
            <div className="h-[5rem] text-rose-600 font-semibold">
              I love how the stories teach me about friendship and growing up.
            </div>
            <div className="flex items-center justify-between w-fit text-xl">
              <FaStar className="text-yellow-500 text-xl" />
              <FaStar className="text-yellow-500 text-xl" />
              <FaStar className="text-yellow-500 text-xl" />
              <FaStar className="text-yellow-500 text-xl" />
              <FaRegStarHalfStroke className="text-yellow-500" />
            </div>
          </div>
          <div className="flex items-center justify-start text-rose-600 gap-6 font-semibold text-xl">
            <img className="w-16 rounded-full" src={User3} />- Dhruv, Age 12
          </div>
        </motion.div>
      </SwiperSlide>
      <SwiperSlide>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="rounded-2xl bg-purple-200 py-4 px-6 space-y-6"
        >
          <div className="space-y-5 border-b border-purple-500 py-4">
            <div className=" w-full flex items-start justify-start">
              <img
                src="/assets/images/quotation-mark.svg"
                alt="quotation mark icon"
                className="w-6"
              />
            </div>
            <div className="text-lg text-purple-400">2 Minutes Ago</div>
            <div className="h-[5rem] text-purple-600 font-semibold">
              I love how the stories teach me about friendship and growing up.
            </div>
            <div className="flex items-center justify-between w-fit text-xl">
              <FaStar className="text-yellow-500 text-xl" />
              <FaStar className="text-yellow-500 text-xl" />
              <FaStar className="text-yellow-500 text-xl" />
              <FaStar className="text-yellow-500 text-xl" />
              <FaRegStarHalfStroke className="text-yellow-500" />
            </div>
          </div>
          <div className="flex items-center justify-start text-purple-600 gap-6 font-semibold text-xl">
            <img className="w-16 rounded-full" src={User3} />- Dhruv, Age 12
          </div>
        </motion.div>
      </SwiperSlide>
      <SwiperSlide>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="rounded-2xl bg-lime-200 py-4 px-6 space-y-6"
        >
          <div className="space-y-5 border-b border-lime-500  py-4">
            <div className=" w-full flex items-start justify-start">
              <img
                src="/assets/images/quotation-mark.svg"
                alt="quotation mark icon"
                className="w-6"
              />
            </div>
            <div className="text-lg text-lime-400">2 Minutes Ago</div>
            <div className="h-[5rem] text-lime-600 font-semibold">
              These comics have helped my child understand difficult topics in a
              fun way!
            </div>
            <div className="flex items-center justify-between w-fit text-xl">
              <FaStar className="text-yellow-500 text-xl" />
              <FaStar className="text-yellow-500 text-xl" />
              <FaStar className="text-yellow-500 text-xl" />
              <FaStar className="text-yellow-500 text-xl" />
              <FaRegStarHalfStroke className="text-yellow-500" />
            </div>
          </div>
          <div className="flex items-center justify-start text-lime-600 gap-6 font-semibold text-xl">
            <img className="w-16 rounded-full" src={User2} />- Parent
          </div>
        </motion.div>
      </SwiperSlide>
    </Swiper>
  );
};

export const MiniTestimonailsSlider: React.FC = () => {
  return (
    <Swiper
      // install Swiper modules
      modules={[Navigation, Pagination, A11y, Autoplay]}
      spaceBetween={50}
      autoplay={{ delay: 2000, disableOnInteraction: false }}
      loop={true} // Enable infinite looping
      className="py-10 w-full"
      breakpoints={{
        // Up to 767px (mobile size)
        0: {
          slidesPerView: 1, // Show only 1 card on mobile
        },
        // From 767 px (tablet size)
        767: {
          slidesPerView: 2,
        },
        // Above 1024px (desktop size)
        1024: {
          slidesPerView: 3, // Show 3 cards on desktop (default)
        },
      }}
    >
      <SwiperSlide>
        <div className="rounded-2xl bg-amber-200 shadow-xl flex items-center pb-4 px-4 space-y-6 gap-4">
          <div className="flex items-center justify-center gap-6 font-semibold text-xl">
            <img
              className="w-16 rounded-full flex-shrink-0"
              src={TestimonialImg2}
            />
          </div>
          <div className="space-y-2">
            <div className="text-2xl text-amber-500 text-extrabold">Parent</div>
            <div className="text-sm text-amber-800">
              These comics have helped my child understand difficult topics in a
              fun way!
            </div>
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="rounded-2xl bg-rose-200 shadow-xl flex items-center pb-4 px-4 space-y-6 gap-4">
          <div className="flex items-center justify-center gap-6 font-semibold text-xl">
            <img
              className="w-16 rounded-full flex-shrink-0"
              src={TestimonialImg4}
            />
          </div>
          <div className="space-y-2">
            <div className="text-2xl text-rose-500 text-extrabold">Sachin</div>
            <div className="text-sm text-rose-600 font-semibold">
              I love how the stories teach me about friendship and growing up.
            </div>
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="rounded-2xl bg-purple-200 shadow-xl flex items-center pb-4 px-4 space-y-6 gap-4">
          <div className="flex items-center justify-center gap-6 font-semibold text-xl">
            <img
              className="w-16 rounded-full flex-shrink-0"
              src={TestimonialImg2}
            />
          </div>
          <div className="space-y-2">
            <div className="text-2xl text-purple-500 text-extrabold">
              Parent
            </div>
            <div className="text-sm text-purple-900">
              These comics have helped my child understand difficult topics in a
              fun way!
            </div>
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="rounded-2xl bg-lime-200 shadow-xl flex items-center pb-4 px-4 space-y-6 gap-4">
          <div className="flex items-center justify-center gap-6 font-semibold text-xl">
            <img
              className="w-16 rounded-full flex-shrink-0"
              src={TestimonialImg4}
            />
          </div>
          <div className="space-y-2">
            <div className="text-2xl text-lime-500 text-extrabold">Sachin</div>
            <div className="text-sm text-lime-600 font-semibold">
              I love how the stories teach me about friendship and growing up.
            </div>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  );
};

export const ComicSlider: React.FC = () => {
  return (
    <Swiper
      // install Swiper modules
      modules={[Navigation, Pagination, A11y, Autoplay]}
      spaceBetween={50}
      autoplay={{ delay: 2000, disableOnInteraction: false }}
      loop={true} // Enable infinite looping
      navigation={true}
      className="py-10 w-full lg:w-[80%]"
      breakpoints={{
        // Up to 767px (mobile size)
        0: {
          slidesPerView: 1, // Show only 1 card on mobile
        },
      }}
    >
      <SwiperSlide>
        <div className="flex items-center justify-center">
          <img className="w-[30rem] lg:w-[22rem]" src={Comic1} />
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="flex items-center justify-center">
          <img className="w-[30rem] lg:w-[22rem]" src={Comic2} />
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="flex items-center justify-center">
          <img className="w-[30rem] lg:w-[22rem]" src={Comic3} />
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="flex items-center justify-center">
          <img className="w-[30rem] lg:w-[22rem]" src={Comic4} />
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="flex items-center justify-center">
          <img className="w-[30rem] lg:w-[22rem]" src={Comic5} />
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="flex items-center justify-center">
          <img className="w-[30rem] lg:w-[22rem]" src={Comic6} />
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="flex items-center justify-center">
          <img className="w-[30rem] lg:w-[22rem]" src={Comic7} />
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="flex items-center justify-center">
          <img className="w-[30rem] lg:w-[22rem]" src={Comic8} />
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="flex items-center justify-center">
          <img className="w-[30rem] lg:w-[22rem]" src={Comic9} />
        </div>
      </SwiperSlide>
    </Swiper>
  );
};

export const TeamSlider: React.FC = () => {
  return (
    <Swiper
      // install Swiper modules
      modules={[Navigation, Pagination, A11y, Autoplay]}
      spaceBetween={50}
      autoplay={{ delay: 500, disableOnInteraction: false }}
      loop={true} // Enable infinite looping
      navigation={false}
      className="w-full"
      breakpoints={{
        // Up to 767px (mobile size)
        0: {
          slidesPerView: 2, // Show only 1 card on mobile
        },
        // From to 767px (mobile size)
        767: {
          slidesPerView: 3,
        },
        1024: {
          slidesPerView: 4,
        },
      }}
    >
      <SwiperSlide>
        <motion.div
          initial={{ scale: 0.6 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center space-y-1 group"
        >
          <div className="overflow-hidden relative rounded-full">
            <img
              className="rounded-full w-[40rem] border-4 border-white group-hover:scale-110 transition-all duration-300 ease-in-out"
              src={Ajay}
              alt=""
            />
          </div>
          <div>
            <div className="font-semibold text-xl">Ajay</div>
            <div className="text-base">Video Editor</div>
          </div>
        </motion.div>
      </SwiperSlide>
      <SwiperSlide>
        <motion.div
          initial={{ scale: 0.6 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center space-y-1 group"
        >
          <div className="overflow-hidden relative rounded-full">
            <img
              className="rounded-full w-[40rem] border-4 border-white group-hover:scale-110 transition-all duration-300 ease-in-out"
              src={Dhinesh}
              alt=""
            />
          </div>
          <div>
            <div className="font-semibold text-xl">Dhinesh</div>
            <div className="text-base">Graphic Designer</div>
          </div>
        </motion.div>
      </SwiperSlide>
      <SwiperSlide>
        <motion.div
          initial={{ scale: 0.6 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center space-y-1 group"
        >
          <div className="overflow-hidden relative rounded-full">
            <img
              className="rounded-full w-[40rem] border-4 border-white group-hover:scale-110 transition-all duration-300 ease-in-out"
              src={Dhanashekar}
              alt=""
            />
          </div>
          <div>
            <div className="font-semibold text-xl">Dhanashekar</div>
            <div className="text-base">Sketch Artist</div>
          </div>
        </motion.div>
      </SwiperSlide>
      <SwiperSlide>
        <motion.div
          initial={{ scale: 0.6 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center space-y-1 group"
        >
          <div className="overflow-hidden relative rounded-full">
            <img
              className="rounded-full w-[40rem] border-4 border-white group-hover:scale-110 transition-all duration-300 ease-in-out"
              src={Sankar}
              alt=""
            />
          </div>
          <div>
            <div className="font-semibold text-xl">Sankar</div>
            <div className="text-base">Illustrator</div>
          </div>
        </motion.div>
      </SwiperSlide>
    </Swiper>
  );
};

export default TestimonialsSlider;
