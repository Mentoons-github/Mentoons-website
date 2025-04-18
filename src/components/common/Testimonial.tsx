import { motion } from "framer-motion";
import { A11y, Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Wordbreak from "../comics/Wordbreak";

const Testimonial = () => {
  return (
    <div
      id="team"
      className=" flex flex-col bg-mt-orange text-white py-10 space-y-7"
    >
      <div className="py-8 space-y-12">
        <div className="text-start space-y-4">
          <div className="text-4xl text-center lg:text-5xl w-full font-extrabold tracking-wide leading-[1.10]">
            See what other has to say <Wordbreak />
            about Mentoons
          </div>
        </div>
        <div className="w-[80%] mx-auto ">
          <Swiper
            // install Swiper modules
            modules={[Navigation, Pagination, A11y, Autoplay]}
            spaceBetween={10}
            autoplay={{ delay: 1500, disableOnInteraction: false }}
            loop={true} // Enable infinite looping
            navigation={false}
            className=""
            breakpoints={{
              // Up to 767px (mobile size)
              0: {
                slidesPerView: 1, // Show only 1 card on mobile
              },
              // From to 767px (mobile size)
              767: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
          >
            {Testimonials.map((employee) => (
              <SwiperSlide key={employee.id}>
                <motion.div
                  initial={{ scale: 0.6 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className=" space-y-1 group border   rounded-2xl group-hover:scale-110 text-left p-2 pl-3"
                >
                  <div className="flex  gap-3">
                    <div className="overflow-hidden relative rounded-full w-[3rem] h-auto  ">
                      <img
                        className="rounded-full w-full   mx-auto"
                        src={employee.imageUrl}
                        alt=""
                      />
                    </div>
                    <div>
                      <div className="font-semibold text-xl">
                        {employee.name}
                      </div>
                      <div className="text-base text-white/60">
                        {employee.designation}
                      </div>
                    </div>
                  </div>
                  <div>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. A
                    quia sed omnis? Natus nostrum excepturi incidunt tempora
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;

const Testimonials = [
  {
    id: "tst_01",
    quote:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos voluptate blanditiis eligendi libero nam ad obcaecati nulla deserunt possimus officiis!",
    designation: "Lorem ipsum dolor sit amet.",
    name: "Lorem, ipsum",
    imageUrl: "/assets/images/ankur.jpg",
  },
  {
    id: "tst_01",
    quote:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos voluptate blanditiis eligendi libero nam ad obcaecati nulla deserunt possimus officiis!",
    designation: "Lorem ipsum dolor sit amet.",
    name: "Lorem, ipsum",
    imageUrl: "/assets/images/ajay.jpg",
  },
  {
    id: "tst_01",
    quote:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos voluptate blanditiis eligendi libero nam ad obcaecati nulla deserunt possimus officiis!",
    designation: "Lorem ipsum dolor sit amet.",
    name: "Lorem, ipsum",
    imageUrl: "/assets/images/anitha.png",
  },
  {
    id: "tst_01",
    quote:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos voluptate blanditiis eligendi libero nam ad obcaecati nulla deserunt possimus officiis!",
    designation: "Lorem ipsum dolor sit amet.",
    name: "Lorem, ipsum",
    imageUrl: "/assets/images/author.jpg",
  },
  {
    id: "tst_01",
    quote:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos voluptate blanditiis eligendi libero nam ad obcaecati nulla deserunt possimus officiis!",
    designation: "Lorem ipsum dolor sit amet.",
    name: "Lorem, ipsum",
    imageUrl: "/assets/images/author.jpg",
  },
  {
    id: "tst_01",
    quote:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos voluptate blanditiis eligendi libero nam ad obcaecati nulla deserunt possimus officiis!",
    designation: "Lorem ipsum dolor sit amet.",
    name: "Lorem, ipsum",
    imageUrl: "/assets/images/author.jpg",
  },
  {
    id: "tst_01",
    quote:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos voluptate blanditiis eligendi libero nam ad obcaecati nulla deserunt possimus officiis!",
    designation: "Lorem ipsum dolor sit amet.",
    name: "Lorem, ipsum",
    imageUrl: "/assets/images/author.jpg",
  },
];
