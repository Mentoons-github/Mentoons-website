import "./challenges.css";

const WorkShopChallenges = () => {
  return (
    <div className="relative flex-col items-center justify-center pb-24 bg-orange-400">
      <div className="custom-shape-divider-top-1756205374">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="shape-fill"
          ></path>
        </svg>
      </div>
      <div className="absolute top-0 left-4 md:left-8">
        <img
          src="/assets/workshopv2/workshop-yellow-pattern.png"
          alt="challenges"
          className="w-16 h-16 md:w-24 md:h-24"
        />
      </div>
      <div className="absolute top-0 right-4 md:right-8">
        <img
          src="/assets/workshopv2/workshop-green-pattern.png"
          alt="challenges"
          className="w-16 h-16 md:w-24 md:h-24"
        />
      </div>
      <div className="absolute bottom-0 left-4 md:left-8">
        <img
          src="/assets/workshopv2/workshop-red-pattern.png"
          alt="challenges"
          className="w-16 h-16 md:w-24 md:h-24"
        />
      </div>
      <div className="absolute bottom-0 right-4 md:right-8">
        <img
          src="/assets/workshopv2/workshop-blue-pattern.png"
          alt="challenges"
          className="w-16 h-16 md:w-24 md:h-24"
        />
      </div>
      <div className="w-full">
        <h2 className="pt-6 pb-12 md:pb-24 text-3xl md:text-5xl font-black bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4 text-center">
          Challenges Faced By Kids Today!
        </h2>

        <div className="flex flex-col flex-wrap items-center justify-around gap-8 px-4 md:flex-row md:gap-4 md:px-12">
          {[
            {
              title: "Mobile Addiction",
              description:
                "Kids are spending too much time on social media platforms like Instagram, TikTok, and Snapchat.",
              image: "/assets/workshopv2/workshop-mobile-addiction.png",
            },
            {
              title: "Gaming Addiction",
              description:
                "Kids are spending too much time on social media platforms like Instagram, TikTok, and Snapchat.",
              image: "/assets/workshopv2/workshop-gaming-addiction.png",
            },
            {
              title: "Social Media Addiction",
              description:
                "Kids are spending too much time on social media platforms like Instagram, TikTok, and Snapchat.",
              image: "/assets/workshopv2/workshop-social-media-addiction.png",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center w-full gap-4 md:w-auto"
            >
              <div className="w-48 h-48 md:w-64 md:h-64">
                <img
                  src={item.image}
                  alt={item.title}
                  className="object-contain w-full h-full"
                />
              </div>
              <h3 className="text-xl font-semibold text-center ">
                {item.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
      <div className="custom-shape-divider-bottom-1756205904">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="shape-fill"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default WorkShopChallenges;
