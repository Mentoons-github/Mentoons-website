import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ContentSection = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    fade: true,
  };

  return (
    <section className="py-16 lg:h-screen bg-[url('/assets/home/yellow-bg.png')] bg-contain bg-top lg:bg-right bg-no-repeat">
      <div className="flex flex-col lg:flex-row gap-16 items-center px-4 mx-auto max-w-screen-xl lg:px-6">
        <div className="w-full lg:w-1/2 font-light text-gray-600 sm:text-lg dark:text-gray-400">
          <Slider {...settings}>
            <div>
              <h2 className="mb-4 text-3xl md:text-4xl lg:text-5xl tracking-tight font-extrabold text-gray-800 dark:text-white text-center">
                Are Gadgets Taking Over Your Child's Life?
              </h2>
            </div>
            <div>
              <h2 className="mb-4 text-3xl md:text-4xl lg:text-5xl tracking-tight font-extrabold text-gray-800 dark:text-white text-center">
                Is Your Screen Time Getting Out of Control?
              </h2>
            </div>
            <div>
              <h2 className="mb-4 text-3xl md:text-4xl lg:text-5xl tracking-tight font-extrabold text-gray-800 dark:text-white text-center">
                Are You Struggling to Cut Down on Mobile, Social Media, Gaming, and Gambling Addiction?
              </h2>
            </div>
          </Slider>
          <p className="mb-4 mt-6 text-lg md:text-xl lg:text-2xl text-red-500 text-center font-semibold">
            Made Fun and Effective
          </p>
          <p className="text-base md:text-lg lg:text-xl leading-relaxed text-gray-700 dark:text-gray-300 text-center">
            Give your child the gift of growth with <b>mentoons</b> a versatile platform that combines enriching mentorship with the captivating power of cartoons.
          </p>
          <div className="flex flex-col items-center justify-around gap-6 mt-12 lg:mt-8">
            <h1 className="text-3xl md:text-3xl lg:text-5xl text-center font-bold text-gray-800 dark:text-white">
              Get Engaging <span className="animate-pulse text-primary">mentoring</span> for your child!
            </h1>
            <button className="px-6 md:px-8 py-2 md:py-3 bg-primary text-white font-semibold rounded-lg shadow-lg hover:bg-yellow-600 transition-all duration-300">
              Get Started Now
            </button>
          </div>
        </div>
        <div className="lg:w-1/2 grid grid-cols-2 gap-6 mt-8 lg:mt-0">
          <img
            className="w-full rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105"
            src="/assets/home/char1.png"
            alt="office content 1"
          />
          <img
            className="mt-4 lg:mt-8 w-full rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105"
            src="/assets/home/char2.png"
            alt="office content 2"
          />
        </div>
      </div>
    </section>
  );
};

export default ContentSection;
