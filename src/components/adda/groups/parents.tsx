import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { motion } from "framer-motion";
import "swiper/swiper-bundle.css";

const Parents = () => {
  const parents = [
    {
      name: "Rahul",
      kidsAge: 12,
      img: "/profilePictures/pexels-olly-733872.jpg",
    },
    {
      name: "Ram",
      kidsAge: 12,
      img: "/profilePictures/pexels-olly-733872.jpg",
    },
    {
      name: "Leela",
      kidsAge: 12,
      img: "/profilePictures/pexels-stefanstefancik-91227.jpg",
    },
    {
      name: "Malathi",
      kidsAge: 12,
      img: "/profilePictures/pexels-justin-shaifer-501272-1222271.jpg",
    },
    {
      name: "Rahul",
      kidsAge: 12,
      img: "/profilePictures/pexels-olly-733872.jpg",
    },
    {
      name: "Ram",
      kidsAge: 12,
      img: "/profilePictures/pexels-olly-733872.jpg",
    },
    {
      name: "Leela",
      kidsAge: 12,
      img: "/profilePictures/pexels-stefanstefancik-91227.jpg",
    },
    {
      name: "Malathi",
      kidsAge: 12,
      img: "/profilePictures/pexels-justin-shaifer-501272-1222271.jpg",
    },
  ];

  return (
    <div className="flex flex-col items-center p-6 space-y-6 w-full">
      <h1 className="text-2xl font-bold text-left w-full">
        Connect with Parents Who Share Your Interests
      </h1>
      <style>
        {`
          .swiper-pagination {
            position: relative;
            bottom: auto;
            margin-top: 20px;
          }
          
          .swiper-button-next {
            width: 30px;
            height: 30px;
            top:45%
          }

          .swiper-button-prev {
            width: 30px;
            height: 30px;
            top:45%
          }
        `}
      </style>

      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={30}
        slidesPerView={7}
        breakpoints={{
          320: { slidesPerView: 1 },
          480: { slidesPerView: 2 },
          640: { slidesPerView: 3 },
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 5 },
          1280: { slidesPerView: 7 },
        }}
        navigation
        pagination={{ clickable: true }}
        className="w-full"
      >
        {parents.map((data, index) => (
          <SwiperSlide key={index}>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden p-4 flex flex-col items-center text-center">
              <img
                src={data.img}
                alt={data.name}
                className="h-20 w-20 object-cover rounded-full"
              />
              <div className="mt-3">
                <h2 className="text-lg font-semibold">{data.name}</h2>
                <p className="text-gray-600">
                  Parent of {data.kidsAge} Years old
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.99 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.3, ease: "easeOut" },
                }}
                className="border border-[#EC9600] rounded-lg px-5 py-1 mt-2 cursor-pointer"
              >
                Connect
              </motion.button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Parents;
