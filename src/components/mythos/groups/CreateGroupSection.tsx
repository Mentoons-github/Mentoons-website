const CreateGroupSection = () => {
  return (
    <div className="flex flex-col items-start justify-start gap-4 md:flex-row  bg-[#1A1D3B] bg-[url('/assets/mythos/background/section/stars_background.png')] bg-center py-12">
      <div className="flex items-center justify-center flex-1 ">
        <img src="/assets/mythos/groups/Jupiter.png" alt="" />
      </div>
      <div className="flex flex-col items-start justify-start flex-1">
        <h1 className="text-4xl font-semibold text-[#E39712] pt-24 pb-12">
          Create a Group
        </h1>
        <p className="pb-12 text-lg text-white">
          Create a group to connect with others who share your interests.
        </p>
        <button className="flex items-center justify-center gap-6 px-8 py-4 text-lg  text-[#E39712] bg-white">
          <img src="/assets/mythos/icons/star.png" className="w-6" />
          Submit For Approval
        </button>
      </div>
    </div>
  );
};

export default CreateGroupSection;
