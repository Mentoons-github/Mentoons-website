import { CATEGORIES } from "../../../constant";
const Category = () => {
  return (
    <section className=' p-4 md:py-6 md:px-12'>
      <div className='grid grid-cols-3 gap-2 md:grid-cols-6 md:justify-between md:gap-4 '>
        {CATEGORIES.map((category) => {
          return (
            <div
              key={category}
              className='border text-sm md:text-base  lg:text-md p-1 rounded-md font-semibold text-neutral-600 text-center whitespace-nowrap  hover:bg-slate-200 transition-all duration-300'
            >
              {category}
            </div>
          );
        })}

        {/* Age Filter Components */}
        {/* <div className='border text-sm md:text-base  lg:text-md p-1 rounded-md font-semibold text-neutral-600 text-center whitespace-nowrap  hover:bg-slate-200'>
          Filter by Age
        </div> */}
      </div>
    </section>
  );
};

export default Category;
