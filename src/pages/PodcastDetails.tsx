import { useLocation } from "react-router-dom";

const PodcastDetails = () => {
  const location = useLocation();
  const { id, label, description } = location.state;
  return (
    <section
      id={id}
      className=' bg-orange-500 text-white grid place-content-center  py-24'
    >
      <div className=' w-full '>
        <h1 className='text-5xl text-center font-bold pb-6 '>{label}</h1>
        <p className='text-center text-base  md:w-[50%] mx-auto'>
          {description}
        </p>
      </div>
      <div className='w-full  mt-4 flex items-center justify-center '>
        <div className='w-fit  flex items-center justify-center gap-2 border-r pr-3'>
          <div className='w-8 rounded-full '>
            <img
              src='/assets/images/author.jpg'
              alt=''
              className='rounded-full object-cover w-full'
            />
          </div>
          <span className='text-center'> Mentor Mahesh</span>
        </div>
        <div className='w-fit  flex items-center justify-center gap-2 h-full pl-3 border-l '>
          Episode's 05
        </div>
      </div>
    </section>
  );
};

export default PodcastDetails;
