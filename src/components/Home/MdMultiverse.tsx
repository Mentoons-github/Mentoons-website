const MdMultiverse = () => {
  return (
    <div className='w-full h-full relative'>
      <figure className='w-[8rem] sm:w-[20rem] md:w-[15rem] h-auto absolute left-20'>
        <img
          src='/assets/home/specs.png'
          alt='specs-asset'
          className='h-full w-full object-contain'
        />
      </figure>
      <figure className='w-full relative mt-8 sm:mt-10 md:mt-12'>
        <img
          src='/assets/images/green-bg.png'
          alt='hero'
          className='w-full object-contain'
        />
        <h1 className='absolute top-[35%] right-6 sm:right-[10%] text-right text-xl sm:text-3xl md:text-5xl font-extrabold text-white leading-tight'>
          GIVE YOUR
          <br /> CHILD THE GIFT OF
          <br /> GROWTH WITH
          <br /> <span className='text-[#3d7719]'>MENTOONS</span>
        </h1>
        <h1 className='absolute top-[60%]   sm:right-[10%] text-left text-xl sm:text-3xl md:text-5xl font-extrabold text-white leading-tight pl-6'>
          A <span className='text-red-500'>U</span>
          <span className='text-orange-500'>N</span>
          <span className='text-yellow-500'>I</span>
          <span className='text-green-500'>Q</span>
          <span className='text-blue-500'>U</span>
          <span className='text-purple-500'>E</span> platform that
          <br />
          combines enriching
          <br />
          mentorship with the captivating
          <br />
          power of cartoons
        </h1>
        {/* <button className="h-8 w-8 lg:h-28 lg:w-28 absolute bottom-[20%] right-[15%] md:bottom-[25%] md:right-[20%]">
          <img
            src="/assets/home/btn-green.png"
            alt="green-btn"
            className="h-full w-full object-contain "
          />
        </button> */}
        {/* <div className='text-center text-lg sm:text-2xl md:text-4xl lg:text-6xl font-bold mt-8 sm:mt-10 md:mt-12 relative p-16 lg:p-44'> */}
        {/* <button className="h-8 w-8 lg:h-28 lg:w-28 absolute bottom-2 right-[15%] md:bottom-6 md:right-[10%]">
          <img
            src="/assets/home/btn-blue.png"
            alt="blue-btn"
            className="h-full w-full object-contain"
          />
        </button> */}
        {/* </div> */}
      </figure>
      {/* <figure className='w-[8rem] lg:w-[20rem] md:w-[15rem] h-auto absolute right-6 lg:right-20'>
        <img
          src='/assets/home/helicopter.png'
          alt='helicopter-asset'
          className='h-full w-full object-contain'
        />
      </figure> */}
    </div>
  );
};

export default MdMultiverse;
