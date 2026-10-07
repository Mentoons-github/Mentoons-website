const JoinCommunity = () => {
  const fields = ["Name", "Email", "Contact Number", "Category"];

  return (
    <div className="w-full h-full bg-orange-50 rounded-lg p-8 flex flex-col gap-5 border border-orange-100">
      <h2 className="text-4xl font-semibold text-neutral-900">
        Join Our Community
      </h2>

      <p className="text-base text-neutral-500 leading-relaxed">
        Connect with parents, children, and caregivers in a safe, friendly
        space. Share experiences, ask questions, and find support as we grow and
        learn together.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-2">
        {fields.map((label) => (
          <label key={label} className="flex flex-col gap-2">
            <span className="text-sm font-medium text-neutral-600">
              {label}
            </span>

            <input
              type="text"
              className="w-full h-11 px-3 bg-white border border-orange-200 rounded-md outline-none focus:border-orange-500 transition"
            />
          </label>
        ))}
      </div>

      <button className="self-start mt-2 bg-orange-500 text-white rounded-md px-5 py-3 text-sm font-medium hover:bg-orange-600 transition">
        Request to Join
      </button>
    </div>
  );
};

export default JoinCommunity;
