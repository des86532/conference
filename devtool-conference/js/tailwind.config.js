/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./js/**/*.js",
  ],
  darkMode: "class",
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px', // Default md
      'lg': '640px', // Custom override: Desktop starts at 720px
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        primary: "#ff5722",
        secondary: "#4caf50",
        info: "#3b82f6", // Blue for knowledge/narrator
        "background-light": "#f3f4f6",
        "background-dark": "#0a0a0a", // Darker for villain vibe
        "surface-dark": "#151515",
        "surface-light": "#ffffff",
        "neon-green": "#39ff14",
        "neon-orange": "#ff6600",
        "villain-dark": "#050505",
      },
      fontFamily: {
        display: ['"Press Start 2P"', 'cursive'],
        mono: ['"Roboto Mono"', 'monospace'],
        code: ['"Fira Code"', 'monospace'],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'spark': 'spark 1s steps(1) infinite',
        'glitch': 'glitch 1s linear infinite',
        'glitch-slow': 'glitch 3s linear infinite',
        'scanline': 'scanline 8s linear infinite',
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        spark: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        glitch: {
          '2%, 64%': { transform: 'translate(2px,0) skew(0deg)' },
          '4%, 60%': { transform: 'translate(-2px,0) skew(0deg)' },
          '62%': { transform: 'translate(0,0) skew(5deg)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' }
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
};
