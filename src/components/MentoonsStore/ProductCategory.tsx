const ProductCategory = () => {
  return (
    <>
      <div>
        <div className="flex items-center justify-between p-4 px-0 ">
          <div className=" w-full flex flex-col gap-4  ">
            <div className="relative ">
              <h1 className=" font-bold text-5xl  text-white text-center md:text-start">
                Conversation Starter Cards
              </h1>
            </div>
            {/* <div className=" w-full h-96  rounded-2xl mb-6">
              <video src=" "></video>
            </div> */}
            <div className="flex items-center gap-4 justify-center md:justify-start">
              {["Trending", "Latest", "Most Popular"].map((item, index) => (
                <div
                  key={item + index}
                  className="px-4 py-1 text-md font-semibold text-zinc-700 border border-white  rounded-full hover:bg-white/40 "
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="  flex md:items-start justify-center gap-4 md:justify-between flex-wrap pt-1 pb-24">
          {" "}
          <div className=" p-2 py-3 border-[0.5px] border-transparent hover:border-[0.5px] hover:border-white/50  hover:shadow-2xl hover:scale-105 transition-all duration-300 rounded-2xl bg-white">
            <div>
              <img
                src="/assets/images/product-card-thumbnail.png"
                alt=""
                className=""
              />
              <div className=" ">
                <div className="w-72 p-2  flex   justify-between">
                  <h2 className="text-zinc-700 w-[80%]  ">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Perferendis, tempore.
                  </h2>
                  <p className="font-bold text-lg text-zinc-700">₹ 199</p>
                </div>
                <div className="flex items-center justify-between p-2">
                  <span className="text-md font-semibold text-zinc-700">
                    {" "}
                    Rating: ⭐️⭐️⭐️⭐️
                  </span>
                  <span className="text-md font-semibold text-zinc-700">
                    {" "}
                    4/5
                  </span>
                </div>
                <div className="flex items-center  justify-between gap-4 p-2">
                  <button className="px-5 py-2  border font-semibold border-black/30 rounded-full bg-white/60">
                    Add to cart
                  </button>
                  <button className="px-5 py-2 border font-semibold bg-green-300 rounded-full border-green-200">
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>{" "}
          <div className=" p-2 py-3 border-[0.5px] border-transparent hover:border-[0.5px] hover:border-white/50  hover:shadow-2xl hover:scale-105 transition-all duration-300 rounded-2xl bg-white">
            <div>
              <img
                src="/assets/images/product-card-thumbnail.png"
                alt=""
                className=""
              />
              <div className=" ">
                <div className="w-72 p-2  flex   justify-between">
                  <h2 className="text-zinc-700 w-[80%]  ">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Perferendis, tempore.
                  </h2>
                  <p className="font-bold text-lg text-zinc-700">₹ 199</p>
                </div>
                <div className="flex items-center justify-between p-2">
                  <span className="text-md font-semibold text-zinc-700">
                    {" "}
                    Rating: ⭐️⭐️⭐️⭐️
                  </span>
                  <span className="text-md font-semibold text-zinc-700">
                    {" "}
                    4/5
                  </span>
                </div>
                <div className="flex items-center  justify-between gap-4 p-2">
                  <button className="px-5 py-2  border font-semibold border-black/30 rounded-full bg-white/60">
                    Add to cart
                  </button>
                  <button className="px-5 py-2 border font-semibold bg-green-300 rounded-full border-green-200">
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className=" p-2 py-3 border-[0.5px] border-transparent hover:border-[0.5px] hover:border-white/50  hover:shadow-2xl hover:scale-105 transition-all duration-300 rounded-2xl bg-white">
            <div>
              <img
                src="/assets/images/product-card-thumbnail.png"
                alt=""
                className=""
              />
              <div className=" ">
                <div className="w-72 p-2  flex   justify-between">
                  <h2 className="text-zinc-700 w-[80%]  ">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Perferendis, tempore.
                  </h2>
                  <p className="font-bold text-lg text-zinc-700">₹ 199</p>
                </div>
                <div className="flex items-center justify-between p-2">
                  <span className="text-md font-semibold text-zinc-700">
                    {" "}
                    Rating: ⭐️⭐️⭐️⭐️
                  </span>
                  <span className="text-md font-semibold text-zinc-700">
                    {" "}
                    4/5
                  </span>
                </div>
                <div className="flex items-center  justify-between gap-4 p-2">
                  <button className="px-5 py-2  border font-semibold border-black/30 rounded-full bg-white/60">
                    Add to cart
                  </button>
                  <button className="px-5 py-2 border font-semibold bg-green-300 rounded-full border-green-200">
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between p-4 px-0 ">
          <div className=" w-full flex flex-col gap-4  ">
            <div className="relative ">
              <h1 className=" font-bold text-5xl  text-white text-center md:text-start">
                Story Re-Teller Card
              </h1>
            </div>
            {/* <div className=" w-full  rounded-2xl mb-6">
              <video
                src="https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/AGES+6+-+12/story-re-teller-card.mp4"
                autoPlay
                muted
                controls
                playsInline
                webkit-playinline
              ></video>
            </div> */}
            <div className="flex items-center gap-4 justify-center md:justify-start">
              {["Trending", "Latest", "Most Popular"].map((item, index) => (
                <div
                  key={item + index}
                  className="px-4 py-1 text-md font-semibold text-zinc-700 border border-white  rounded-full hover:bg-white/40 "
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="  flex md:items-start justify-center gap-4 md:justify-between flex-wrap pt-1 pb-24">
          {" "}
          <div className=" p-2 py-3 border-[0.5px] border-transparent hover:border-[0.5px] hover:border-white/50  hover:shadow-2xl hover:scale-105 transition-all duration-300 rounded-2xl bg-white">
            <div>
              <img
                src="/assets/images/product-card-thumbnail.png"
                alt=""
                className=""
              />
              <div className=" ">
                <div className="w-72 p-2  flex   justify-between">
                  <h2 className="text-zinc-700 w-[80%]  ">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Perferendis, tempore.
                  </h2>
                  <p className="font-bold text-lg text-zinc-700">₹ 199</p>
                </div>
                <div className="flex items-center justify-between p-2">
                  <span className="text-md font-semibold text-zinc-700">
                    {" "}
                    Rating: ⭐️⭐️⭐️⭐️
                  </span>
                  <span className="text-md font-semibold text-zinc-700">
                    {" "}
                    4/5
                  </span>
                </div>
                <div className="flex items-center  justify-between gap-4 p-2">
                  <button className="px-5 py-2  border font-semibold border-black/30 rounded-full bg-white/60">
                    Add to cart
                  </button>
                  <button className="px-5 py-2 border font-semibold bg-green-300 rounded-full border-green-200">
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>{" "}
          <div className=" p-2 py-3 border-[0.5px] border-transparent hover:border-[0.5px] hover:border-white/50  hover:shadow-2xl hover:scale-105 transition-all duration-300 rounded-2xl bg-white">
            <div>
              <img
                src="/assets/images/product-card-thumbnail.png"
                alt=""
                className=""
              />
              <div className=" ">
                <div className="w-72 p-2  flex   justify-between">
                  <h2 className="text-zinc-700 w-[80%]  ">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Perferendis, tempore.
                  </h2>
                  <p className="font-bold text-lg text-zinc-700">₹ 199</p>
                </div>
                <div className="flex items-center justify-between p-2">
                  <span className="text-md font-semibold text-zinc-700">
                    {" "}
                    Rating: ⭐️⭐️⭐️⭐️
                  </span>
                  <span className="text-md font-semibold text-zinc-700">
                    {" "}
                    4/5
                  </span>
                </div>
                <div className="flex items-center  justify-between gap-4 p-2">
                  <button className="px-5 py-2  border font-semibold border-black/30 rounded-full bg-white/60">
                    Add to cart
                  </button>
                  <button className="px-5 py-2 border font-semibold bg-green-300 rounded-full border-green-200">
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className=" p-2 py-3 border-[0.5px] border-transparent hover:border-[0.5px] hover:border-white/50  hover:shadow-2xl hover:scale-105 transition-all duration-300 rounded-2xl bg-white">
            <div>
              <img
                src="/assets/images/product-card-thumbnail.png"
                alt=""
                className=""
              />
              <div className=" ">
                <div className="w-72 p-2  flex   justify-between">
                  <h2 className="text-zinc-700 w-[80%]  ">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Perferendis, tempore.
                  </h2>
                  <p className="font-bold text-lg text-zinc-700">₹ 199</p>
                </div>
                <div className="flex items-center justify-between p-2">
                  <span className="text-md font-semibold text-zinc-700">
                    {" "}
                    Rating: ⭐️⭐️⭐️⭐️
                  </span>
                  <span className="text-md font-semibold text-zinc-700">
                    {" "}
                    4/5
                  </span>
                </div>
                <div className="flex items-center  justify-between gap-4 p-2">
                  <button className="px-5 py-2  border font-semibold border-black/30 rounded-full bg-white/60">
                    Add to cart
                  </button>
                  <button className="px-5 py-2 border font-semibold bg-green-300 rounded-full border-green-200">
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>{" "}
      <div>
        <div className="flex items-center justify-between p-4 px-0 ">
          <div className=" w-full flex flex-col gap-4  ">
            <div className="relative ">
              <h1 className=" font-bold text-5xl  text-white text-center md:text-start">
                Silent Stories
              </h1>
            </div>
            {/* <div className=" w-full h-96 rounded-2xl mb-6">
              <video
                src="https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/AGES+6+-+12/silent-stories.mp4"
                autoPlay
                controls
                muted
                playsInline
                webkit-playinline
              ></video>
            </div> */}
            <div className="flex items-center gap-4 justify-center md:justify-start">
              {["Trending", "Latest", "Most Popular"].map((item, index) => (
                <div
                  key={item + index}
                  className="px-4 py-1 text-md font-semibold text-zinc-700 border border-white  rounded-full hover:bg-white/40 "
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="  flex md:items-start justify-center gap-4 md:justify-between flex-wrap pt-1 pb-24">
          {" "}
          <div className=" p-2 py-3 border-[0.5px] border-transparent hover:border-[0.5px] hover:border-white/50  hover:shadow-2xl hover:scale-105 transition-all duration-300 rounded-2xl bg-white">
            <div>
              <img
                src="/assets/images/product-card-thumbnail.png"
                alt=""
                className=""
              />
              <div className=" ">
                <div className="w-72 p-2  flex   justify-between">
                  <h2 className="text-zinc-700 w-[80%]  ">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Perferendis, tempore.
                  </h2>
                  <p className="font-bold text-lg text-zinc-700">₹ 199</p>
                </div>
                <div className="flex items-center justify-between p-2">
                  <span className="text-md font-semibold text-zinc-700">
                    {" "}
                    Rating: ⭐️⭐️⭐️⭐️
                  </span>
                  <span className="text-md font-semibold text-zinc-700">
                    {" "}
                    4/5
                  </span>
                </div>
                <div className="flex items-center  justify-between gap-4 p-2">
                  <button className="px-5 py-2  border font-semibold border-black/30 rounded-full bg-white/60">
                    Add to cart
                  </button>
                  <button className="px-5 py-2 border font-semibold bg-green-300 rounded-full border-green-200">
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>{" "}
          <div className=" p-2 py-3 border-[0.5px] border-transparent hover:border-[0.5px] hover:border-white/50  hover:shadow-2xl hover:scale-105 transition-all duration-300 rounded-2xl bg-white">
            <div>
              <img
                src="/assets/images/product-card-thumbnail.png"
                alt=""
                className=""
              />
              <div className=" ">
                <div className="w-72 p-2  flex   justify-between">
                  <h2 className="text-zinc-700 w-[80%]  ">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Perferendis, tempore.
                  </h2>
                  <p className="font-bold text-lg text-zinc-700">₹ 199</p>
                </div>
                <div className="flex items-center justify-between p-2">
                  <span className="text-md font-semibold text-zinc-700">
                    {" "}
                    Rating: ⭐️⭐️⭐️⭐️
                  </span>
                  <span className="text-md font-semibold text-zinc-700">
                    {" "}
                    4/5
                  </span>
                </div>
                <div className="flex items-center  justify-between gap-4 p-2">
                  <button className="px-5 py-2  border font-semibold border-black/30 rounded-full bg-white/60">
                    Add to cart
                  </button>
                  <button className="px-5 py-2 border font-semibold bg-green-300 rounded-full border-green-200">
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className=" p-2 py-3 border-[0.5px] border-transparent hover:border-[0.5px] hover:border-white/50  hover:shadow-2xl hover:scale-105 transition-all duration-300 rounded-2xl bg-white">
            <div>
              <img
                src="/assets/images/product-card-thumbnail.png"
                alt=""
                className=""
              />
              <div className=" ">
                <div className="w-72 p-2  flex   justify-between">
                  <h2 className="text-zinc-700 w-[80%]  ">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Perferendis, tempore.
                  </h2>
                  <p className="font-bold text-lg text-zinc-700">₹ 199</p>
                </div>
                <div className="flex items-center justify-between p-2">
                  <span className="text-md font-semibold text-zinc-700">
                    {" "}
                    Rating: ⭐️⭐️⭐️⭐️
                  </span>
                  <span className="text-md font-semibold text-zinc-700">
                    {" "}
                    4/5
                  </span>
                </div>
                <div className="flex items-center  justify-between gap-4 p-2">
                  <button className="px-5 py-2  border font-semibold border-black/30 rounded-full bg-white/60">
                    Add to cart
                  </button>
                  <button className="px-5 py-2 border font-semibold bg-green-300 rounded-full border-green-200">
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductCategory;
