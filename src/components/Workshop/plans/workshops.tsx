const WorkshopsCategories = () => {
  const workshops = [
    "/assets/workshopv2/new/hasyaras-04.png",
    "/assets/workshopv2/new/instant katha-05.png",
    "/assets/workshopv2/new/kalakrithi.png",
    "/assets/workshopv2/new/Swar2.png",
  ];
  const tilts = ["-rotate-2", "rotate-1", "rotate-2", "-rotate-1"];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
      {workshops.map((workshop, index) => (
        <div
          key={index}
          className={`bg-white border-4 border-black shadow-[6px_6px_0_#000] p-2 transition-transform duration-200 hover:rotate-0 hover:-translate-y-1 ${tilts[index % tilts.length]}`}
        >
          <img
            src={workshop}
            alt={`workshop-${index}`}
            className="w-full h-auto"
          />
        </div>
      ))}
    </div>
  );
};

export default WorkshopsCategories;
