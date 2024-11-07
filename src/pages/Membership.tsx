const Membership = () => {
  const features = [
    'Get Unlimited Podcast',
    'Get Unlimited Comics',
    'Get Unlimited Audio Comics'
  ];

  const benefits = [
    'Download @ no cost',
    '30 mins daily Unlimited Reading',
    'Get Free Games, Labels, Stickers and more'
  ];

  const FeatureList = ({ items }: { items: string[] }) => (
    <div className="space-y-1 md:space-y-2">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <span className="text-[#007BA9]">✓</span>
          <p className="text-[#B11B15]">{item}</p>
        </div>
      ))}
    </div>
  );

  return (
    <div className="h-screen bg-[url('/assets/cards/trial-bg.png')] bg-cover bg-center pb-10 pt-16 md:pt-24 lg:pt-40">
      <div className="container mx-auto px-4 h-full">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-20 justify-center items-center max-w-6xl mx-auto h-full md:h-auto">
          <div className="md:w-1/2 p-4 md:p-8 space-y-6 md:space-y-8">
            <h1 className="text-[#007BA9] text-2xl md:text-6xl font-bold leading-tight">
              Get a membership<br/> at just ₹49
            </h1>
            
            <p className="text-lg md:text-xl font-semibold text-gray-800">
              All-Access to our Cartoon Mentoring Learning Adventures for Just ₹49
            </p>

            <FeatureList items={features} />
            
            <button className="shadow-[3px_3px_5.2px_0px_#D7D7D7A1_inset,_-3px_-3px_3px_0px_#073E5954_inset] text-[#00AEEF] bg-white px-6 md:px-10 py-2 md:py-3 rounded-full font-semibold hover:bg-[#006088] hover:text-white transition-colors">
              Get free 3 days trial
            </button>

            <FeatureList items={benefits} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Membership;
