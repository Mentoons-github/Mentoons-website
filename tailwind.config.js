/** @type {import('tailwindcss').Config} */
import tailwindAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {},
    screens: {
      xxs: "300px",
      xs: "475px",
      sm: "639px",
      md: "768px",
      lg: "1026px",
      custom: "1110px",
      xl: "1281px",
      "2xl": "1441px",
      "3xl": "1920px",
    },
    extend: {
      fontFamily: {
        montserrat: "Montserrat",
        akshar: ["Akshar", "sans-serif"],
        inter: ["Inter", "sans-serif"],
        fredoka: ["Fredoka", "sans-serif"],
        epilogue: ["Epilogue", "sans-serif"],
        figtree: ["Figtree", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
        mulish: ["Mulish", "sans-serif"],
        forum: ["Forum", "sans-serif"],
        outfit: ["Outfit", "sans-serif"],
        cormorant: ["Cormorant", "sans-serif"],
        dmsans: ["DM Sans", "sans-serif"],
        firasans: ["Fira Sans", "sans-serif"],
        manrope: ["Manrope", "sans-serif"],
        inconsolata: ["Inconsolata", "sans-serif"],
        jost: ["Jost", "sans-serif"],
        futura: ["Futura Std", "sans-serif"],
        proza: ["Proza Libre", "sans-serif"],
      },
      colors: {
        "men-blue": "#003366",
        "light-blue": "#59b2dc",
        "light-cyan": "#0081a7",
        "mt-purple": "var(--mt-purple)",
        "mt-pink": "#eb4b7b",
        "mt-yellow": "#ffbc05",
        "mt-orange": "#f96A00",
        "mt-teal": "#0cc5bd",
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
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        float: "float 6s ease-in-out infinite",
        "float-delayed": "float 6s ease-in-out 3s infinite",
        "float-reverse": "float 7s ease-in-out infinite reverse",
        "float-slow": "float 8s ease-in-out infinite",
        "spin-slow": "spin 8s linear infinite",
        "bounce-slow": "bounce 3s infinite",
      },
      animations: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
      },
    },
  },
  plugins: [tailwindAnimate],
};
