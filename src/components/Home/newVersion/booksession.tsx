import { Link } from "react-router-dom";

const BookSession = () => {
  return (
    <section className="py-20 px-20">
      <div className="relative w-full overflow-hidden bg-orange-50 rounded-lg p-8 grid sm:grid-cols-2 gap-8 items-center">
        {/* Converging color fields */}
        <div
          className="absolute -left-20 top-1/2 -translate-y-1/2 w-72 h-72 rounded-full opacity-40 blur-3xl"
          style={{
            background: "radial-gradient(circle, #fb923c 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute -right-20 top-1/2 -translate-y-1/2 w-72 h-72 rounded-full opacity-40 blur-3xl"
          style={{
            background: "radial-gradient(circle, #fcd34d 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />

        {/* Image Placeholder */}
        <div className="relative w-full h-64 sm:h-80 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center order-2 sm:order-1 border border-white">
          <span className="text-sm text-neutral-400">Session Image</span>
        </div>

        {/* Content */}
        <div className="relative flex flex-col gap-4 order-1 sm:order-2">
          <h2 className="text-4xl font-semibold text-neutral-900">
            Schedule Personalized One-on-One Call
          </h2>

          <p className="text-base text-neutral-500 leading-relaxed max-w-xl">
            Curious about your assessment results? Get a personalized, in-depth
            analysis and expert guidance tailored just for you.
          </p>

          <Link
            to="/bookings"
            className="self-start mt-2 bg-orange-500 text-white rounded-md px-5 py-3 text-sm font-medium flex items-center gap-2 hover:bg-orange-600 transition"
          >
            Book Session
            <span aria-hidden>&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BookSession;
