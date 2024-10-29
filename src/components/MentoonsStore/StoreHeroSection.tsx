import ProductsContainer from "./ProductsContainer"
import { useRef } from 'react'

const StoreHeroSection = () => {
  const productsRef = useRef<HTMLDivElement>(null);

  const scrollToProducts = () => {
    if (productsRef.current) {
      const yOffset = -50; // Adjust this value to fine-tune the scroll position
      const element = productsRef.current;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div>
    <div className="bg-[linear-gradient(360deg,_#42A0CE_0%,_#034E73_100%)] min-h-screen">
      <div className="flex flex-col md:flex-row items-center justify-between p-4 md:p-10">
        <div className="flex flex-col items-center md:items-start space-y-6 md:space-y-10 w-full md:w-1/2 text-center md:text-left pl-0 lg:pl-16">
            <h1 className="text-white font-bold text-4xl sm:text-6xl md:text-[82px]">Mentoons Store</h1>
            <p className="text-white text-lg lg:leading-normal sm:text-xl md:text-[30px]">
              Everyday Adventures at the Comic<br/> Shop: Where real kids share epic stories,<br/> funny mishaps, and life lessons. Step into<br/> the story with us.
            </p>
            <button 
              onClick={scrollToProducts}
              className="bg-white text-black px-7 py-0 rounded-md shadow-[3px_3px_5.2px_0px_#1A6B94C9,_inset_-3px_-3px_3px_0px_#5099BE9C]" 
            >
                <div className="flex flex-row items-center justify-around">
                  <figure className="h-[61px] w-[66px]">
                    <img src="/assets/images/shopbag.png" alt="shopping icon" className="h-full w-full object-contain"/>
                  </figure>
                  <h3>Shop Now</h3>
                  </div>
            </button>
        </div>
        <div className="flex items-center justify-center w-full md:w-1/2 p-4 md:p-10">
            <img src="/assets/images/store-hero-image.png" alt="Mentoons Store" className="w-[80%] h-[60%] object-contain" />
        </div>
      </div>
    </div>
    <div className="bg-[linear-gradient(358.67deg,_#CCFF96_36.53%,_#419ECC_100.68%)] min-h-screen" ref={productsRef}>
      <div> 
        <ProductsContainer/>
      </div>
    </div>
    </div>
  )
}

export default StoreHeroSection
