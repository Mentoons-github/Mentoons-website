const AddaTV = () => {
  return (
    <div className="relative w-full md:w-[410px] lg:w-[500px] xl:w-[590px] h-auto flex justify-center items-center">
      <img
        src="/assets/home/addaTV/Rectangle 285.png"
        alt="tv"
        className="w-3/4 xl:w-full h-auto"
      />

      <div
        className="absolute mentoons-video top-1/2 left-1/2 w-[65%] lg:w-[65%] xl:w-[84%] h-[70%] bg-black -translate-x-1/2 -translate-y-1/2 rounded-t-[60px] overflow-hidden flex items-center justify-center"
        style={{ clipPath: "polygon(15% 100%, 90% 100%, 100% 0%, 0% 0%)" }}
      >
        <video
          className="w-[80%] h-full object-fill"
          autoPlay
          loop
          muted
          playsInline
        >
          <source
            src="https://res.cloudinary.com/dacwu8tri/video/upload/v1741671026/We_know_THE_STRUGGLES_our_youth_is_facing_03_ebzeuu.mp4"
            type="video/mp4"
          />
        </video>
      </div>
    </div>
  );
};

export default AddaTV;
