const workshops = [
  {
    name: "KalaKriti",
    tag: "Art Therapy",
    meta: "Age 6-12   Age 13-19",
    description:
      "Unleash your creativity and learn the power of using art as an effective tool to boost focus and productivity.",
    image: "/assets/workshopv2/new/kalakrithi.png",
  },
  {
    name: "Intant Katha",
    tag: "Story Telling Therapy",
    meta: "Age 6-12   Age 13-19",
    description:
      "Engaging, educational storytelling experiences designed to inspire imagination and nurture young minds.",
    image: "/assets/workshopv2/new/instant katha-05.png",
  },
  {
    name: "Hasyras",
    tag: "Laughter Therapy",
    meta: "Age 6-12   Age 13-19",
    description:
      "A fun, energizing morning routine combining laughter, play and mindfulness to build a positive mindset.",
    image: "/assets/workshopv2/new/hasyaras-04.png",
  },
  {
    name: "Swar",
    tag: "Music Therapy",
    meta: "Age 6-12   Age 13-19",
    description:
      "Explore sound and rhythm through games, group activities and guided musical expression.",
    image: "/assets/workshopv2/new/Swar2.png",
  },
];

const KnowOurWorkshops = () => {
  return (
    <div className="py-20 px-20">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-semibold">Workshops At Mentoons</h1>
        <p className="text-lg text-neutral-700 mt-2">
          Fun and Creative Workshops for Kids
        </p>
        <p className="text-sm text-neutral-500 leading-relaxed mt-4">
          These are specially designed workshops aimed at social media
          de-addiction, cell-phone de-addiction, and gaming de-addiction by
          improving productivity and overall quality of life. Our team of
          Psychology Graduates, Certified Career Experts, and Human Resources
          Experts, all trained in child psychology, work together to provide a
          safe and supportive environment for our participants.
        </p>
      </div>

      <div className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">
        {workshops.map((w, i) => (
          <div
            key={i}
            className="w-full flex flex-col gap-3 border border-neutral-200 rounded-lg overflow-hidden"
          >
            {/* Thumbnail */}
            <div className="w-full h-40 bg-neutral-200">
              <img
                src={w.image}
                alt={w.name}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Card Content */}
            <div className="flex flex-col gap-3 p-4">
              <div>
                <p className="text-base font-semibold text-neutral-800">
                  {w.name}
                </p>
                <p className="text-sm text-neutral-500">{w.tag}</p>
              </div>

              <p className="text-sm text-neutral-500 leading-relaxed">
                {w.meta}
              </p>

              <p className="text-sm text-neutral-600 leading-relaxed">
                {w.description}
              </p>

              <button className="w-full border border-orange-500 bg-orange-500 text-white font-semibold rounded-md px-3 py-2 text-sm hover:bg-orange-600 hover:border-orange-600 transition">
                Join Workshop
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KnowOurWorkshops;
