const CommonIssue = () => {
  const Issues = [
    {
      image: "/assets/home/newPage/commonIssues/disputed_emotion.png",
      title: "Disrupted Emotion",
    },
    {
      image: "/assets/home/newPage/commonIssues/lack_of_communication.png",
      title: "Lack of communication",
    },
    {
      image: "/assets/home/newPage/commonIssues/excessive_screentime.png",
      title: "Excessive ScreenTime",
    },
    {
      image: "/assets/home/newPage/commonIssues/disrupted_sleep_pattern.png",
      title: "Disrupted Sleep Pattern",
    },
    {
      image: "/assets/home/newPage/commonIssues/social_isolation.png",
      title: "Social Isolation",
    },
  ];

  return (
    <div className="relative space-y-10 max-w-7xl w-full py-12 mx-auto px-4">
      <div className="absolute -left-60 top-1/3 w-[600px] h-[600px] bg-orange-400/10 rounded-full -z-10" />
      <div>
        <h1 className="text-4xl font-medium tracking-wide">COMMON ISSUES</h1>
        <p className="text-2xl text-gray-500 font-medium">We see in our kids</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Issues.slice(0, 3).map((issue, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="w-full h-96 overflow-hidden rounded-xl shadow-md">
              <img
                src={issue.image}
                alt={issue.title}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="mt-4 text-lg md:text-xl font-semibold text-center text-gray-600">
              {issue.title}
            </h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-8">
        {Issues.slice(3).map((issue, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="w-full h-80 overflow-hidden rounded-xl shadow-md">
              <img
                src={issue.image}
                alt={issue.title}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="mt-5 text-lg md:text-xl font-semibold text-center text-gray-600">
              {issue.title}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommonIssue;
