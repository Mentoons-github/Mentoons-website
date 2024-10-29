import { useEffect, useState } from "react";

const Struggles = () => {
  const [videoSize, setVideoSize] = useState<number>(600); // Initial size

  const updateScreenSize = () => {
    const width = window.innerWidth;
    if (width >= 1200) {
      setVideoSize(600); // Set video size to 600px if screen width is 1200px or more
    } else {
      setVideoSize(400); // Set video size to 400px if screen width is smaller than 1200px
    }
  };

  useEffect(() => {
    updateScreenSize(); // Update video size on component mount
    window.addEventListener("resize", updateScreenSize);

    return () => {
      window.removeEventListener("resize", updateScreenSize); // Cleanup the event listener on unmount
    };
  }, []);
  return (
    <>
      <div className='w-full h-full pt-[26%]'>
        <div className="bg-[url('/assets/home/Group 2.png')] lg:bg-cover bg-bottom bg-no-repeat  h-full w-full px-2 ">
          <div className='relative flex flex-col md:flex-row items-center justify-around space-y-4'>
            <h1 className='text-3xl lg:text-7xl text-start px-4'>
              We know
              <br />
              <span className='font-extrabold'>THE STRUGGLES</span>
              <br />
              our youth is facing
              <p className='w-full md:w-[70%] lg:w-[90%] text-sm lg:text-lg text-start mt-4 text-[#ADA6A6] space-x-1'>
                <span>Mobile Addiction,</span>
                <span>Scrolling Addiction,</span>
                <span>Porn Addiction,</span>
                <span>Sex Addiction,</span>
                <span>Performance Addiction,</span>
                <span>Entertainment Addiction.</span>
              </p>
            </h1>
            <div>
              <video
                src='https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/AGES+13+-+19/struggle-we-know.mp4'
                className='rounded-xl'
                autoPlay
                muted
                loop
                width={videoSize}
              />
            </div>
          </div>
          <div className='w-full mt-8 '>
            <img
              src='/assets/images/struggle-we-know-banner.png'
              alt=''
              className='w-full object-cover'
            />
          </div>
        </div>
        <div className="w-full flex bg-[url('/assets/images/blue-wave.png')] bg-top bg-no-repeat bg-cover pt-[5rem] lg:pt-40">
          <div className='w-ful  flex flex-1 justify-center'>
            <img
              src='/assets/images/here-how-we-help.png'
              alt='negative effects of mobile'
              className=' w-[90%] lg:w-[70%]  object-cover pt-14 lg:pt-6'
            />
          </div>
          <div className='flex flex-1 items-center'>
            <img
              src='/assets/home/Assets-2.png'
              alt='negative effects of mobile'
              className=' w-full object-contain lg:p-12 lg:pt-24'
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Struggles;
