/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",

  ],
  theme: {
    
    container:{
      center:true
    },

    extend: {
      fontFamily:{
        gemunu: ['Gemunu Libre', 'sans-serif'],
        open:['Open Sans', 'sans-serif']
      },
      colors: {
        'gega-red': '#BC1A45',
        'gega-melon': '#FFD369',
        'gega-grey': '#DDDDDD',
        'gega-white': '#F7F7F7',
        'pek-grey':'#3d3d3d',
        'pek-bg':'rgba(0, 0, 0, 0.80)',
        'pek-yellow':'#FFB800',
        'pek-red':'#D91313'
      },
      spacing:{
        '128':'32rem'
      },
      backgroundImage: {
        'mountain-background': "url('/background.jpg')",
      },
    },
  },
  plugins: [],
}

