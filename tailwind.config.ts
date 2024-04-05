/** @type {import('tailwindcss').Config} */
const { nextui } = require("@nextui-org/react");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      xs: "375px",
      sm: "480px",
      md: "768px",
      md2: "883px",
      lg: "976px",
      lg2: "1167px",
      xl: "1440px",
      xxl: "1600px",
    },
    colors: {
      "nafl-sponge": {
        100: "#FFFFEC",
        200: "#FFFFC5",
        300: "#FFFF9E",
        400: "#FEFF6E",
        500: "#FEFF3D",
        600: "#BFBF2E",
        700: "#8C8C22",
        800: "#4C4D12",
      },
      "nafl-jade": {
        100: "#E6F7F7",
        200: "#B3E8E8",
        300: "#74D4D4",
        400: "#41C5C5",
        500: "#02B1B1",
        600: "#028585",
        700: "#016161",
        800: "#013535",
      },
      "nafl-charcoal": {
        100: "#EDEDED",
        200: "#C8C8C8",
        300: "#A3A3A3",
        400: "#747474",
        500: "#464646",
        600: "#353535",
        700: "#272727",
        800: "#151515",
      },
      "nafl-sys": {
        error: "#FF3D3D",
        warn: "#FF9900",
        done: "#00A72F",
        complete: "#257BFD",
      },
      "nafl-yellow": {
        500: "#FEFF3D",
      },
      "nafl-aqua": {
        500: "#02B1B1",
      },
      "nafl-grey": {
        400: "#C4C4C4",
        500: "#626262",
        600: "#464646",
        700: "#2F2F2F",
        800: "#212121",
        900: "#181818",
      },
      "nafl-white": "#FFFFFF",
      "nafl-purple": "#DC2ABF",
    },
    fontSize: {
      "title-base": [
        "1rem",
        {
          lineHeight: "1.2rem",
          letterSpacing: "-0.005rem",
          fontVariationSettings:
            "'wdth' 25, 'GRAD' 0, 'slnt' 0, 'XTRA' 363, 'XOPQ' 96, 'YOPQ' 79, 'YTLC' 514, 'YTUC' 712, 'YTAS' 750, 'YTDE' -203, 'YTFI' 738",
        },
      ],
      "title-lg": [
        "1.125rem",
        {
          lineHeight: "1.2rem",
          letterSpacing: "0.005rem",
          fontVariationSettings:
            "'wdth' 25, 'GRAD' 0, 'slnt' 0, 'XTRA' 363, 'XOPQ' 96, 'YOPQ' 79, 'YTLC' 514, 'YTUC' 712, 'YTAS' 750, 'YTDE' -203, 'YTFI' 738",
        },
      ],
      "title-xl": [
        "1.5rem",
        {
          lineHeight: "1.7rem",
          letterSpacing: "-0.01rem",
          fontVariationSettings:
            "'wdth' 25, 'GRAD' 0, 'slnt' 0, 'XTRA' 363, 'XOPQ' 96, 'YOPQ' 79, 'YTLC' 514, 'YTUC' 712, 'YTAS' 750, 'YTDE' -203, 'YTFI' 738",
        },
      ],
      "title-2xl": [
        "1.5rem",
        {
          lineHeight: "2rem",
          letterSpacing: "-0.01rem",
        },
      ],
      "title-3xl": [
        "1.875rem",
        {
          lineHeight: "2rem",
          letterSpacing: "-0.01rem",
        },
      ],
      "title-4xl": [
        "2.25rem",
        {
          lineHeight: "2rem",
          letterSpacing: "-0.01rem",
        },
      ],
      "title-5xl": [
        "3rem",
        {
          lineHeight: "2rem",
          letterSpacing: "-0.01rem",
        },
      ],
      // BODY SIZE
      "body-xs": [
        "0.75rem",
        {
          lineHeight: "1rem",
          letterSpacing: "0.005rem",
          fontWeight: "400",
        },
      ],
      "body-sm": [
        "0.875rem",
        {
          lineHeight: "1.25rem",
          letterSpacing: "0.005rem",
          fontWeight: "400",
        },
      ],
      "body-base": [
        "1rem",
        {
          lineHeight: "1.5rem",
          letterSpacing: "0.005rem",
          fontWeight: "400",
        },
      ],
      "body-lg": [
        "1.125rem",
        {
          lineHeight: "1.75rem",
          letterSpacing: "0.005rem",
          fontWeight: "400",
        },
      ],
      "body-xl": [
        "1.25rem",
        {
          lineHeight: "1.75rem",
          fontWeight: "400",
        },
      ],
      "body-2xl": [
        "1.5rem",
        {
          lineHeight: "2rem",
          fontWeight: "400",
        },
      ],
      // BOLD SIZE
      "bold-xs": [
        "0.75rem",
        {
          lineHeight: "1rem",
          letterSpacing: "0.005rem",
          fontWeight: "700",
        },
      ],
      "bold-sm": [
        "0.875rem",
        {
          lineHeight: "1.25rem",
          letterSpacing: "0.005rem",
          fontWeight: "700",
        },
      ],
      "bold-base": [
        "1rem",
        {
          lineHeight: "1.5rem",
          letterSpacing: "0.005rem",
          fontWeight: "700",
        },
      ],
      "bold-lg": [
        "1.125rem",
        {
          lineHeight: "1.75rem",
          letterSpacing: "0.005rem",
          fontWeight: "700",
        },
      ],
      "bold-xl": [
        "1.25rem",
        {
          lineHeight: "1.75rem",
          fontWeight: "700",
        },
      ],
    },
    fontFamily: {
      sans: ["Roboto", "sans-serif"],
      mono: ["Bebas Neue", "sans-serif"],
    },
    extend: {
      fontFamily: {
        "roboto-body": "Roboto Flex",
      },
      fontSize: {
        xs: "0.75rem",
        sm: "0.875rem",
        base: "1rem",
        lg: "1.125rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
        "4xl": "2.25rem",
        "5xl": "3rem",
        "6xl": "4rem",
      },
      backgroundImage: {
        "gradient-nafl-rainbow":
          "linear-gradient(100deg, #02B1B1 -8.21%, #FEFF3D 104.81%)",
        "radial-gradient":
          "radial-gradient(ellipse at center, rgba(53,53,53,0) 0%, rgba(53,53,53,1) 50%, rgba(53,53,53,1) 100%)",
      },
      spacing: {
        128: "32rem",
        144: "36rem",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      animation: {
        fade: "fadeOut 5s ease-in-out",
      },
    },
  },
  variants: {
    extend: {
      userSelect: ["responsive", "group-hover", "focus"],
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
