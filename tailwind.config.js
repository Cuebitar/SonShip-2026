/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#E6B153',
        secondary: '#3A2620',
        tertiary: '#F6E9D7',
        highlight: {
          red: '#941708',
          orange: '#FF6F1E',
        },
        dark: '#171717',
        accent: '#ff9a3c',
      },
      fontFamily: {
        heading: ['"Be Vietnam Pro"', 'Inter', 'sans-serif'],
        body: ['Nunito', 'sans-serif'],
        script: ['"Biro Script"', 'cursive'],
        zh: ['"QingNiaoHuaGuang"', 'sans-serif'],
        'zh-body': ['AaManYuShouXieTi', 'sans-serif'],
        serif: ['"Times New Roman"', 'serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'warm': '0 4px 32px 0 rgba(230,177,83,0.18)',
        'warm-lg': '0 8px 48px 0 rgba(230,177,83,0.28)',
        'dark': '0 4px 32px 0 rgba(23,23,23,0.25)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease both',
        'slide-up': 'slideUp 0.6s ease both',
        'slide-right': 'slideRight 0.5s ease both',
        'float': 'float 3s ease-in-out infinite',
        'pulse-warm': 'pulseWarm 2s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(24px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideRight: { '0%': { opacity: '0', transform: 'translateX(-24px)' }, '100%': { opacity: '1', transform: 'translateX(0)' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
        pulseWarm: { '0%,100%': { boxShadow: '0 0 0 0 rgba(230,177,83,0.4)' }, '50%': { boxShadow: '0 0 0 12px rgba(230,177,83,0)' } },
      },
      backgroundImage: {
        'gradient-warm': 'linear-gradient(135deg, #E6B153 0%, #ff9a3c 100%)',
        'gradient-dark': 'linear-gradient(135deg, #3A2620 0%, #171717 100%)',
        'gradient-hero': 'linear-gradient(160deg, #3A2620 0%, #941708 45%, #FF6F1E 100%)',
        'gradient-tertiary': 'linear-gradient(135deg, #F6E9D7 0%, #E6B153 100%)',
      },
    },
  },
  plugins: [],
}
