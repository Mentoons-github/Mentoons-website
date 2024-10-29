const Testimonial = () => {
  return (
    <section className=' py-12 pb-14  '>
      <h2 className='text-4xl text-dark-gray rubik-bubbles-regular pb-8 text-center font-bold'>
        What Parent and Children Say
      </h2>

      <div className=' grid grid-cols-1 place-items-center  gap-6 md:flex md:items-center md:justify-center md:gap-8'>
        <div className='   p-12  w-[340px]  rounded-3xl bg-lime-200 relative flex flex-col gap-4 shadow-2xl '>
          <div className='absolute left-0  right-0 px-6 flex items-start justify-between  '>
            <img
              src='/assets/images/quotation-mark.svg'
              alt='quotation mark icon'
              className='w-6'
            />
            <img
              src='/assets/images/quotation-mark.svg'
              alt='quotation mark icon'
              className='w-6 rotate-360 transform scale-x-[-1] custom-lime '
            />
          </div>
          <p className='text-font-22  text-center font-bold text-lime-600  relative'>
            These stories have opened up so many important conversation in our
            family.
          </p>

          <div className='flex flex-col items-center justify-center '>
            <div className='w-12 h-12 rounded-full border border-lime-800 overflow-hidden'>
              <img
                src='/assets/images/sarah.jpg'
                alt=''
                className='w-full h-full object-cover'
              />
            </div>{" "}
            <p className='text-font-16 font-bold text-lime-800'>
              {" "}
              Sarah,mother of two
            </p>
          </div>
        </div>
        <div className='   p-12  w-[340px]  rounded-3xl bg-purple-200 relative flex flex-col gap-4 shadow-2xl'>
          <div className='absolute left-0  right-0 px-6 flex items-start justify-between  '>
            <img
              src='/assets/images/quotation-mark.svg'
              alt='quotation mark icon'
              className='w-6'
            />
            <img
              src='/assets/images/quotation-mark.svg'
              alt='quotation mark icon'
              className='w-6 rotate-360 transform scale-x-[-1] '
            />
          </div>
          <p className='text-font-22  text-center font-bold text-purple-600  relative'>
            I love listening to the podcasts. They help me understand things
            better.
          </p>

          <div className='flex flex-col items-center justify-center '>
            <div className='w-12 h-12 rounded-full border border-purple-800 overflow-hidden'>
              <img
                src='/assets/images/tom.jpg'
                alt=''
                className='w-full h-full object-cover'
              />
            </div>{" "}
            <p className='text-font-16 font-bold text-purple-800'>
              {" "}
              Alex, 12 years old
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
