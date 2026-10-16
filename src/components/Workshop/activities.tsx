// Same halftone paper as the plans page; remove `style` if this sits inside it
const halftone = {
  backgroundColor: "#fff3b0",
  backgroundImage: "radial-gradient(#f2c200 1.6px, transparent 1.7px)",
  backgroundSize: "16px 16px",
};

const activities = [
  {
    title: "Painting Session for Kids",
    image: "/assets/workshopv2/panting-session.png",
    caption: "#ffd93d",
    tilt: "-rotate-2",
  },
  {
    title: "Mindfulness Session for Age 6-12",
    image: "/assets/workshopv2/mindfullness.png",
    caption: "#2ea7ff",
    tilt: "rotate-1",
  },
  {
    title: "Social Media Detox Workshop",
    image: "/assets/workshopv2/social-media-detox.png",
    caption: "#2ed47a",
    tilt: "rotate-2",
  },
];

const WorkshopActivities = () => {
  return (
    <div
      className="w-full px-4 md:px-10 lg:px-20 py-10 md:py-16"
      style={halftone}
    >
      <h2
        className="font-comic-chip text-4xl md:text-6xl text-center text-[#ff4b3e] tracking-wide -rotate-1 pt-4 pb-12 md:pb-20"
        style={{
          WebkitTextStroke: "3px #000",
          paintOrder: "stroke fill",
          textShadow: "5px 5px 0 #000",
        }}
      >
        What We Do In Our Workshops
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 pb-6">
        {activities.map((item, index) => (
          <div
            key={index}
            className={`flex flex-col bg-white border-4 border-black shadow-[8px_8px_0_#000] transition-transform duration-200 hover:rotate-0 hover:-translate-y-1 ${item.tilt}`}
          >
            {/* Image panel */}
            <div className="p-2">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-auto border-2 border-black"
              />
            </div>

            {/* Narration caption box */}
            <div
              className="border-t-4 border-black px-4 py-3 text-center mt-auto"
              style={{ backgroundColor: item.caption }}
            >
              <h3 className="font-comic text-2xl md:text-3xl tracking-wider text-black leading-tight">
                {item.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkshopActivities;
