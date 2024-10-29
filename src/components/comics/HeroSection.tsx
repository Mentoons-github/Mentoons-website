import { useNavigate } from "react-router-dom";
import Wordbreak from "./Wordbreak";
import React, {useState } from "react";
import { MdClose } from "react-icons/md";
import { motion } from "framer-motion";
import { useAuthHook } from "@/hooks/useAuth";
import { toast } from "sonner";
import { comicsData } from "@/constant/comicsConstants";
import { Comic } from "@/redux/comicSlice";

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthHook();
  // const [email, setEmail] = useState<string>();
  const [currComic, setCurrComic] = useState<Comic | null>();

  const selectedComic = (name: string) => {
    const data = comicsData.find((item) => {
      return item.name === name;
    });
    setCurrComic(data);
  };

  const handleSendComic = async () => {
    // if (!email?.trim()) {
    //   toast("❌ please enter your email!");
    //   setCurrComic(null);
    // }
    try {
      if (isLoggedIn) {
        window.open(currComic?.comicLink, '_blank');
      } else {
        navigate("/sign-up");
      }
    } catch (err) {
      console.error(err);
      toast("An error occurred. Please try again.");
    } finally {
      setCurrComic(null);
    }
  };
  const handlePrint = async () => {
    if (!currComic?.comicLink) {
      toast.error('Comic link is not available');
      return;
    }

    try {
      const response = await fetch(currComic.comicLink);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const newWindow = window.open(blobUrl, '_blank');

      if (!newWindow) {
        toast.error('Please allow pop-ups to print the comic.');
        return;
      }

      newWindow.onload = () => {
        newWindow.print();
      };

      window.addEventListener('beforeunload', () => {
        URL.revokeObjectURL(blobUrl);
      });

    } catch (error) {
      console.error('Error downloading or printing the PDF:', error);
      toast.error('Failed to download or print the comic. Please try again later.');
    }
  };
  

  return (
    <div className="relative w-full text-[#864747] h-[150vh] md:h-[250vh] bg-comicsHome bg-no-repeat bg-cover bg-bottom bg-[#59B2DC]">
      <div className="relative md:px-14 text-center md:text-start py-44 md:py-20 space-y-4">
        <h1
          className="font-extrabold text-4xl lg:text-8xl"
          style={{
            WebkitTextStroke: "3px black",
            color: "transparent",
            textShadow: "4px 4px 4px #FBD33D",
          }}
        >
          Mentoons <Wordbreak /> Comics
        </h1>
        <p className="text-[#592828] text-3xl md:text-4xl font-semibold tracking-wider md:leading-snug">
          Welcome to a world of <Wordbreak /> meaningful stories and valuable{" "}
          <Wordbreak />
          life lessons.
        </p>
        {/*share image  */}
        <img
          className="w-32 relative left-4 lg:left-16"
          src="/assets/comics/4.png"
        />
        {/* message image */}
        <img
          className="w-52 absolute top-[-2rem] left-[43%] md:left-[40%] lg:top-0 lg:left-[43%] transform scale-x-[-1]"
          src="/assets/comics/1.png"
        />
        <>
          {/* large screen comics */}
          {/* Don't fade away comic */}
          <div onClick={() => selectedComic("Don't Fade Away")}>
            <img
              className="w-[4rem] md:w-24 lg:w-32 border-[3px] shadow-md shadow-black rounded-md border-black absolute top-[60%] right-[15%] lg:top-8 lg:left-[65%] -rotate-[25deg] cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"
              src="https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-04.jpg"
            />
          </div>
          {/* black jalebi image */}
          <img
            className="w-32 absolute top-[1rem] right-[60%] md:right-20 lg:top-0 lg:right-40"
            src="/assets/comics/3.png"
          />
          {/* one way trip comic */}
          <div onClick={() => selectedComic("One Way Trip")}>
            <img
              className=" w-[4rem] md:w-24 lg:w-32 border-[3px] shadow-md shadow-black rounded-md border-black absolute top-[55%] right-[42%] md:top-[52%] md:right-[43%] lg:top-[28%] lg:right-[10%] rotate-[40deg] lg:rotate-[25deg] cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"
              src="https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-22.jpg"
            />
          </div>
          {/* power image */}
          <img
            className="w-20 md:w-28 lg:w-36 absolute top-[90%] md:top-[130%] left-[5%] lg:top-[33%] lg:left-[67%]"
            src="/assets/comics/2.png"
          />
          {/* bet your life comic */}
          <div onClick={() => selectedComic("Bet Your Life")}>
            <img
              className="w-16 md:w-24 lg:w-32 border-[3px] z-50 shadow-md shadow-black rounded-md border-black absolute left-[10%] bottom-[10%] md:-bottom-[20%] lg:left-[56%] lg:bottom-[30%] rotate-[25deg] cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"
              src="https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-09.jpg"
            />
          </div>
          {/* come out of gaming comic */}
          <div onClick={() => selectedComic("Come out of Gaming")}>
            <img
              className="w-16 md:w-24 lg:w-32 border-[3px] z-50 shadow-md shadow-black rounded-md border-black absolute right-10 bottom-0 md:right-24 md:-bottom-36 lg:right-20 lg:bottom-8 md:rotate-[20deg] lg:-rotate-[35deg] cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"
              src="https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-05.jpg"
            />
          </div>
          {/* cell life of soniya comic */}
          <div onClick={() => selectedComic("The Cell Life of Soniya")}>
            <img
              className="w-16 md:w-24 lg:w-32 border-[3px] z-50 shadow-md shadow-black rounded-md border-black absolute left-6 -bottom-[30%] md:left-16 md:-bottom-[100%] lg:left-[40%] lg:bottom-12 -rotate-[35deg] cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"
              src="https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-12.jpg"
            />
          </div>
          {/* tanya's downfall comic */}
          <div onClick={() => selectedComic("Tanya's Downfall")}>
            <img
              className="w-16 md:w-24 lg:w-32 border-[3px] z-50 shadow-md shadow-black rounded-md border-black absolute left-[10%] -bottom-[60%] md:-bottom-[140%] lg:left-[20%] lg:bottom-0 rotate-[35deg] cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"
              src="https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-06.jpg"
            />
          </div>
          {/* live and let live comic */}
          <div onClick={() => selectedComic("Live and Let Live")}>
            <img
              className="w-20 md:w-32 lg:w-[10.5rem] border-[3px] z-50 shadow-md shadow-black rounded-md border-black absolute left-[35%] -bottom-[80%] md:-bottom-[170%] lg:left-[10%] lg:-bottom-[30%] -rotate-[35deg] cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"
              src="https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-21.jpg"
            />
          </div>
          {/* i can manage comic */}
          <div onClick={() => selectedComic("I can Manage (Time Management)")}>
            <img
              className="w-[4.5rem] md:w-24 lg:w-32 block md:hidden lg:block border-[3px] z-50 shadow-md shadow-black rounded-md border-black absolute left-[40%] -bottom-[60%] lg:left-[17%] lg:-bottom-[65%] -rotate-[20deg] cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"
              src="https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-02.jpg"
            />
          </div>
          {/* choose wisely comic */}
          <div onClick={() => selectedComic("Choose Wisely")}>
            <img
              className="w-16 md:w-24 lg:w-32 border-[3px] z-50 shadow-md shadow-black rounded-md border-black absolute right-[8%] -bottom-[30%] md:-bottom-[65%] lg:right-[14%] lg:-bottom-[30%] -rotate-[30deg] lg:rotate-[20deg] cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"
              src="https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-08.jpg"
            />
          </div>
          {/* rohan and puppies comic */}
          <div onClick={() => selectedComic("Rohan and the Puppies")}>
            <img
              className="w-16 md:w-24 lg:w-32 border-[3px] z-50 shadow-md shadow-black rounded-md border-black absolute right-[10%] -bottom-[55%] md:-bottom-[110%] lg:right-[25%] lg:-bottom-[70%] rotate-[40deg] cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"
              src="https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-17.jpg"
            />
          </div>
          {/* rishi and rohit comic */}
          <div onClick={() => selectedComic("Rishi and Rohit")}>
            <img
              className="hidden md:block w-16 md:w-24 lg:w-32 border-[3px] z-50 shadow-md shadow-black rounded-md border-black absolute right-[12%] -bottom-[150%] lg:right-[8%] lg:-bottom-[62%] -rotate-[40deg] cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"
              src="https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-16.jpg"
            />
          </div>
          {/* my daily routine comic */}
          <div onClick={() => selectedComic("My Daily Routine")}>
            <img
              className="hidden xl:block w-32 border-[3px] z-50 shadow-md shadow-black rounded-md border-black absolute left-[8%] -bottom-[95%] -rotate-[60deg] cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"
              src="https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-01.jpg"
            />
          </div>
          {/* stories on divorce comic */}
          <div onClick={() => selectedComic("Comic on Divorce")}>
            <img
              className="hidden xl:block w-40 border-[3px] z-50 shadow-md shadow-black rounded-md border-black absolute left-[18%] -bottom-[130%] -rotate-[60deg] cursor-pointer hover:scale-105 active:scale-100 transition-all duration-300 ease-in-out"
              src="https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-07.jpg"
            />
          </div>
          {/* say sorry comic */}
          <div onClick={() => selectedComic("Say Sorry")}>
            <img
              className="hidden xl:block w-40 border-[3px] z-50 shadow-md shadow-black rounded-md border-black absolute left-[10%] md:left-[20%] xl:left-[38%] -bottom-[160%] md:-bottom-[140%] xl:-bottom-[130%] -rotate-[60deg] cursor-pointer hover:scale-105 active:scale-100 transition-all duration-300 ease-in-out"
              src="https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-10.jpg"
            />
          </div>
          {/* teenagers job 2 comic */}
          <div
            onClick={() =>
              selectedComic("How Teenagers Lose Their Jobs Part-2")
            }
          >
            <img
              className=" hidden xl:block w-32 border-[3px] z-50 shadow-md shadow-black rounded-md border-black absolute left-[75%] md:left-[58%] -bottom-[50%] md:-bottom-[110%] -rotate-[10deg] md:-rotate-[60deg] cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"
              src="https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-24.jpg"
            />
          </div>
          {/* Hungry for likes not likes comic */}
          <div onClick={() => selectedComic("Hungry for Likes Not Life")}>
            <img
              className="hidden xl:block w-32 border-[3px] z-50 shadow-md shadow-black rounded-md border-black absolute left-[30%] md:left-[58%] -bottom-[230%] md:-bottom-[180%] xl:-bottom-[160%] -rotate-[60deg] cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"
              src="https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-15.jpg"
            />
          </div>
          {/* Think before you act comic */}
          <div onClick={() => selectedComic("Think Before You Act")}>
            <img
              className="hidden xl:block w-40 border-[3px] z-50 shadow-md shadow-black rounded-md border-black absolute left-[30%] md:left-[70%] lg:left-[80%] -bottom-[110%] md:-bottom-[110%] -rotate-[60deg] cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"
              src="https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/Think_Before_You_Act!.png"
            />
          </div>
          {/* flower image */}
          <img
            className="w-24 md:w-40 z-50 rounded-md absolute left-[65%] -bottom-[80%] md:left-[60%] md:-bottom-[180%] lg:left-[78%] lg:-bottom-[155%] -rotate-[60deg]"
            src="/assets/images/flowerComics.png"
          />
        </>
      </div>
      {/* clement toonla image */}
      <div className="flex w-full h-full items-center justify-center">
        <img
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-0 md:-translate-y-[20%] lg:-translate-y-1/2 rotate-[90deg] lg:-rotate-[60deg] xl:-rotate-45 w-[30rem] h-[15rem] md:w-[60rem] md:h-[24rem] lg:w-[70rem] lg:h-[35rem]"
          src="/klement_toonla.png"
          alt="klement toonla image"
        />
      </div>
      {/* popup modal */}
      {currComic && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="fixed bg-black/50 z-[99999] top-0 w-screen h-screen"
        >
          <div className="bg-rose-50 flex flex-col md:flex-row items-center justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[20rem] md:w-[40rem] lg:w-[50rem] h-fit md:h-[25rem] lg:h-[30rem] rounded-md py-6 md:py-0 space-y-4">
            <div
              onClick={() => setCurrComic(null)}
              className="absolute cursor-pointer top-6 right-4"
            >
              <MdClose className="text-2xl" />
            </div>
            <div className="w-full md:w-[45%] flex items-center justify-center">
              <img
                className="w-[60%] rounded-lg shadow-2xl shadow-rose-400 "
                src={currComic?.mini_thumbnail}
                alt="comic image"
              />
            </div>
            <div className="w-full text-center md:w-[65%] space-y-8 md:space-y-10">
              <h1 className="text-4xl md:text-6xl font-extrabold text-center">
                {currComic.name}
              </h1>
              {/* <div className="space-y-2">
                <label className="text-rose-400">
                  Enter Email to Claim your free comic
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-4 py-2 rounded-md outline-none w-2/3"
                  placeholder="Your Email"
                />
              </div> */}
              <div className="flex flex-col items-center justify-center gap-4 lg:flex-row">
                <span
                  onClick={handleSendComic}
                  className="bg-rose-400 mr-3 uppercase text-lg font-medium hover:bg-white hover:text-rose-400 transition-all duration-300 ease-in-out text-white py-3 px-7 rounded-full cursor-pointer"
                >
                  Read Now!
                </span>
                <span
                  onClick={handlePrint}
                  className="bg-rose-400 uppercase text-lg font-medium hover:bg-white hover:text-rose-400 transition-all duration-300 ease-in-out text-white py-3 px-7 rounded-full cursor-pointer"
                >
                  Print Now!
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default HeroSection;
