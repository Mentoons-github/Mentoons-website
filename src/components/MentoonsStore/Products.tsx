import { motion } from "framer-motion";
import { FaHandPointRight } from "react-icons/fa";
import { IoShareSocialSharp } from "react-icons/io5";
import Testimonial from "../common/Testimonial";

const Product = () => {
  return (
    <section className="bg-[linear-gradient(360deg,_#42A0CE_0%,_#034E73_100%)] min-h-screen py-14 pb-0">
      <div className="w-[80%] h-full bg-amber-50  mx-auto p-4 rounded-3xl pb-12">
        <div className="  md:flex ">
          <div className=" flex-1 md:flex md:flex-row-reverse  ">
            <div className="  flex flex-[0.85] p-4 md:py-0 md:pl-0 ">
              <img
                src="/assets/images/product-card-thumbnail.png"
                alt="product image"
                className="flex items-center justify-center"
              />
              {/* <div>
                <ImageMagnifier
                  src="/assets/images/product-card-thumbnail.png"
                  width={400}
                  height={400}
                  magnifierHeight={400}
                  magnifierWidth={600}
                  zoomLevel={2}
                />
              </div> */}
            </div>

            <div className="  flex gap-2 flex-[0.15] p-2 md:px-0  overflow-y-auto md:flex-col">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="  ">
                  <img
                    src="/assets/images/product-card-thumbnail.png"
                    alt="product thumbnail"
                    className=""
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 0 px-2 md:px-4">
            <div className="flex items-center justify-between py-1 ">
              <h2 className="text-2xl font-bold md:text-5xl">
                Conversation Starter Cards
              </h2>
              <IoShareSocialSharp className="text-xl md:text-2xl" />
            </div>
            <div className="pb-4 md:pt-2">
              <p className="text-md font-semibold md:text-xl">
                Age group 6 to 12
              </p>
              <div className="flex items-start justify-between md:pt-1">
                <div className=" flex items-center gap-3">
                  <input type="checkbox" className="" />
                  <span className="md:text-lg">Paper Edition </span>
                </div>
                <p className="text-md font-semibold text-red-600 md:text-xl">
                  ₹ 199.00
                </p>
              </div>
              <div className="flex items-center justify-between md:pt-1">
                <div className="flex items-center gap-3 ">
                  <input type="checkbox" />
                  <span className="md:text-xl">Download PDF </span>
                </div>
                <p className="text-md font-semibold text-red-600 md:text-xl ">
                  ₹ 99.00
                </p>
              </div>
              <div className="flex items-start justify-between md:pt-1">
                <div className="flex items-start gap-3 ">
                  <FaHandPointRight className="text-2xl" />
                  <p className="md:text-xl">
                    <span className="text-green-500 ">
                      Download 6 cards for free.
                    </span>{" "}
                    Includes total of 30 cards{"  "}
                  </p>
                </div>

                <p className="text-md font-semibold whitespace-nowrap text-red-600 text-xl">
                  ₹ 00.00
                </p>
              </div>
              <div className="flex items-center justify-between pb-6 text-2xl">
                <h2 className="text-xl font-bold">Rating: </h2>
                <p> ⭐️⭐️⭐️⭐️ 4/5</p>
              </div>
            </div>

            <div className="flex items-start  justify-between gap-6 pb-6">
              <div className="flex flex-col p-1  ">
                <p className=" font-bold md:text-xl">Quantity : </p>
                <div className="flex  items-center justify-between gap-4  p-1 rounded-full pt-2">
                  <button className="px-4 text-md  font-bold  border rounded-full md:text-xl">
                    {" "}
                    +{" "}
                  </button>
                  <span className="text-md font-bold md:text-xl">{0}</span>
                  <button className=" text-md font-bold px-4 border rounded-full md:text-xl">
                    {" "}
                    -{" "}
                  </button>
                </div>
              </div>

              <div className="">
                <div className=" flex flex-col items-center justify-end  relative">
                  <button className="text-xs border-2 text-center p-2 py-1 rounded-lg border-purple-600 font-semibold self-end mr-4 ">
                    Gift your friend
                  </button>
                  <p className="text-xs text-center md:w-[50%]  mt-1 self-end">
                    Click the above button to send a gift to your friend
                  </p>

                  <motion.div
                    className="absolute right-0 -top-8 w-12"
                    animate={{ scale: [0.8, 1, 0.8] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  >
                    <img
                      src="/assets/images/gift-icon.png"
                      alt="Gift Icon"
                      className="w-full object-cover"
                    />
                  </motion.div>
                </div>
              </div>
            </div>
            <div className=" p-1 flex items-center justify-between pb-4 gap-8 ">
              <button className="text-lg font-bold flex-1 py-2  rounded-lg bg-stone-500 text-white md:text-xl">
                Add to Card
              </button>
              <button className="text-lg font-bold flex-1 py-2 rounded-lg bg-red-600 text-white md:text-xl">
                Buy Now
              </button>
            </div>

            <div>
              <p className="text-2xl font-bold md:text-3xl">Description : </p>
              <p className="pb-4 md:text-lg">
                Conversation Cards support kids' speech and communication
                skills. You can purchase individual cards, or choose a bundle
                that includes both a downloadable PDF and the printed edition.
              </p>
            </div>
          </div>
        </div>
        <div className=" ">
          <div className="">
            <h2 className="text-center text-4xl font-bold py-6 md:py-12 md:text-5xl md:pb-6">
              {" "}
              How Conversation Starter Cards helps.
            </h2>
            <div className=" mx-2 md:mx-12 mb-6 ">
              <video
                src="https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/AGES+6+-+12/conversation-card.mp4"
                autoPlay
                muted
                controls
                playsInline
                webkit-playinline
                className="rounded-3xl   border-4 border-[#3a2901]"
              ></video>
            </div>
            <div className="flex flex-col gap-4 md:flex-row md:gap-4 md:items-start md:justify-center px-4 ">
              <div className=" flex-1 rounded-xl  md:shadow-2xl bg-gradient-to-bl from-amber-200 to-yellow-500 border-4 border-[#3a2901] relative">
                <div className="absolute top-2 left-32 z-0">
                  <img src="/assets/images/kart-star.png" alt="" />
                </div>
                <div className="absolute top-40 left-52 z-0">
                  <img src="/assets/images/kart-message-bubble.png" alt="" />
                </div>
                <h3 className="text-center text-3xl font-bold text-[#3a2901] py-4  relative z-1">
                  Conversation Starter Cards
                </h3>
                <ul className="flex flex-col gap-2 p-2 pt-0 py-4 relative z-1">
                  <li className="flex items-center  gap-4 px-3 ">
                    <img
                      src="/assets/images/one-illustration.png"
                      alt=""
                      className=""
                    />
                    <p className="text-xl">Story Telling Format</p>
                  </li>
                  <li className="flex items-center  gap-4 px-3 ">
                    <img
                      src="/assets/images/two-illustration.png"
                      alt=""
                      className=""
                    />
                    <p className="text-xl">
                      Developed by pyschologist and educators
                    </p>
                  </li>
                  <li className="flex items-center  gap-4 px-3 ">
                    <img
                      src="/assets/images/three-illustration.png"
                      alt=""
                      className=""
                    />
                    <p className="text-xl">Age appropriate content </p>
                  </li>
                  <li className="flex items-center  gap-4 px-3 ">
                    <img
                      src="/assets/images/four-illustration.png"
                      alt=""
                      className=""
                    />
                    <p className="text-xl">Beautifully illustrated </p>
                  </li>
                  <li className="flex items-center  gap-4  px-3">
                    <img
                      src="/assets/images/five-illustration.png"
                      alt=""
                      className=""
                    />
                    <p className="text-xl">Introduction of new vocabulary </p>
                  </li>
                </ul>
              </div>

              <div className=" flex-1 rounded-xl  md:shadow-2xl bg-gradient-to-bl from-amber-200 to-yellow-500 border-4 border-[#3a2901] relative">
                <div className="absolute top-2 left-32 z-0">
                  <img src="/assets/images/kart-star.png" alt="" />
                </div>
                <div className="absolute top-40 left-52 z-0">
                  <img src="/assets/images/kart-message-bubble.png" alt="" />
                </div>
                <h3 className="text-center text-3xl font-bold text-[#3a2901] py-4  relative z-1">
                  How Kids Will Benefit
                </h3>
                <ul className="flex flex-col gap-2 p-2 pt-0 py-4 relative z-1">
                  <li className="flex items-center  gap-4 px-3 ">
                    <img
                      src="/assets/images/one-illustration.png"
                      alt=""
                      className=""
                    />
                    <p className="text-xl">
                      Learn easily by oldest format of communication{" "}
                    </p>
                  </li>
                  <li className="flex items-center  gap-4 px-3 ">
                    <img
                      src="/assets/images/two-illustration.png"
                      alt=""
                      className=""
                    />
                    <p className="text-xl">
                      Support emotional and social growth
                    </p>
                  </li>
                  <li className="flex items-center  gap-4 px-3 ">
                    <img
                      src="/assets/images/three-illustration.png"
                      alt=""
                      className=""
                    />
                    <p className="text-xl">Safe content for kids </p>
                  </li>
                  <li className="flex items-center  gap-4 px-3 ">
                    <img
                      src="/assets/images/four-illustration.png"
                      alt=""
                      className=""
                    />
                    <p className="text-xl">Makes learning visually engaging </p>
                  </li>
                  <li className="flex items-center  gap-4  px-3">
                    <img
                      src="/assets/images/five-illustration.png"
                      alt=""
                      className=""
                    />
                    <p className="text-xl">Expand language skills</p>
                  </li>
                </ul>
              </div>

              <div className=" flex-1 rounded-xl  md:shadow-2xl bg-gradient-to-bl from-amber-200 to-yellow-500 border-4 border-[#3a2901] relative">
                <div className="absolute top-2 left-32 z-0">
                  <img src="/assets/images/kart-star.png" alt="" />
                </div>
                <div className="absolute top-40 left-52 z-0">
                  <img src="/assets/images/kart-message-bubble.png" alt="" />
                </div>
                <h3 className="text-center text-3xl font-bold text-[#3a2901] py-4  relative z-1">
                  How Parents Will Benefit
                </h3>
                <ul className="flex flex-col gap-2 p-2 pt-0 py-4 relative z-1">
                  <li className="flex items-center  gap-4 px-3 ">
                    <img
                      src="/assets/images/one-illustration.png"
                      alt=""
                      className=""
                    />
                    <p className="text-xl">Helps in genuine friendship</p>
                  </li>
                  <li className="flex items-center  gap-4 px-3 ">
                    <img
                      src="/assets/images/two-illustration.png"
                      alt=""
                      className=""
                    />
                    <p className="text-xl">Provides expert- backed guidance</p>
                  </li>
                  <li className="flex items-center  gap-4 px-3 ">
                    <img
                      src="/assets/images/three-illustration.png"
                      alt=""
                      className=""
                    />
                    <p className="text-xl">Simplifies age specific guidance</p>
                  </li>
                  <li className="flex items-center  gap-4 px-3 ">
                    <img
                      src="/assets/images/four-illustration.png"
                      alt=""
                      className=""
                    />
                    <p className="text-xl">Keeps kids interested and focused</p>
                  </li>
                  <li className="flex items-center  gap-4  px-3">
                    <img
                      src="/assets/images/five-illustration.png"
                      alt=""
                      className=""
                    />
                    <p className="text-xl">
                      Boosts child's language development{" "}
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        {/* Testimonial */}
      </div>
      <div className="mt-8">
        <Testimonial />
      </div>
    </section>
  );
};

export default Product;
