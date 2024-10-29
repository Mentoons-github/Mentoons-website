import { AGE_CATEGORY } from "../../../constant";
const AgeCategory = () => {
  return (
    <section className='flex  items-center justify-between gap-4 px-4 md:px-12 pb-6 flex-wrap  lg:flex-nowrap '>
      {AGE_CATEGORY.map((age) => {
        return (
          <div
            className='flex items-start  border  rounded-xl hover:bg-slate-200 transition-all duration-300'
            key={age.id}
          >
            <div className='w-40 overflow-hidden  rounded-lg px-2 py-2   '>
              <img
                src={age.ageCategoryBannerImgSrc}
                alt={`Age Category ${age.maxAge}-${age.minAge}year`}
                className='w-full object-cover rounded-lg '
              />
            </div>
            <div className='text-sm  py-2'>
              {age.description} (Ages {age.minAge}
              {age.minAge === 20 ? age.maxAge : `-${age.maxAge}`})
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default AgeCategory;
