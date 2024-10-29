import StatsCard from "./StatsCard";

//Props
// stats
const StatsSecion = () => {
  return (
    <section>
      <div className=' flex items-center justify-center  w-[50%] mx-auto py-8'>
        <img src='/assets/podcast-image.png' alt='Podcast Image' />
      </div>
      <div className=' w-[60%] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  gap-4'>
        {[0, 1, 2, 3].map((stat) => (
          <StatsCard key={stat} />
        ))}
      </div>
    </section>
  );
};

export default StatsSecion;
