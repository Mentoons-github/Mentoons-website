const StatisticVideo = () => {
  const statisticVideo = [
    {
      video: "",
      title: "sample sample sample",
    },
    {
      video: "",
      title: "sample sample sample",
    },
    {
      video: "",
      title: "sample sample sample",
    },
  ];
  return (
    <section className="relative mx-auto my-10 p-20">
      <div className="absolute -right-72 -top-20 w-[510px] h-[510px] bg-orange-400/10 rounded-full" />
      <div className="flex items-center justify-evenly gap-5">
        {statisticVideo.map((video, i) => (
          <div className="flex flex-col items-center justify-center">
            <div className="w-64 h-64 rounded-full border bg-orange-500">
              {video.video && (
                <video
                  src={video.video}
                  muted
                  loop
                  className="w-full h-full object-fill
                  "
                />
              )}
            </div>
            <h1 className="flex flex-col items-center justify-center gap-3 text-2xl text-gray-600">
              <div className="flex items-end justify-center gap-2">
                <span className="text-3xl font-semibold text-gray-400">
                  0{i + 1}
                </span>
                <div className="w-60 h-1 bg-gray-700" />
              </div>
              {video.title}
            </h1>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatisticVideo;
