const MeetMentors = () => {
  return (
    <div>
      <div
        className="h-full relative"
        style={{
          background: "linear-gradient(360deg, #FFD037 0%, #FFF1CA 100%)",
        }}
      >
        <img
          src="/assets/LandingPage/vec.png"
          alt="md-multiverse"
          className="absolute inset-0 w-full object-cover hidden lg:block"
        />
        {/* <img src="/assets/LandingPage/mask.png" alt="md-multiverse" className="absolute inset-0 w-full object-cover h-full lg:h-auto" /> */}
        <div className="flex flex-col lg:flex-row items-center justify-around gap-8 p-4 lg:p-10">
          <div className="relative w-full lg:w-[40%] lg:ml-32   flex flex-col items-center justify-center">
            <figure className="w-[90%] lg:w-[40%] ">
              <img
                src="/assets/LandingPage/metal-mahesh.png"
                alt="md-multiverse"
                className="w-full object-cover "
              />
            </figure>
            <div className="w-full  relative bg-white rounded-lg p-4 z-20 mt-4 lg:mt-0">
              <p className="text-black text-xl lg:text-2xl font-bold text-center lg:text-left">
                Each mentor brings years of knowledge and hands-on experience,
                providing invaluable insights into industry trends and best
                practices.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-6 lg:gap-6 w-full lg:w-auto px-4 lg:px-0">
            <h1
              className="text-3xl lg:text-4xl font-bold text-center"
              style={{
                background: "transparent",
                backgroundImage:
                  "radial-gradient(50% 50% at 50% 50%, #FCBB00 0%, #513D04 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                WebkitTextFillColor: "transparent",
              }}
            >
              MEET OUR MENTORS
            </h1>
            <p className="text-black text-lg lg:text-xl text-center lg:text-left">
              Our mentors are the pillars of
              <br className="hidden lg:block" /> wisdom, experience, and
              support,
              <br className="hidden lg:block" /> dedicated to guiding us through
              our
              <br className="hidden lg:block" /> journey. They bring valuable
              <br className="hidden lg:block" /> insights, encouragement, and
              <br className="hidden lg:block" /> constructive feedback, ensuring
              we
              <br className="hidden lg:block" /> achieve our full potential.
            </p>
            <button className="bg-[#FF6403] text-white font-bold text-lg lg:text-xl px-4 py-2 rounded-lg w-full lg:w-auto">
              Watch our videos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetMentors;
