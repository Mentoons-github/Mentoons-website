import { Link } from "react-router-dom";

const DiscoverYourself = () => {
  return (
    <section className="py-10 px-20">
      <div className="relative w-full overflow-hidden bg-neutral-50 rounded-lg p-8 grid sm:grid-cols-2 gap-8 items-center border border-neutral-200">
        {/* Dot grid texture */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.35]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="discover-dots"
              width="22"
              height="22"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="1.5" cy="1.5" r="1.5" fill="#d4d4d4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#discover-dots)" />
        </svg>

        {/* Overlapping trait blobs */}
        <div
          className="absolute -left-24 -top-24 w-96 h-96 rounded-full opacity-40 blur-3xl"
          style={{
            background: "radial-gradient(circle, #a5b4fc 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute left-16 -top-10 w-80 h-80 rounded-full opacity-40 blur-3xl"
          style={{
            background: "radial-gradient(circle, #fcd34d 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute -left-10 top-24 w-72 h-72 rounded-full opacity-40 blur-3xl"
          style={{
            background: "radial-gradient(circle, #6ee7b7 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />

        {/* Content */}
        <div className="relative flex flex-col gap-4">
          <h2 className="text-4xl font-semibold text-neutral-900">
            Discover Your Intelligence Type
          </h2>

          <p className="text-base text-neutral-500 leading-relaxed max-w-xl">
            Uncover your unique traits, strengths, and preferences with our
            psychologist-designed personality assessments.
          </p>

          <p className="text-base text-neutral-500 leading-relaxed max-w-xl">
            Gain deeper self-awareness to make informed decisions, improve
            relationships, and unlock your full potential.
          </p>

          <Link
            to="/assessment-page"
            className="self-start mt-2 bg-neutral-800 text-white rounded-md px-5 py-3 text-sm font-medium flex items-center gap-2 hover:bg-neutral-700 transition"
          >
            Start Assessment
            <span aria-hidden>&rarr;</span>
          </Link>
        </div>

        {/* Image Placeholder */}
        <div className="relative w-full h-64 sm:h-80 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center border border-neutral-200">
          <img
            src="/assets/home/newHome/discover_yourself.webp"
            alt="DY"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </section>
  );
};

export default DiscoverYourself;
