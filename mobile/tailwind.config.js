module.exports = {
  presets: [require("nativewind/preset")],
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#7A9E7E',
          foreground: 'white',
        },
        secondary: {
          DEFAULT: '#8B5E3C',
          foreground: 'white',
        },
        background: '#F8F4EC',
      },
      fontFamily: {
        'serif': ['serif'],
        'display': ['serif'],
      }
    },
  },
  plugins: [],
};
