import { motion } from 'framer-motion';

const HiringHeroSection = () => {
  return (
    <div className="min-h-fit lg:h-screen bg-[url('/assets/Career/background.png')] bg-contain lg:bg-cover lg:bg-center bg-no-repeat">
      <div className="flex h-full flex-col-reverse lg:flex-row">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="p-14 lg:h-full lg:w-1/2 flex items-center justify-center "
        >
            <div className="relative w-[40rem] group">
              <div className="absolute inset-0 bg-[url('/assets/Career/video-bg.jpg')] bg-cover bg-center rounded-2xl transform -rotate-3 opacity-20"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 to-purple-500/20 rounded-2xl"></div>
              <div className="absolute -top-6 -left-6 w-20 h-20 border-4 border-orange-400 rounded-full opacity-50"></div>
              <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-purple-500 rounded-lg opacity-30"></div>
              <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl transform transition-transform duration-300 group-hover:scale-[1.02]">
                <video 
                  src={`${import.meta.env.VITE_STATIC_URL}static/Mentoons Team Video_03.mp4`}
                  autoPlay 
                  loop 
                  muted 
                  className="w-full h-full object-cover" 
                />
              </div>
            </div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:h-full lg:w-1/2 flex items-center justify-center"
        >
            <div className="relative p-10 lg:p-0 flex flex-col gap-10 lg:gap-40 items-center justify-center mt-8 lg:mt-0">
               <motion.div 
                 initial={{ scale: 0.8 }}
                 animate={{ scale: 1 }}
                 transition={{ duration: 0.5, delay: 0.5 }}
                 className="relative"
               >
               <h1 className="text-4xl lg:text-[8rem] font-bold relative z-10">
                    Join Our
                </h1>
                <h1 className="text-6xl lg:text-[12rem] text-[#D47100] font-bold absolute top-6 -left-8 lg:left-[-6rem] z-20 drop-shadow-lg">
                    Team
                </h1>
                <div className="absolute -right-12 -top-12 w-24 h-24 bg-dots-pattern opacity-20"></div>
                </motion.div>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="text-xl lg:text-4xl lg:mt-10 text-center relative"
                >
                    Be part of meaningful projects,<br/> that make a difference
                    <span className="absolute -z-10 inset-0 bg-gradient-to-r from-orange-200/20 to-purple-200/20 blur-xl"></span>
                </motion.p>
            </div>
        </motion.div>
      </div>
    </div>
  )
}

export default HiringHeroSection


