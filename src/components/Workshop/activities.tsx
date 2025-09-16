const WorkshopActivities = () => {
  return (
    <div className="bg-gradient-to-b from-white to-[#FFDA9A] w-full pb-10">
      <h2 className="pt-6 pb-12 text-3xl font-semibold text-center md:pb-24 md:text-4xl">
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
