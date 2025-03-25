const MissingOutProducts = () => {
  return (
    <div className="p-10 w-full bg-[#404874] space-y-10">
      <h1 className="font-mulish font-bold text-4xl text-[#E39712] w-96">
        Products Your are missing out on!
      </h1>
      <div className="flex justify-center items-center mt-5">
        <img
          src="/assets/productv2/conversation-starter-cards-13-16.png"
          alt="conversation-starter"
          className="w-96"
        />
      </div>

      <p className="font-inter font-semibold text-xl text-[#1A1D3B] mt-5 text-center">
        Conversation Starter Cards
      </p>
    </div>
  );
};

export default MissingOutProducts;
