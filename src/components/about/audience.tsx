const AudienceSection = () => {
  return (
    <section className="grid grid-cols-1 gap-8 px-20 py-20 md:grid-cols-2">
      {/* Parents */}
      <div className="flex flex-col">
        <h2 className="text-4xl font-semibold text-[#1A1A1A]">For Parents</h2>

        <p className="mt-4 max-w-xl text-base leading-relaxed text-[#4A4A4A]">
          Begin your journey with us today and unlock the true potential of your
          child with tools built by psychologists and mentors.
        </p>

        <button className="mt-6 flex w-fit items-center gap-2 rounded-md bg-[#FF7A1A] px-5 py-3 text-sm font-semibold text-white hover:bg-[#E96B0C] transition">
          Explore
          <span aria-hidden>→</span>
        </button>
      </div>

      {/* Children */}
      <div className="flex flex-col">
        <h2 className="text-4xl font-semibold text-[#1A1A1A]">For Children</h2>

        <p className="mt-4 max-w-xl text-base leading-relaxed text-[#4A4A4A]">
          Comics, podcasts, games and workshops designed to help kids build
          emotional balance and real-life connection.
        </p>

        <button className="mt-6 flex w-fit items-center gap-2 rounded-md bg-[#FF7A1A] px-5 py-3 text-sm font-semibold text-white hover:bg-[#E96B0C] transition">
          Explore
          <span aria-hidden>→</span>
        </button>
      </div>
    </section>
  );
};

export default AudienceSection;
