const { NONE_TYPE } = require("@angular/compiler");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      height: {
        screen: ["100vh", "100svh"],
      },
      keyframes: {
        "bounce-small": {
          "0%, 100%": {
            transform: "translateY(-5%)",
            "animation-timing-function": "cubic-bezier(0.8,0,1,1)",
          },
          "50%": {
            transform: "translateY(5%)",
            "animation-timing-function": "cubic-bezier(0,0,0.2,1)",
          },
        },
        "go-from-left": {
          from: {
            transform: "translateX(-50%)",
            opacity: 0,
          },
          to: {
            transform: "translateX(0%)",
            opacity: 1,
          },
        },
        "go-to-left": {
          from: {
            transform: "translateX(0%)",
            opacity: 1,
          },
          to: {
            transform: "translateX(-100%)",
            opacity: 0,
          },
        },
        "go-from-right": {
          from: {
            transform: "translateX(50%)",
            opacity: 0,
          },
          to: {
            transform: "translateX(0%)",
            opacity: 1,
          },
        },
        "notify-scale-in": {
          "0%": {
            transform: "scale(0)",
            opacity: 0,
            visibility: "visible",
          },
          "30%": {
            transform: "scale(1)",
            opacity: 1,
          },
          "70%": {
            transform: "scale(1)",
            opacity: 1,
          },
          "100%": {
            transform: "scale(0)",
            opacity: 0,
            visibility: "hidden",
          },
        },
        "small-pulse": {
          "0%, 100%": {
            opacity: 0.8,
          },
          "100%": {
            opacity: 1,
          },
        },
      },
      animation: {
        "bounce-small": "bounce-small 1s infinite",
        "go-from-left": "go-from-left 0.6s",
        "go-to-left": "go-to-left 1s",
        "go-from-right": "go-from-right 0.6s",
        "notify-scale-in": "notify-scale-in 2s",
        "small-pulse": "small-pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      colors: {
        // primary: "#0D271A",
        primary: "#1B3940",
        "light-primary": "#2D473A",
        secondary: "#AC8E5D",
        "dark-secondary": "#342C20",
        "dark-item": "#474747",
        "bg-main": "#EBEDED",
        "bg-main-shaded": "#E2E2E2",
        shadow: "#E8E8E8",
        "bg-grey": "#D9D9D9",
        "envelope-body": "#9ACAC4",
        "envelope-flap": "#68A094",
        "envelope-bottom": "#89BEB7",
        "envelope-inner": "#97B8B3",
        "envelope-paper": "#FEEEEF",
        "bg-envelope": "#FEFAFA",
        "bg-envelope-bottom": "#868787",
        "illustration-bg": "#B0CCCC",
      },
      transitionDuration: {
        1500: "1500ms",
        2000: "2000ms",
      },
      objectPosition: {
        "cover-image": "40% 0%",
      },
    },
    fontFamily: {
      manuale: ["manuale", "sans-serif"],
      "marcellus-sc": ["Marcellus SC", "serif"],
      "major-mono-display": ["Major Mono Display", "monospace"],
      lato: ["Lato", "sans-serif"],
    },
  },
  plugins: [],
};
