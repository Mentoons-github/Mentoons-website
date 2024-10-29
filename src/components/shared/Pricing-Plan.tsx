const PricingPlan = () => {
  return (
    <div className='  p-4 bg-[#2A5F93] pt-12 '>
      <div className='flex items-center justify-center  text-white text-3xl font-bold  tracking-wider '>
        {" "}
        <span className=' p-4 px-8 rounded-3xl bg-[#26276A]'>
          Choose your plan
        </span>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2  sm:px-12 md:px-24 lg:px-48 py-12 '>
        <div className=' w-full flex items-center justify-center md:w-[90%] md:h-[90%]  '>
          <img
            src='/assets/images/basic-plan-card.png'
            alt=''
            className='w-full object-cover'
          />
        </div>

        <div className=' w-full flex items-center justify-center md:w-[90%] md:h-[90%] scale-125 '>
          <img
            src='/assets/images/premium-plan.png'
            alt=''
            className='w-full object-cover'
          />
        </div>
      </div>
    </div>
  );
};

export default PricingPlan;
