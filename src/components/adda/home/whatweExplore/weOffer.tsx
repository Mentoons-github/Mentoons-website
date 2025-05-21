const WhatWeOffer = () => {
  const details = {
    Workshops:
      "Engaging sessions for all ages, including music and art therapy, storytelling, revival of ancient values.",
    "Comics & Audio Comics":
      "Engaging stories that inspire creativity and teach positive values, providing a healthy alternative to excessive screen time and helping children develop focus and imagination.",
    Podcasts:
      "Engaging discussions offering practical advice to manage digital distractions, build self-control, and promote emotional well-being for children and families.",
    Assessments:
      "Tools to identify and address social media and mobile addiction, offering personalized guidance to improve academic focus and overall personal growth.",
  };

  return (
    <div className="p-5 font-inter bg-[#FFEDD5]">
      <h1 className="text-[#F97316] text-3xl font-bold">What We Offer</h1>
      <ul className="mx-auto space-y-4 mt-6">
        {Object.entries(details).map(([key, value], index) => (
          <li
            className="text-gray-700 flex items-start gap-2 md:gap-5 text-sm md:text-base"
            key={index}
          >
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="text-orange-500 h-5 w-5 md:h-6 md:w-6 flex-shrink-0 mt-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </div>
            <div className="text-sm md:text-base">
              <span className="text-orange-500 font-bold">{key}</span>: {value}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WhatWeOffer;
