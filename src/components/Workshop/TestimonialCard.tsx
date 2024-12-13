interface TestimonialProps {
    testimonial: {
      title: string;
      img: string;
      message: string;
    };
  }
  
  const TestimonialCard = ({ testimonial }: TestimonialProps) => {
      return (
          <div className="flex flex-col items-center justify-center w-[20rem] h-[25rem] relative bg-white rounded-lg shadow-md">
              <img src={testimonial.img} alt={testimonial.title} className="absolute -top-10 -left-10" />
              <div className="flex flex-col items-center justify-center w-full h-full p-4">
                  <p>{testimonial.title}</p>
                  <figure>
                    <img src="/assets/camps/rating.png" alt="rating" />
                  </figure>
              </div>
              <div className="bg-[#51C66A] w-full h-full p-5 rounded-b-lg">
                  {testimonial.message}
              </div>
          </div>
      )
  }
  
  export default TestimonialCard;
  