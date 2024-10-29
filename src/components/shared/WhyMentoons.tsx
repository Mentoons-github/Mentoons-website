import { motion } from "framer-motion";
const WhyMentoons = () => {
  return (
    <section className='relative bg-[#dbdbdb] '>
      <div className='w-full rounded-t-full   h-[900px] flex flex-col items-center justify-start relative  lg:h-[700px] bg-white'>
        {/* <h2 className='text-4xl text-dark-gray rubik-bubbles-regular pb-8 text-center pt-2 '></h2> */}

        <div className='absolute w-full flex flex-col  items-center   '>
          <div className=' w-full max-w-[640px] relative  p-6 pt-44 '>
            <p className='absolute w-[80%] left-1/2 -translate-x-1/2 top-20 text-4xl font-bold text-center lg:text-5xl lg:top-[120%]'>
              Why Our Podcast Matters?
            </p>
            <div className='max-w-[800px] lg:absolute lg:-bottom-[140%] mb-4'>
              <p className='w-full text-sm md:text-lg text-black font-bold text-center mx-auto md:w-[85%] lg:w-[95%] '>
                Our content goes beyond entertainment. We create safe spaces for
                learning, growing, and understanding. Whether you're a child
                exploring new ideas, a teenager facing changes, or a parent
                seeking ways to connect, we have something for you.
              </p>
            </div>
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className=' p-4 px-8 rounded-3xl bg-amber-200 shadow-2xl mb-6 lg:absolute lg:top-12 lg:-left-[30%]  '
            >
              <div className='w-full flex items-start justify-start'>
                <img
                  src='/assets/images/quotation-mark.svg'
                  alt='quotation mark icon'
                  className='w-6'
                />
              </div>
              <p className='text-font-22 font-bold text-amber-600 pl-8 pr-8 text-center'>
                Expert-Crafted Content
              </p>
              <div className=' flex items-end justify-end'>
                <img
                  src='/assets/images/quotation-mark.svg'
                  alt='quotation mark icon'
                  className='w-6 rotate-360 transform scale-x-[-1]'
                />
              </div>
            </motion.div>
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className='   p-4  px-8   rounded-3xl bg-rose-200 shadow-2xl mb-6 lg:absolute lg:top-16 lg:-right-[30%]'
            >
              <div className=' w-full flex items-start justify-start'>
                <img
                  src='/assets/images/quotation-mark.svg'
                  alt='quotation mark icon'
                  className='w-6'
                />
              </div>
              <p className='text-font-22 font-bold text-rose-400 pl-8 pr-8 text-center '>
                Age Appropriate Disscussion
              </p>
              <div className=' flex items-end justify-end'>
                <img
                  src='/assets/images/quotation-mark.svg'
                  alt='quotation mark icon'
                  className='w-6 rotate-360 transform scale-x-[-1]'
                />
              </div>
            </motion.div>
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className=' p-4  px-8 rounded-3xl bg-purple-200 shadow-2xl mb-6 lg:absolute lg:-bottom-[220%]  lg:-left-[25%]'
            >
              <div className=' w-full flex items-start justify-start'>
                <img
                  src='/assets/images/quotation-mark.svg'
                  alt='quotation mark icon'
                  className='w-6'
                />
              </div>
              <p className='text-font-22 font-bold text-purple-600  text-center '>
                Engaging Storytelling
              </p>
              <div className=' flex items-end justify-end'>
                <img
                  src='/assets/images/quotation-mark.svg'
                  alt='quotation mark icon'
                  className='w-6 rotate-360 transform scale-x-[-1]'
                />
              </div>
            </motion.div>
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className='   p-4  px-8  rounded-3xl bg-lime-200 shadow-2xl mb-6 lg:absolute lg:-bottom-[210%]  lg:-right-[20%]'
            >
              <div className=' w-full flex items-start justify-start'>
                <img
                  src='/assets/images/quotation-mark.svg'
                  alt='quotation mark icon'
                  className='w-6'
                />
              </div>
              <p className='text-font-22  text-center font-bold text-lime-600 '>
                Valuable life lesson
              </p>
              <div className=' flex items-end justify-end'>
                <img
                  src='/assets/images/quotation-mark.svg'
                  alt='quotation mark icon'
                  className='w-6 rotate-360 transform scale-x-[-1]'
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <div className='h-full absolute top-0 w-full flex justify-between  p-4 '>
        <div className='h-full'>
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: [0, -40, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className='w-16 h-full  md:w-32 self-start  ml-12'
          >
            <img
              src='/assets/images/podcast-bubble.png'
              alt='Podcast bubble'
              className='w-full object-cover '
            />
          </motion.div>

          <motion.div
            initial={{ y: 0 }}
            animate={{ y: [0, -80, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className='w-24 md:w-40 self-end  ml-12'
          >
            <img
              src='/assets/images/radio.png'
              alt=''
              className='w-full object-cover '
            />
          </motion.div>
        </div>
        {/* <div className='w-16 absolute top-60'>
          <img
            src='/assets/images/shines.png'
            alt=''
            className='w-full object-cover border border-black'
          />
        </div> */}
        {/* <motion.div
          initial={{ y: 0 }}
          animate={{ y: [0, -40, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className='w-16 self-end border border-black'
        >
          <img
            src='/assets/images/headphones.png'
            alt=''
            className='w-full object-cover '
          />
        </motion.div> */}
        {/* <motion.div
          initial={{ y: 0 }}
          animate={{ y: [0, -40, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className='w-16 self-baseline absolute left-36  '
        >
          <img
            src='/assets/images/on-air.png'
            alt=''
            className='w-full object-cover '
          />
        </motion.div> */}
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: [0, -40, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className='w-20 self-center '
        >
          <img
            src='/assets/images/small-mic.png'
            alt=''
            className='w-full object-cover rotate-12 '
          />
        </motion.div>
        <div>
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: [0, -40, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className=' h-[500px] self-start  '
          >
            <img
              src='/assets/images/music-note-black-2.png'
              alt=''
              className='w-full object-cover '
            />
          </motion.div>

          <motion.div
            initial={{ y: 0 }}
            animate={{ y: [0, -40, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className='w-24   '
          >
            <img
              src='/assets/images/specs.png'
              alt=''
              className='w-full object-cover '
            />
          </motion.div>
        </div>

        <motion.div
          initial={{ y: 0 }}
          animate={{ y: [0, -40, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className='w-16 md:w-40 self-start pt-20'
        >
          <img
            src='/assets/images/music-cloud.png'
            alt=''
            className='w-full object-cover '
          />
        </motion.div>
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: [0, -40, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className='w-24 self-center mr-12  '
        >
          <img
            src='/assets/images/paper-plan.png'
            alt=''
            className='w-full object-cover '
          />
        </motion.div>
        {/* <div className='w-16 self-center'>
          <img
            src='/assets/images/music-note-black-1.png'
            alt=''
            className='w-full object-cover border border-black'
          />
        </div> */}
        {/* <motion.div
          initial={{ y: 0 }}
          animate={{ y: [0, -40, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className='w-16 self-end pb-48 border border-black'
        >
          <img
            src='/assets/images/play.png'
            alt=''
            className='w-full object-cover '
          />
        </motion.div>{" "} */}
        {/* <motion.div
          initial={{ y: 0 }}
          animate={{ y: [0, -40, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className='w-16 self-start'
        >
          <img
            src='/assets/images/pause.png'
            alt=''
            className='w-full object-cover '
          />
        </motion.div> */}
      </div>
    </section>
  );
};

export default WhyMentoons;
