const benefits = [
  "Benefit 1",
  "Benefit 2",
  "Benefit 3",
  "Benefit 4",
  "Benefit 5",
  "Benefit 6",
];

const BenefitsSection = () => {
  return (
    <section className="px-20 py-20">
      <h2 className="mb-10 max-w-4xl text-4xl font-semibold text-[#1A1A1A]">
        By choosing Mentoons as your guide you can achieve the following
      </h2>

      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
        {benefits.map((label) => (
          <div key={label} className="flex flex-col items-center gap-4">
            {/* Image Placeholder */}
            <div className="h-32 w-full rounded-lg bg-[#D9D9D9] flex items-center justify-center">
              <span className="text-sm text-neutral-400">Image</span>
            </div>

            {/* Benefit */}
            <p className="text-base font-medium text-[#4A4A4A] text-center">
              {label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BenefitsSection;
