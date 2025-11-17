const WorkshopActivities = () => {
  return (
    <div className="bg-gradient-to-b from-white to-[#FFDA9A] w-full pb-10">
      <h2 className="pt-6 pb-12 md:pb-24 text-3xl md:text-5xl font-black bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4 text-center">
        What We Do In Our Workshops
      </h2>
      <div className="flex flex-wrap justify-around gap-4 pb-10">
        {[
          {
            title: "Painting Session for Kids",
            image: "/assets/workshopv2/panting-session.png",
          },
          {
            title: "Mindfulness Session for Age 6-12",
            image: "/assets/workshopv2/mindfullness.png",
          },
          {
            title: "Social Media Detox Workshop",
            image: "/assets/workshopv2/social-media-detox.png",
          },
        ].map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center gap-4"
          >
            <img src={item.image} alt={item.title} />
            <h3 className="text-xl font-semibold">{item.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkshopActivities;
