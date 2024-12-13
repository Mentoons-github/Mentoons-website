interface TestimonialProps {
    testimonial: {
      title: string;
      img: string;
      message: string;
    };
  }
  
  const TestimonialCard = ({ testimonial }: TestimonialProps) => {
    return (
      <div className="flex flex-col items-center w-full max-w-[350px] mx-auto relative bg-white rounded-xl shadow-lg transition-transform hover:scale-102 hover:shadow-xl">
        <img 
          src={testimonial.img} 
          alt={testimonial.title} 
          className="absolute -top-8 -left-8 w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-white shadow-md" 
        />
        
        <div className="flex flex-col items-center justify-center w-full p-6 pt-12 space-y-4">
          <h3 className="text-lg md:text-xl font-semibold text-gray-800">
            {testimonial.title}
          </h3>
          <figure className="w-24 md:w-28">
            <img 
              src="/assets/camps/rating.png" 
              alt="rating"
              className="w-full h-auto" 
            />
          </figure>
        </div>
  
        <div className="bg-[#51C66A] w-full p-5 md:p-6 rounded-b-xl text-white font-light leading-relaxed">
          <p className="text-sm md:text-base">
            {testimonial.message}
          </p>
        </div>
      </div>
    );
  }
  
  export default TestimonialCard;
  