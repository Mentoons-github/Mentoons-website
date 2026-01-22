const WorkshopsCategories = () => {
  const workshops = [
    "/assets/workshopv2/new/hasyaras-04.png",
    "/assets/workshopv2/new/instant katha-05.png",
    "/assets/workshopv2/new/kalakrithi.png",
    "/assets/workshopv2/new/Swar2.png"
  ];
  return (
    <div className="flex items-center justify-evenly">
      {workshops.map((workshop, index) => (
        <div key={index} className="w-1/5 h-1/2 p-2">
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
