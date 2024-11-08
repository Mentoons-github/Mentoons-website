import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getAllPodcast } from "@/redux/Podcastslice";
import { AppDispatch } from "@/redux/store";
import { useUser } from "@clerk/clerk-react";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import React, { useEffect } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PODCAST_DETAILS, PODCAST_SLIDER } from "../../../constant";
import PodcastCardExp from "./PodcastCardExp";

// import VoiceSampleUpload from "./VoiceUploadModal";

const PodcastSection = () => {
  const { isSignedIn } = useUser();
  const [currentlyPlaying, setCurrentlyPlaying] =
    React.useState<HTMLAudioElement | null>(null);
  const [showModal, setShowModal] = React.useState<boolean>(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/sign-in");
  };

   const dispatch = useDispatch<AppDispatch>();

  const getAllPodcastData = async () => {
    try {
      await dispatch(getAllPodcast());
      // toast.success("Podcast fetched successfully");
    } catch (error) {
      // toast.error(error.message);
      console.error("Failed to fetch open positions:", error);
    }
  };
  useEffect(() => {
    getAllPodcastData();
  }, []); 

  // const { podcasts, loading } = useSelector(
  //   (state: RootState) => state.podcast
  // );

  // if (loading) {
  //   return <Loader/>
  // }

  // console.log(podcasts)
  // console.log(loading)

  return (
    <>
      <section className="p-4 py-12  bg-[#dbdbdb]">
        <motion.div
          initial={{ opacity: 0.5 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="space-y-5 pb-8 text-center lg:text-start md:pl-8"
        >
          <motion.div
            initial={{ opacity: 0.5 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 2 }}
            className=" text-3xl text-orange-900 lineBefore uppercase"
          >
            Podcasts
          </motion.div>
          <motion.div
            initial={{ y: 50 }}
            whileInView={{ y: 0 }}
            transition={{ duration: 1.5 }}
            className="text-5xl lg:text-7xl  w-full font-bold leading-[1.10]"
          >
            Our Top Trendy Fun Podcasts
          </motion.div>
        </motion.div>

        <div className="">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8 ">
            {/* //todo use the podcast fetch form api */}
            {PODCAST_DETAILS.map((podcast) => (
              // <PodcastCard
              //   key={podcast.id}
              //   podcast={podcast}
              //   currentlyPlaying={currentlyPlaying}
              //   setCurrentlyPlaying={setCurrentlyPlaying}
              // />
              
              <PodcastCardExp
                key={podcast.id}
                isSignedIn={isSignedIn}
                podcast={podcast}
                showModal={showModal}
                setShowModal={setShowModal}
                currentlyPlaying={currentlyPlaying}
                setCurrentlyPlaying={setCurrentlyPlaying}
              />
            ))}
          </div>
          {/* <div className='md:border-l border-stone-400 pt-8 md:pt-0 '>
          <div className='flex gap-4 items-start justify-center   h-fit '>
            <h1 className='text-2xl font-bold'>Passionate</h1>
            <h1 className='text-2xl font-bold'>Podcast</h1>
            <h1 className='text-2xl font-bold'>Enthusiast!</h1>
          </div>
          <div className='w-[60%]  mx-auto  '>
            <CarouselPodcast />
          </div>
          <div className='border border-stone-400 text-center text-2xl font-bold p-4 m-4 hover:scale-105 transition duration-300'>
            <button>Share your podcast</button>
          </div>
          <div className=' text-center text-2xl font-bold p-4 ml-4'>
            <button>Hiring Voice Artist</button>
          </div>
          <div className='w-[60%]  mx-auto   '>
            <CarouselPodcast />
          </div>
          <div className='border  border-stone-400 text-center text-2xl font-bold p-4 m-4 hover:scale-105 transition duration-300'>
            <VoiceSampleUpload />
          </div>
        </div> */}
        </div>
      </section>
      {showModal && (
        <div
          className="fixed inset-0 z-[999] bg-black bg-opacity-50 flex items-center justify-center "
          onClick={() => setShowModal(false)}
        >
          <div className="bg-white p-8 rounded-lg relative sm:max-w-[425px]">
            <button
              className="absolute top-0 right-0 m-4 text-muted-foreground text-3xl  rounded "
              onClick={() => setShowModal(false)}
            >
              <IoCloseCircleOutline />
            </button>
            <div className="py-4 space-y-4">
              <p className=" text-2xl text-center text-muted-foreground font-bold">
                Thank you for showing interest in our podcast. To listen to the
                full podcast, please log in or create an account.
              </p>
              <p className="text-center text-md text-muted-foreground">
                Logging in gives you access to our complete library of audio
                content and exclusive features.
              </p>
            </div>
            <button
              className="bg-primary text-white px-4 py-2 rounded w-full hover:scale-105 transition-all duration-300"
              onClick={handleLogin}
            >
              Login
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PodcastSection;

export function CarouselPodcast() {
  const plugin = React.useRef(Autoplay({ delay: 2000 }));

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full  mx-auto   "
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {PODCAST_SLIDER.map((item, index) => (
          <CarouselItem key={index}>
            <div className="  w-full">
              <img
                src={`/assets/images/${item}`}
                alt=""
                className="w-full  object-contain"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
