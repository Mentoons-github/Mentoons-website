const Membership = () => {
  return (
    <div className="h-screen bg-[url('/assets/cards/trial-bg.png')] bg-cover bg-center pb-10 pt-16 md:pt-24 lg:pt-40">
      <div className="container mx-auto px-4 h-full">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-20 justify-between items-center max-w-6xl mx-auto h-full md:h-auto">
          {/* left side */}
          <div className="md:w-1/2 p-4 md:p-8">
            <div className="flex items-center gap-2 md:gap-4 mb-4 md:mb-8">
              <h1 className="text-[#007BA9] text-2xl md:text-6xl font-bold leading-tight">
                Get 3 days<br/> free trial
              </h1>
              <img src="/assets/cards/character.png" alt="character" className="w-[4rem] md:w-[8rem]" />
            </div>
            <div className="space-y-2 md:space-y-10 mb-4 md:mb-8">
              <p className="text-lg md:text-xl font-semibold text-gray-800">
                Unlock Your Imagination: Try Our Cartoon Mentoring for Free
              </p>
              <div className="space-y-1 md:space-y-2">
                {[
                  'Download @ no cost',
                  '30 mins daily Unlimited Reading',
                  'Get Free Games, Labels, Stickers and more'
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-[#007BA9] lg:mb-10">✓</span>
                    <p className="text-[#B11B15] lg:mb-10">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
            <button className="bg-[#00AEEF] text-white px-6 md:px-10 py-2 md:py-3 rounded-full font-semibold hover:bg-[#006088] transition-colors shadow-[3px_3px_5.2px_0px_#53C6FFBA_inset,_-3px_-3px_3px_0px_#055E8B54_inset]">
              Start Free Trial
            </button>
          </div>

          {/* right side */}
          <div className="md:w-1/2 p-4 md:p-8">
            <h1 className="text-[#007BA9] text-2xl md:text-6xl font-bold leading-tight mb-4 md:mb-8">
              Get a membership<br/> at just ₹49
            </h1>
            <div className="space-y-2 md:space-y-10 mb-4 md:mb-8">
              <p className="text-lg md:text-xl font-semibold text-gray-800">
                All-Access to our Cartoon Mentoring Learning Adventures for Just ₹49
              </p>
              <div className="space-y-1 md:space-y-2">
                {[
                  'Get Unlimited Podcast',
                  'Get Unlimited Comics',
                  'Get Unlimited Audio Comics'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-[#007BA9] lg:mb-10">✓</span>
                    <p className="text-[#B11B15] lg:mb-10">{feature}</p>
                  </div>
                ))}
              </div>
            </div>
            <button className="shadow-[3px_3px_5.2px_0px_#D7D7D7A1_inset,_-3px_-3px_3px_0px_#073E5954_inset] text-[#00AEEF] bg-white px-6 md:px-10 py-2 md:py-3 rounded-full font-semibold hover:bg-[#006088] hover:text-white transition-colors">
              Get Membership
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Membership;
