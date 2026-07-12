module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#0891b2',
        'primary-light': '#06b6d4',
        'primary-dark': '#0e7490',
        accent: '#06b6d4',
        background: '#f0f9ff',
        brand: {
          cyan500: '#06b6d4',
          cyan600: '#0891b2',
          cyan700: '#0e7490',
          cyan800: '#155e75',
        },
      },
      spacing: {
        'screen-lg': '1024px'
      }
    },
  },
  plugins: [],
}
