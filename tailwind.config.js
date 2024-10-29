/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        md: "3rem",
        lg: "5rem",
        xl: "7.5rem",
      },
    },
    screens: {
      xxs: "300px",
      xs: "475px",
      sm: "639px",
      md: "768px",
      lg: "1024px",
      custom: "1110px",
      xl: "1281px",
      "2xl": "1441px",
      "3xl": "1920px",
    },
    extend: {
      fontFamily: {
        montserrat: "Montserrat",
      },
      colors: {
        "men-blue": "#003366",
        "light-blue": "#59b2dc",
        "light-cyan": "#0081a7",
        mustard: "#ec9600",
        "light-yellow": "#fdfcdc",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: "#EC9600",
        home: "#f0ebe5",
        "custom-gray": "rgba(219,219,219,1)",
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      backgroundImage: {
        "hero-image": "url('/caro3.png')",
        "footer-image": "url('/FooterBg.png')",
        darkClouds: "url('/src/assets/imgs/workshop_bg.png')",
        button: "url('/src/assets/imgs/Workshops_Page_ 5.png')",
        workshopBlueBg: "url('/src/assets/imgs/workshop-bg1.png')",
        comicsHome: "url('/comicHero.png')",
        comicsGreenBg: "url('/src/assets/imgs/comicsBgHome.svg')",
        comicsShelf: "url('/src/assets/imgs/comics_audioComicsBgHome.svg')",
        workshopBgHome: "url('/src/assets/imgs/workshopBgHome.svg')",
      },
      boxShadow: {
        "custom-light":
          "rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
        "roundedSlider-shadow": "0 0 7px #666",
        "custom-complex":
          "0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 10px 10px -5px rgba(0, 0, 0, 0.04)",
      },
      fontFamily: {
        comic: " Comic Neue, cursive",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      scale: {
        "-1": "-1",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

// import { useNavigate } from "react-router-dom";
// import Wordbreak from "./Wordbreak";

// const HeroSection: React.FC = () => {
//   const navigate = useNavigate();
//   return (
//     <div className="relative w-full text-[#864747] h-[130vh] md:h-[250vh] bg-comicsHome bg-no-repeat bg-cover bg-bottom bg-[#59B2DC]">
//       <div className="relative md:px-14 text-center md:text-start pt-40 md:pt-20 space-y-4">
//         <h1
//           className="font-extrabold text-4xl lg:text-8xl"
//           style={{
//             WebkitTextStroke: "3px black",
//             color: "transparent", // Optional, makes only the stroke visible
//             textShadow: "4px 4px 4px #FBD33D",
//           }}
//         >
//           Mentoons <Wordbreak /> Comics
//         </h1>
//         <p className="text-[#592828] text-3xl md:text-4xl font-semibold tracking-wider md:leading-snug">
//           Welcome to a world of <Wordbreak /> meaningful stories and valuable{" "}
//           <Wordbreak />
//           life lessons.
//         </p>
//         {/*share image  */}
//         <img
//           className="w-32 relative left-8 xl:left-16"
//           src="/assets/comics/4.png"
//         />
//         {/* message image */}
//         <img
//           className="w-48 md:w-52 absolute -top-11 md:-top-4 xl:top-[20%] 2xl:top-0 left-[48%] md:left-[35%] xl:left-[43%] transform scale-x-[-1]"
//           src="/assets/comics/1.png"
//         />
//         {/* Don't fade away comic */}
//         <img
//           onClick={() =>
//             navigate("/mentoons-comics/audio-comics/Don't Fade Away")
//           }
//           className="hidden lg:block w-32 border-[3px] shadow-md shadow-black rounded-md border-black absolute top-8 left-[61%] xl:left-[65%] -rotate-[25deg] cursor-pointer hover:scale-105 active:scale-100 transition-all duration-300 ease-in-out"
//           src="https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-04.jpg"
//         />
//         {/* black jalebi image */}
//         <img
//           className="w-32 absolute top-0 md:right-20 lg:right-40"
//           src="/assets/comics/3.png"
//         />
//         {/* one way trip comic */}
//         <img
//           onClick={() => navigate("/mentoons-comics/audio-comics/One Way Trip")}
//           className="hidden lg:block w-32 border-[3px] shadow-md shadow-black rounded-md border-black absolute top-[28%] right-[5%] xl:right-[10%] rotate-[25deg] cursor-pointer hover:scale-105 active:scale-100 transition-all duration-300 ease-in-out"
//           src="https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-22.jpg"
//         />
//         {/* power image */}
//         <img
//           className="hidden xl:block w-36 absolute top-[33%] left-[67%]"
//           src="/assets/comics/2.png"
//         />
//         {/* bet your life comic */}
//         <img
//           onClick={() =>
//             navigate("/mentoons-comics/audio-comics/Bet Your Life")
//           }
//           className="hidden xl:block w-32 border-[3px] z-50 shadow-md shadow-black rounded-md border-black absolute left-[56%] bottom-[30%] rotate-[25deg] cursor-pointer hover:scale-105 active:scale-100 transition-all duration-300 ease-in-out"
//           src="https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-09.jpg"
//         />
//         {/* come out of gaming comic */}
//         <img
//           onClick={() =>
//             navigate("/mentoons-comics/audio-comics/Come out of Gaming")
//           }
//           className="w-20 md:w-32 border-[3px] z-50 shadow-md shadow-black rounded-md border-black absolute right-8 md:right-16 xl:right-20 -bottom-4 md:-bottom-14 xl:bottom-8 -rotate-[20deg] md:-rotate-[35deg] cursor-pointer hover:scale-105 active:scale-100 transition-all duration-300 ease-in-out"
//           src="https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-05.jpg"
//         />
//         {/* cell life of soniya comic */}
//         <img
//           onClick={() =>
//             navigate("/mentoons-comics/audio-comics/The Cell Life of Soniya")
//           }
//           className="hidden xl:block w-32 border-[3px] z-50 shadow-md shadow-black rounded-md border-black absolute left-[40%] bottom-4 xl:bottom-12 -rotate-[35deg] cursor-pointer hover:scale-105 active:scale-100 transition-all duration-300 ease-in-out"
//           src="https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-12.jpg"
//         />
//         {/* Tanya's Downfall comic */}
//         <img
//           onClick={() =>
//             navigate("/mentoons-comics/audio-comics/Tanya's Downfall")
//           }
//           className="hidden md:block w-32 border-[3px] z-50 shadow-md shadow-black rounded-md border-black absolute left-[45%] bottom-0 rotate-[35deg] cursor-pointer hover:scale-105 active:scale-100 transition-all duration-300 ease-in-out"
//           src="https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-06.jpg"
//         />
//         {/* live and let live comic */}
//         <img
//           onClick={() =>
//             navigate("/mentoons-comics/audio-comics/Live and Let Live")
//           }
//           className="w-28 md:w-[10.5rem] border-[3px] z-50 shadow-md shadow-black rounded-md border-black absolute left-4 md:left-[10%] -bottom-[20%] md:-bottom-[30%] -rotate-[35deg] cursor-pointer hover:scale-105 active:scale-100 transition-all duration-300 ease-in-out"
//           src="https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-21.jpg"
//         />
//         {/* i can manage comic */}
//         <img
//           onClick={() =>
//             navigate(
//               "/mentoons-comics/audio-comics/I can Manage (Time Management)"
//             )
//           }
//           className="w-20 md:w-32 border-[3px] z-50 shadow-md shadow-black rounded-md border-black absolute left-[5%] -bottom-[80%] md:-bottom-[65%] -rotate-[20deg] cursor-pointer hover:scale-105 active:scale-100 transition-all duration-300 ease-in-out"
//           src="https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-02.jpg"
//         />
//         {/* choose wisely comic */}
//         <img
//           onClick={() =>
//             navigate("/mentoons-comics/audio-comics/Choose Wisely")
//           }
//           className="hidden 2xl:block w-32 border-[3px] z-50 shadow-md shadow-black rounded-md border-black absolute right-[14%] -bottom-[30%] rotate-[20deg] cursor-pointer hover:scale-105 active:scale-100 transition-all duration-300 ease-in-out"
//           src="https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-08.jpg"
//         />
//         {/* rohan and puppies comic */}
//         <img
//           onClick={() =>
//             navigate("/mentoons-comics/audio-comics/Rohan and the Puppies")
//           }
//           className="hidden 2xl:block w-32 border-[3px] z-50 shadow-md shadow-black rounded-md border-black absolute right-[25%] -bottom-[70%] rotate-[40deg] cursor-pointer hover:scale-105 active:scale-100 transition-all duration-300 ease-in-out"
//           src="https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-17.jpg"
//         />
//         {/* rishi and rohit comic */}
//         <img
//           onClick={() =>
//             navigate("/mentoons-comics/audio-comics/Rishi and Rohit")
//           }
//           className="hidden md:block w-32 border-[3px] z-50 shadow-md shadow-black rounded-md border-black absolute right-[8%] -bottom-[62%] -rotate-[40deg] cursor-pointer hover:scale-105 active:scale-100 transition-all duration-300 ease-in-out"
//           src="https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-16.jpg"
//         />
//         {/* my daily routine comic */}
//         <img
//           onClick={() =>
//             navigate("/mentoons-comics/audio-comics/My Daily Routine")
//           }
//           className="hidden md:block w-32 border-[3px] z-50 shadow-md shadow-black rounded-md border-black absolute left-[6%] md:left-[8%] -bottom-[110%] md:-bottom-[95%] -rotate-[60deg] cursor-pointer hover:scale-105 active:scale-100 transition-all duration-300 ease-in-out"
//           src="https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-01.jpg"
//         />
//         {/* stories on divorce comic */}
//         <img
//           onClick={() =>
//             navigate("/mentoons-comics/audio-comics/Comic on Divorce")
//           }
//           className="hidden 2xl:block w-40 border-[3px] z-50 shadow-md shadow-black rounded-md border-black absolute left-[18%] -bottom-[130%] -rotate-[60deg] cursor-pointer hover:scale-105 active:scale-100 transition-all duration-300 ease-in-out"
//           src="https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-07.jpg"
//         />
//         {/* say sorry comic */}
//         <img
//           onClick={() => navigate("/mentoons-comics/audio-comics/Say Sorry")}
//           className="hidden md:block w-40 border-[3px] z-50 shadow-md shadow-black rounded-md border-black absolute left-[10%] md:left-[20%] xl:left-[38%] -bottom-[160%] md:-bottom-[140%] xl:-bottom-[130%] -rotate-[60deg] cursor-pointer hover:scale-105 active:scale-100 transition-all duration-300 ease-in-out"
//           src="https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-10.jpg"
//         />
//         {/* teenagers job 2 comic */}
//         <img
//           onClick={() =>
//             navigate(
//               "/mentoons-comics/audio-comics/How Teenagers Lose Their Jobs Part-2"
//             )
//           }
//           className="block w-20 md:hidden xl:block md:w-32 border-[3px] z-50 shadow-md shadow-black rounded-md border-black absolute left-[75%] md:left-[58%] -bottom-[50%] md:-bottom-[110%] -rotate-[10deg] md:-rotate-[60deg] cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"
//           src="https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-24.jpg"
//         />
//         {/* Hungry for likes not likes comic */}
//         <img
//           onClick={() =>
//             navigate("/mentoons-comics/audio-comics/Hungry for Likes Not Life")
//           }
//           className="hidden md:block w-32 border-[3px] z-50 shadow-md shadow-black rounded-md border-black absolute left-[30%] md:left-[58%] -bottom-[230%] md:-bottom-[180%] xl:-bottom-[160%] -rotate-[60deg] cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"
//           src="https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-15.jpg"
//         />
//         {/* Think before you act comic */}
//         <img
//           onClick={() =>
//             navigate("/mentoons-comics/audio-comics/Think Before You Act")
//           }
//           className="w-24 md:w-40 border-[3px] z-50 shadow-md shadow-black rounded-md border-black absolute left-[30%] md:left-[70%] lg:left-[80%] -bottom-[110%] md:-bottom-[110%] -rotate-[60deg] cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"
//           src="https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/Think_Before_You_Act!.png"
//         />
//         {/* flower image */}
//         <img
//           className="w-24 md:w-40 z-50 rounded-md absolute left-[65%] md:left-[50%] lg:left-[78%] -bottom-[120%] md:-bottom-[150%] -rotate-[60deg]"
//           src="/assets/images/flowerComics.png"
//         />
//       </div>
//       {/* clement toonla image */}
//       <div className="flex w-full h-full items-center justify-center">
//         <img
//           className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[18%] md:-translate-y-1/2 -rotate-[90deg] lg:-rotate-[65deg] 2xl:-rotate-45 w-[80rem] h-[15rem] xl:w-[70rem] lg:h-[35rem]"
//           src="/klement_toonla.png"
//           alt="klement toonla image"
//         />
//       </div>
//     </div>
//   );
// };

// export default HeroSection;

// import { useNavigate } from "react-router-dom";
// import Wordbreak from "./Wordbreak";

// const HeroSection: React.FC = () => {
//   const navigate = useNavigate();
//   return (
//     <div className="relative w-full text-[#864747] h-[150vh] md:h-[250vh] bg-comicsHome bg-no-repeat bg-cover bg-bottom bg-[#59B2DC]">
//       <div className="relative md:px-14 text-center md:text-start pt-44 md:pt-20 space-y-4">
//         <h1
//           className="font-extrabold text-4xl lg:text-8xl"
//           style={{
//             WebkitTextStroke: "3px black",
//             color: "transparent", // Optional, makes only the stroke visible
//             textShadow: "4px 4px 4px #FBD33D",
//           }}
//         >
//           Mentoons <Wordbreak /> Comics
//         </h1>
//         <p className="text-[#592828] text-3xl md:text-4xl font-semibold tracking-wider md:leading-snug">
//           Welcome to a world of <Wordbreak /> meaningful stories and valuable{" "}
//           <Wordbreak />
//           life lessons.
//         </p>
//         {/*share image  */}
//         <img
//           className="w-32 relative left-4 lg:left-16"
//           src="/assets/comics/4.png"
//         />
//         {/* message image */}
//         <img
//           className="w-52 absolute top-[-2rem] left-[43%] md:left-[40%] lg:top-0 lg:left-[43%] transform scale-x-[-1]"
//           src="/assets/comics/1.png"
//         />
//         <>
//           {/* large screen comics */}
//           {/* Don't fade away comic */}
//           <img
//             onClick={() =>
//               navigate("/mentoons-comics/audio-comics/Don't Fade Away")
//             }
//             className="w-[4rem] md:w-24 lg:w-32 border-[3px] shadow-md shadow-black rounded-md border-black absolute top-[60%] right-[15%] lg:top-8 lg:left-[65%] -rotate-[25deg] cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"
//             src="https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-04.jpg"
//           />
//           {/* black jalebi image */}
//           <img
//             className="w-32 absolute top-[1rem] right-[60%] md:right-20 lg:top-0 lg:right-40"
//             src="/assets/comics/3.png"
//           />
//           {/* one way trip comic */}
//           <img
//             onClick={() =>
//               navigate("/mentoons-comics/audio-comics/One Way Trip")
//             }
//             className="hidden xl:block w-32 border-[3px] shadow-md shadow-black rounded-md border-black absolute top-[28%] right-[10%] rotate-[25deg] cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"
//             src="https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-22.jpg"
//           />
//           {/* power image */}
//           <img
//             className="hidden xl:block w-36 absolute top-[33%] left-[67%]"
//             src="/assets/comics/2.png"
//           />
//           {/* bet your life comic */}
//           <img
//             onClick={() =>
//               navigate("/mentoons-comics/audio-comics/Bet Your Life")
//             }
//             className="hidden xl:block w-32 border-[3px] z-50 shadow-md shadow-black rounded-md border-black absolute left-[56%] bottom-[30%] rotate-[25deg] cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"
//             src="https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-09.jpg"
//           />
//           {/* come out of gaming comic */}
//           <img
//             onClick={() =>
//               navigate("/mentoons-comics/audio-comics/Come out of Gaming")
//             }
//             className="hidden xl:block w-32 border-[3px] z-50 shadow-md shadow-black rounded-md border-black absolute right-20 bottom-8 -rotate-[35deg] cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"
//             src="https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-05.jpg"
//           />
//           {/* cell life of soniya comic */}
//           <img
//             onClick={() =>
//               navigate("/mentoons-comics/audio-comics/The Cell Life of Soniya")
//             }
//             className="hidden xl:block w-32 border-[3px] z-50 shadow-md shadow-black rounded-md border-black absolute left-[40%] bottom-12 -rotate-[35deg] cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"
//             src="https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-12.jpg"
//           />
//           {/* tanya's downfall comic */}
//           <img
//             onClick={() =>
//               navigate("/mentoons-comics/audio-comics/Tanya's Downfall")
//             }
//             className="hidden xl:block w-32 border-[3px] z-50 shadow-md shadow-black rounded-md border-black absolute left-[20%] bottom-0 rotate-[35deg] cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"
//             src="https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-06.jpg"
//           />
//           {/* live and let live comic */}
//           <img
//             onClick={() =>
//               navigate("/mentoons-comics/audio-comics/Live and Let Live")
//             }
//             className="hidden xl:block w-[10.5rem] border-[3px] z-50 shadow-md shadow-black rounded-md border-black absolute left-[10%] -bottom-[30%] -rotate-[35deg] cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"
//             src="https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-21.jpg"
//           />
//           {/* i can manage comic */}
//           <img
//             onClick={() =>
//               navigate(
//                 "/mentoons-comics/audio-comics/I can Manage (Time Management)"
//               )
//             }
//             className="hidden xl:block w-32 border-[3px] z-50 shadow-md shadow-black rounded-md border-black absolute left-[17%] -bottom-[65%] -rotate-[20deg] cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"
//             src="https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-02.jpg"
//           />
//           {/* choose wisely comic */}
//           <img
//             onClick={() =>
//               navigate("/mentoons-comics/audio-comics/Choose Wisely")
//             }
//             className="hidden xl:block w-32 border-[3px] z-50 shadow-md shadow-black rounded-md border-black absolute right-[14%] -bottom-[30%] rotate-[20deg] cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"
//             src="https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-08.jpg"
//           />
//           {/* rohan and puppies comic */}
//           <img
//             onClick={() =>
//               navigate("/mentoons-comics/audio-comics/Rohan and the Puppies")
//             }
//             className="hidden xl:block w-32 border-[3px] z-50 shadow-md shadow-black rounded-md border-black absolute right-[25%] -bottom-[70%] rotate-[40deg] cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"
//             src="https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-17.jpg"
//           />
//           {/* rishi and rohit comic */}
//           <img
//             onClick={() =>
//               navigate("/mentoons-comics/audio-comics/Rishi and Rohit")
//             }
//             className="hidden xl:block w-32 border-[3px] z-50 shadow-md shadow-black rounded-md border-black absolute right-[8%] -bottom-[62%] -rotate-[40deg] cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"
//             src="https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-16.jpg"
//           />
//           {/* my daily routine comic */}
//           <img
//             onClick={() =>
//               navigate("/mentoons-comics/audio-comics/My Daily Routine")
//             }
//             className="hidden xl:block w-32 border-[3px] z-50 shadow-md shadow-black rounded-md border-black absolute left-[8%] -bottom-[95%] -rotate-[60deg] cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"
//             src="https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-01.jpg"
//           />
//           {/* stories on divorce comic */}
//           <img
//             onClick={() =>
//               navigate("/mentoons-comics/audio-comics/Comic on Divorce")
//             }
//             className="hidden xl:block w-40 border-[3px] z-50 shadow-md shadow-black rounded-md border-black absolute left-[18%] -bottom-[130%] -rotate-[60deg] cursor-pointer hover:scale-105 active:scale-100 transition-all duration-300 ease-in-out"
//             src="https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-07.jpg"
//           />
//           {/* say sorry comic */}
//           <img
//             onClick={() => navigate("/mentoons-comics/audio-comics/Say Sorry")}
//             className="hidden xl:block w-40 border-[3px] z-50 shadow-md shadow-black rounded-md border-black absolute left-[10%] md:left-[20%] xl:left-[38%] -bottom-[160%] md:-bottom-[140%] xl:-bottom-[130%] -rotate-[60deg] cursor-pointer hover:scale-105 active:scale-100 transition-all duration-300 ease-in-out"
//             src="https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-10.jpg"
//           />
//           {/* teenagers job 2 comic */}
//           <img
//             onClick={() =>
//               navigate(
//                 "/mentoons-comics/audio-comics/How Teenagers Lose Their Jobs Part-2"
//               )
//             }
//             className=" hidden xl:block w-32 border-[3px] z-50 shadow-md shadow-black rounded-md border-black absolute left-[75%] md:left-[58%] -bottom-[50%] md:-bottom-[110%] -rotate-[10deg] md:-rotate-[60deg] cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"
//             src="https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-24.jpg"
//           />
//           {/* Hungry for likes not likes comic */}
//           <img
//             onClick={() =>
//               navigate(
//                 "/mentoons-comics/audio-comics/Hungry for Likes Not Life"
//               )
//             }
//             className="hidden xl:block w-32 border-[3px] z-50 shadow-md shadow-black rounded-md border-black absolute left-[30%] md:left-[58%] -bottom-[230%] md:-bottom-[180%] xl:-bottom-[160%] -rotate-[60deg] cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"
//             src="https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/1-15.jpg"
//           />
//           {/* Think before you act comic */}
//           <img
//             onClick={() =>
//               navigate("/mentoons-comics/audio-comics/Think Before You Act")
//             }
//             className="hidden xl:block w-40 border-[3px] z-50 shadow-md shadow-black rounded-md border-black absolute left-[30%] md:left-[70%] lg:left-[80%] -bottom-[110%] md:-bottom-[110%] -rotate-[60deg] cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"
//             src="https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/thumbnail/mini_images/Think_Before_You_Act!.png"
//           />
//           {/* flower image */}
//           <img
//             className="hidden xl:block w-24 md:w-40 z-50 rounded-md absolute left-[65%] md:left-[50%] lg:left-[78%] -bottom-[120%] md:-bottom-[150%] -rotate-[60deg]"
//             src="/assets/images/flowerComics.png"
//           />
//         </>
//       </div>
//       {/* clement toonla image */}
//       <div className="flex w-full h-full items-center justify-center">
//         <img
//           className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[0%] md:-translate-y-1/2 rotate-[90deg] lg:-rotate-[60deg] xl:-rotate-45 w-[30rem] h-[15rem] md:w-[60rem] md:h-[24rem] lg:w-[70rem] lg:h-[35rem]"
//           src="/klement_toonla.png"
//           alt="klement toonla image"
//         />
//       </div>
//     </div>
//   );
// };

// export default HeroSection;
