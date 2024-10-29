import { PODCAST_DETAILS } from "@/constant";

const CategoryCard = () => {
  return (
    <section className='w-full  grid md:grid-cols-2 gap-12 p-12'>
      {PODCAST_DETAILS.map((catetory) => {
        return (
          <div key={catetory.id} className='relative h-96 bg-black '>
            <div className='bg-[#f0ebe5] absolute top-0 transition-all duration-300 w-full h-full  hover:-translate-y-3 group hover:-translate-x-3 flex flex-col items-start justify-end  '>
              <div className='relative flex flex-col '>
                <span className='text-5xl px-4 py-3 text-orange-200 font-bold  '>
                  {catetory.topic}
                </span>
                <span className=' absolute top-0 text-5xl font-bold px-4 py-3 group-hover:-translate-y-1 group-hover:-translate-x-1 transition-all duration-300 text-orange-600'>
                  {catetory.topic}
                </span>
              </div>
              <p className='px-4 pb-4'>{catetory.description}</p>
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default CategoryCard;
