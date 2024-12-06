const Carts = () => {
  return (
    <section>
      <div className="shadow-xl flex items-start   bg-white  rounded-lg border">
        <div className=" p-2 pt-3 ">
          <img
            src="/assets/images/product-card-thumbnail.png"
            alt=""
            className="w-full max-w-56 "
          />
        </div>
        <div
          className="w-[70%] flex flex-col  p-2
        "
        >
          <h2 className="font-semibold text-xl pt-0 ">
            Conversation starter card (6-12) years
          </h2>
          <p className="line-clamp-2">
            Discover the power of meaningful conversation with our conversation
            starter card. Watch your kids become more expresive. creative, and
            socially confident.{" "}
          </p>
          <p className="text-xl font-bold">₹ 199</p>
          <div>
            <p className="text-xl font-semibold">Quantity :</p>
            <div className="flex ">
              <p className="px-6 rounded-full  bg-black/60 text-white flex items-center justify-center text-xl font-semibold">
                {" "}
                -{" "}
              </p>

              <p className="px-6 rounded-full pb-1   flex items-center justify-center text-xl font-bold">
                {" "}
                0{" "}
              </p>
              <p className="px-6 rounded-full pb-1  bg-black/60 text-white flex items-center justify-center text-xl font-semibold">
                {" "}
                +{" "}
              </p>
            </div>
          </div>

          <div className="mt-2 text-md">
            <button className="border border-black px-4 py-[5px] rounded-full hover:bg-black hover:text-white transition-all duration-300">
              Remove
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Carts;
