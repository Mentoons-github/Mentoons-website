import { ShieldCheck, Heart, Gift } from "lucide-react";

const TRUST_POINTS = [
  { id: "safe", icon: ShieldCheck, label: "Confidential & Safe" },
  { id: "friendly", icon: Heart, label: "Child-friendly Approach" },
  { id: "guidance", icon: Gift, label: "Personalized Guidance" },
];

const HeroSection = () => {
  return (
    <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen">
      <section className="grid w-full grid-cols-1 gap-8 border-b p-6 sm:p-10 lg:grid-cols-2 lg:px-16">
        <div>
          <h1 className="mt-2 text-4xl font-bold leading-tight text-gray-900 md:text-5xl">
            One-on-One
            <br />
            with a Psychologist
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-gray-600 max-w-md">
            A safe, supportive space for children and teens to talk, be heard,
            and grow with expert guidance.
          </p>

          <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
            {TRUST_POINTS.map(({ id, icon: Icon, label }) => (
              <li
                key={id}
                className="flex items-center gap-2 text-sm text-stone-700"
              >
                <Icon className="h-5 w-5 text-stone-500" strokeWidth={1.75} />
                {label}
              </li>
            ))}
          </ul>
        </div>

        {/* Image slot — drop the banner illustration/photo in here */}
        <div className="flex h-56 items-center justify-center rounded-2xl sm:h-72">
          <img
            src="/assets/v3/oneOnOneSession/oneonone.png"
            alt="Psychologist session"
            className="h-full w-full rounded-2xl object-contain"
          />
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
