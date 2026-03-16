import { FaArrowUp } from "react-icons/fa6";

const Join = () => {
  return (
    <section className="relative bg-white overflow-hidden">
      <div className="flex flex-col items-center justify-center min-h-screen py-16">
        <div className="flex flex-col items-center gap-4 z-10">
          <span className="text-4xl font-semibold">Join Us in our</span>

          <h1 className="text-8xl font-extrabold [-webkit-text-stroke:2px_rgba(0,0,0,0.5)] bg-gradient-to-b from-orange-600 via-white to-green-600 text-transparent bg-clip-text">
            MISSION
          </h1>

          <span className="text-4xl font-semibold">And Make</span>

          <h1 className="text-8xl font-extrabold [-webkit-text-stroke:2px_rgba(0,0,0,0.5)] bg-gradient-to-b from-orange-600 via-white to-green-600 text-transparent bg-clip-text">
            CHILDHOOD
          </h1>

          <span className="text-4xl font-semibold">As it should be</span>

          <button className="flex items-center justify-center gap-2 rounded-lg bg-orange-400 px-10 py-2 text-white mt-3 text-lg">
            Get Started <FaArrowUp className="rotate-45" />
          </button>

          <img
            src="/assets/home/newPage/join/meditation.png"
            alt="meditation"
            className="w-64 h-64 mt-6"
          />
        </div>
      </div>

      <div className="w-full leading-none -mt-36">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          className="w-full block"
        >
          <path
            fill="#fb923c"
            fillOpacity="1"
            d="M0,32L14.1,37.3C28.2,43,56,53,85,80C112.9,107,141,149,169,154.7C197.6,160,226,128,254,149.3C282.4,171,311,245,339,266.7C367.1,288,395,256,424,234.7C451.8,213,480,203,508,213.3C536.5,224,565,256,593,245.3C621.2,235,649,181,678,165.3C705.9,149,734,171,762,181.3C790.6,192,819,192,847,165.3C875.3,139,904,85,932,90.7C960,96,988,160,1016,165.3C1044.7,171,1073,117,1101,122.7C1129.4,128,1158,192,1186,181.3C1214.1,171,1242,85,1271,80C1298.8,75,1327,149,1355,160C1383.5,171,1412,117,1426,90.7L1440,64L1440,320L0,320Z"
          />
        </svg>
      </div>
    </section>
  );
};

export default Join;
