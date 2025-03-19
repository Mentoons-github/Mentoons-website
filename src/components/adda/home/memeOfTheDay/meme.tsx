const Meme = () => {
  return (
    <div className="flex flex-col justify-center items-center p-2 shadow-xl w-full">
      <div className="flex justify-start items-start gap-3 w-full">
        <img
          src="/emojis/e62353b3daac244b2443ebe94d0d8343.png"
          alt="emoji"
          className="w-5 md:h-5"
        />
        <h1 className="text-start w-full text-sm md:text-md figtree">
          Mentoons Meme
        </h1>
      </div>
      <div className="flex flex-col justify-center items-center w-full p-3">
        <img
          src="/meme/WhatsApp Image 2025-02-17 at 15.56.48_ee80d5fb.jpg"
          alt="meme"
          className="w-full h-auto rounded-lg object-cover"
        />
      </div>
    </div>
  );
};

export default Meme;
